package com.glory.spider.crawler;

import com.glory.common.thread.ThreadContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.util.concurrent.*;

/**
 * 爬虫线程池
 *
 * @author Glory
 * @create 2017-05-05 15:09
 **/
public class MyThreadPoolExecutor extends ThreadPoolExecutor {

    private static final Logger logger = LoggerFactory.getLogger(SpiderConfig.class);

    public MyThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit,
                                BlockingQueue<Runnable> workQueue) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue);
    }

    @Override
    protected void afterExecute(Runnable runnable, Throwable throwable) {
        Throwable myThrowable = null;
        if (throwable == null && runnable instanceof Future<?>) {
            try {
                ((Future<?>) runnable).get();
            } catch (CancellationException ce) {
                myThrowable = ce;
            } catch (ExecutionException ee) {
                myThrowable = ee.getCause();
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }
        MySpiderListener listener = new MySpiderListener();
        if (myThrowable != null){
            logger.error(myThrowable.getMessage(), myThrowable);
            listener.onError(null);
        }
        //不管是成功的结束还是有异常的结束,都需要把当前执行的任务标志给移除掉
        listener.afterExecute();
        super.afterExecute(runnable, throwable);
        //线程使用完后把MDC及ThreadContext清理掉，防止下次使用时出现赃数据
        MDC.clear();
        ThreadContext.clear();
    }
}
