package com.glory.spider.thread;

import com.glory.common.constant.HttpHeader;
import com.glory.common.constant.SystemConstants;
import com.glory.common.entity.SpiderTask;
import com.glory.spider.crawler.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.http.HttpHost;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Spider;
import us.codecraft.webmagic.SpiderListener;
import us.codecraft.webmagic.pipeline.ConsolePipeline;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 爬虫工作线程
 *
 * @author Glory
 * @create 2017-05-06 15:13
 **/
public class SipderWorker implements Runnable {

    private static Logger logger = LoggerFactory.getLogger(MyHttpClientGenerator.class);
    // 任务
    private SpiderTask spiderTask;
    // 配置
    private SpiderConfig spiderConfig;
    // 网络配置
    private Site site;
    // 监听器列表
    protected List<SpiderListener> listeners;

    public SipderWorker(SpiderTask spiderTask, SpiderConfig spiderConfig) {
        this.spiderTask = spiderTask;
        this.spiderConfig = spiderConfig;
        initSite();
    }

    public SipderWorker(SpiderTask spiderTask, SpiderConfig spiderConfig, Site site) {
        this.spiderTask = spiderTask;
        this.spiderConfig = spiderConfig;
        this.site = site;
    }

    @Override
    public void run() {
        Spider spider = initSpider();

        logger.debug("spider启动...");
        spider.run();
    }

    /**
     * webMagic架构初始化
     * @return
     */
    private Spider initSpider() {
        // 初始化设置
        Spider spider = Spider.create(new SpiderProcessor(this.site, spiderConfig, spiderTask))
                .setScheduler(new MyQueueScheduler())
                .setDownloader(new MyHttpClientDownloader())
                .addPipeline(new ConsolePipeline())
                .thread(spiderConfig.getSpiderThreadSize())
                .setExitWhenComplete(true);

        // 添加监听器
        setSpiderListener(spider);
        // 添加请求
        spider.addRequest(initRequest());

        logger.debug("spider初始化完成...");

        return spider;
    }

    /**
     * 初始化请求
     * @return   初始请求
     */
    private Request initRequest() {
        Request request = new Request(spiderTask.getInitUrl());
        request.setMethod(spiderTask.getInitMethod());

        return request;
    }

    /**
     * 初始化Site对象
     */
    private void initSite() {
        this.site = Site.me()
                .setCharset(spiderConfig.getSpiderWorkerEncode())
                .setSleepTime(spiderConfig.getGlobalSleepTime())
                .setRetryTimes(spiderConfig.getGlobalRetryTimes())
                .setTimeOut(spiderConfig.getShutdownTimeoutSeconds());
        // 设置header
        Map<String ,String> headerMap = HttpHeader.getHeader(spiderTask.getHost(), spiderTask.getReferer());
        for (Map.Entry<String, String> header: headerMap.entrySet()) {
            this.site.addHeader(header.getKey(), header.getValue());
        }
        // 设置代理
        if (SystemConstants.isDebugEnv()) {
            this.site.setHttpProxy(new HttpHost("127.0.0.1", 8888));
        }
        // 设置状态码
        Set<Integer> acceptStatCodes = new HashSet<>();
        acceptStatCodes.add(HttpStatus.SC_OK);
        acceptStatCodes.add(HttpStatus.SC_MOVED_PERMANENTLY);
        acceptStatCodes.add(HttpStatus.SC_MOVED_TEMPORARILY);
        acceptStatCodes.add(HttpStatus.SC_SEE_OTHER);
        acceptStatCodes.add(HttpStatus.SC_TEMPORARY_REDIRECT);
        this.site.setAcceptStatCode(acceptStatCodes);

        logger.debug("site初始化完成...");
    }

    /**
     * 添加spider监听器
     *
     * @param spider
     */
    protected void setSpiderListener(Spider spider) {
        if (CollectionUtils.isNotEmpty(listeners)) {
            for (SpiderListener listener : listeners) {
                if (listener instanceof MySpiderListener) {
                    MySpiderListener spiderListener = (MySpiderListener) listener;
                    spiderListener.setSpider(spider);
                }
            }
            spider.setSpiderListeners(listeners);
        }
    }

    /**
     * 爬虫正常退出监听方法
     *
     * @param message 消息
     * @param step    步骤
     */
    protected void normalExitListener(String message, String step) {
        if (CollectionUtils.isNotEmpty(listeners)) {
            for (SpiderListener listener : listeners) {
                if (listener instanceof MySpiderListener) {
                    MySpiderListener spiderListener = (MySpiderListener) listener;
                    spiderListener.normalExit(message, step);
                }
            }
        }
    }

    public void setListener(List<SpiderListener> listeners) {
        this.listeners = listeners;
    }
}
