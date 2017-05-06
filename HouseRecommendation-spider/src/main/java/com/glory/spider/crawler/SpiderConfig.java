package com.glory.spider.crawler;

import com.glory.common.constant.SystemConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * 爬虫启动配置
 *
 * @author Glory
 * @create 2017-05-05 14:44
 **/
@Component
public class SpiderConfig {

    @Value("#{settings['spider.pool.thread.size.core']}")
    private int threadPoolSizeCore;

    @Value("#{settings['spider.pool.thread.size.max']}")
    private int threadPoolSizeMax;

    @Value("#{settings['spider.pool.thread.idle.sleepTime']}")
    private int threadPoolIdleSleepTime;

    @Value("#{settings['spider.global.retry.times']}")
    private int globalRetryTimes;

    @Value("#{settings['spider.global.sleepTime']}")
    private int globalSleepTime;

    @Value("#{settings['spider.global.thread.size']}")
    private int spiderThreadSize;

    @Value("#{settings['spider.global.userAgent']}")
    private String globalUserAgent;

    @Value("#{settings['spider.shutdown.timeout.seconds']}")
    private int shutdownTimeoutSeconds;

    @Value("#{settings['spider.worker.encode']}")
    private String spiderWorkerEncode;

    @Value("#{settings['global.debug.switch']}")
    private Boolean debugSwitch;

    @PostConstruct
    public void init(){
        if(debugSwitch != null && debugSwitch == true){
            System.setProperty(SystemConstants.GLOBAL_DEBUG_SWITCH, "true");
        }
    }

    public int getThreadPoolSizeCore() {
        return threadPoolSizeCore;
    }

    public int getThreadPoolSizeMax() {
        return threadPoolSizeMax;
    }

    public int getThreadPoolIdleSleepTime() {
        return threadPoolIdleSleepTime;
    }

    public int getGlobalRetryTimes() {
        return globalRetryTimes;
    }

    public int getGlobalSleepTime() {
        return globalSleepTime;
    }

    public int getSpiderThreadSize() {
        return spiderThreadSize;
    }

    public String getGlobalUserAgent() {
        return globalUserAgent;
    }

    public int getShutdownTimeoutSeconds() {
        return shutdownTimeoutSeconds;
    }

    public String getSpiderWorkerEncode() {
        return spiderWorkerEncode;
    }

    public Boolean getDebugSwitch() {
        return debugSwitch;
    }
}
