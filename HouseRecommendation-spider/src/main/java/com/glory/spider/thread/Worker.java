package com.glory.spider.thread;

import com.glory.common.entity.SpiderTask;
import com.glory.common.thread.ShutdownHookUtils;
import com.glory.common.thread.Threads;
import com.glory.spider.crawler.MySpiderListener;
import com.glory.spider.crawler.SpiderConfig;
import com.glory.spider.service.JedisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;
import us.codecraft.webmagic.SpiderListener;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * 爬虫工作线程
 *
 * @author Glory
 * @create 2017-05-05 21:48
 **/
@Service
public class Worker {

    private static final Logger logger = LoggerFactory.getLogger(Worker.class);

    @Autowired
    private SpiderConfig spiderConfig;
    @Autowired
    private JedisService jedisService;
    // 爬虫工作线程池
    private MyThreadPoolExecutor workerExecutor;
    // spring上下文环境
    private ConfigurableApplicationContext context;

    @PostConstruct
    public void init() {
        workerExecutor = new MyThreadPoolExecutor(
                spiderConfig.getThreadPoolSizeCore(),
                spiderConfig.getThreadPoolSizeMax(),
                0L,
                TimeUnit.MILLISECONDS,
                new ArrayBlockingQueue<>(spiderConfig.getThreadPoolSizeMax()));
        ShutdownHookUtils.hook(workerExecutor, spiderConfig.getShutdownTimeoutSeconds());
    }

    /**
     * 设置spring上下文
     *
     * @param context
     */
    public void setContext(ConfigurableApplicationContext context) {
        this.context = context;
    }

    /**
     * 启动爬虫任务监听方法
     */
    public void start() {
        while (true) {
            // 当前活跃线程数
            int activeCount = workerExecutor.getActiveCount();
            if (activeCount > 0) {
                logger.info("work_executor active count: {}", activeCount);
            }
            //活跃线程数不超过线程池最大值时才取任务
            if (activeCount < spiderConfig.getThreadPoolSizeMax()) {
                // 提交、执行任务
                submitTask();
            }
            // 否则当前线程休眠等待
            else {
                Threads.sleep(spiderConfig.getThreadPoolIdleSleepTime(), TimeUnit.MILLISECONDS);
            }
            // 如果监听到退出信号，工作线程退出
            if (workerExecutor.isShutdown()) {
                break;
            }
        }
        context.close();
    }

    private void submitTask() {
        SpiderTask spiderTask = null;
        try {
            spiderTask = jedisService.popSpiderTask();
        } catch (Exception e) {
            logger.error("pop spider task error.", e);
            return;
        }
        if (spiderTask == null) {
            Threads.sleep(spiderConfig.getThreadPoolIdleSleepTime(), TimeUnit.MILLISECONDS);
            return;
        }
        logger.info("pop one spiderTask: " + spiderTask);

        try {
            //此处要限制"同一个人"登录请求被同时执行,容易引发数据库数据重复
            if (jedisService.isSpiderTaskExists(spiderTask)) {
                logger.info("Current spiderTask is duplicate submit.Please wait for the previous task to completed.");
                //当同一个人请求了多个任务时,如果有一个任务在执行中,那么当前任务被放到待执行任务的队列末尾
                jedisService.pushSpiderTask(spiderTask);
            } else {
                //该日志为了方便统计最终执行的任务跟放入队列的是否一致
                logger.info("execute spiderTask, spiderTask = {}.", spiderTask.toString());
                //每个请求任务开始之前要标记一下正在执行中,线程结束时会移除掉,见MyThreadPoolExecutor
                jedisService.addSpiderWorking(spiderTask);

                SipderWorker sipderWorker = new SipderWorker(spiderTask, spiderConfig);
                List<SpiderListener> listeners = new ArrayList<>();
                listeners.add(new MySpiderListener());
                sipderWorker.setListener(listeners);

                workerExecutor.submit(sipderWorker);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }
}
