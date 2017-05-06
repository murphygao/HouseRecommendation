package com.glory.spider.crawler;

import com.glory.common.entity.SpiderTask;
import org.apache.commons.collections.CollectionUtils;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Spider;
import us.codecraft.webmagic.SpiderListener;
import us.codecraft.webmagic.downloader.HttpClientDownloader;
import us.codecraft.webmagic.pipeline.ConsolePipeline;
import us.codecraft.webmagic.scheduler.QueueScheduler;

import java.util.List;

/**
 * 爬虫工作线程
 *
 * @author Glory
 * @create 2017-05-06 15:13
 **/
class SipderWorker implements Runnable {

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
        spider.start();
    }

    private Spider initSpider() {
        Spider spider = Spider.create(new SpiderProcessor(this.site, spiderConfig, spiderTask))
                .setScheduler(new QueueScheduler())
                .setDownloader(new HttpClientDownloader())
                .addPipeline(new ConsolePipeline())
                .thread(spiderConfig.getSpiderThreadSize())
                .setExitWhenComplete(true);

        // 添加监听器
        setSpiderListener(spider);

        return spider;
    }

    /**
     * 初始化Site对象
     */
    private void initSite() {
        this.site = Site.me()
                .setCharset(spiderConfig.getSpiderWorkerEncode())
                .setSleepTime(spiderConfig.getGlobalSleepTime())
                .setRetryTimes(spiderConfig.getGlobalRetryTimes())
                .setTimeOut(spiderConfig.getShutdownTimeoutSeconds())
                .setUserAgent(UserAgent.getUserAgent());
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
