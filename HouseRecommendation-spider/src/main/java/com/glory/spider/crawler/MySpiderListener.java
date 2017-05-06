package com.glory.spider.crawler;

import com.glory.common.entity.SpiderTask;
import com.glory.common.thread.ThreadContext;
import com.glory.common.util.ApplicationContextUtils;
import com.glory.spider.service.JedisService;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Spider;
import us.codecraft.webmagic.SpiderListener;

/**
 * 爬虫监听器
 *
 * @author Glory
 * @create 2017-05-05 15:05
 **/
public class MySpiderListener implements SpiderListener {

    // webmagic spider
    private Spider spider;
    // 爬虫配置
    private SpiderConfig spiderConfig;
    // redis缓存服务
    private JedisService jedisService;

    public MySpiderListener() {
        this.jedisService = ApplicationContextUtils.getBean(JedisService.class);
    }

    public MySpiderListener(SpiderConfig spiderConfig, Spider spider) {
        this();
        this.spiderConfig = spiderConfig;
        this.spider = spider;
    }

    @Override
    public void onSuccess(Request request) {

    }

    @Override
    public void onError(Request request) {

    }

    /**
     * 当前任务线程结束时(含正常结束和异常结束),移除任务标记
     */
    public void afterExecute(){
        SpiderTask spiderTask = ThreadContext.get("SpiderTask");
        if(spiderTask != null){
            jedisService.removeSpiderWorking(spiderTask);
        }
    }

    public void normalExit(String message, String step){
        //记录上一步解析完成的追中日志
        //TraceLogger.infoLog(step, ServerResultStatusEnum.SERVER_SUCCESS.getStatus(), message);
        //记录正常退出的日志
        //TraceLogger.infoLog(StepEnum.NORMAL_EXIT.getStepName(), ServerResultStatusEnum.SERVER_SUCCESS.getStatus(), message);
        //updateSession(Session.STATUS_CRAWL_FAIL,message);
    }

    public void setSpider(Spider spider) {
        this.spider = spider;
    }
}
