package com.glory.spider.service;

import com.glory.common.entity.SpiderTask;

/**
 * 爬虫redis缓存服务
 *
 * @author Glory
 * @create 2017-05-05 15:19
 **/
public interface JedisService {

    /**
     * 从缓存队列中提取一个spider任务
     * @return    返回spiderTask任务对象
     */
    SpiderTask popSpiderTask();

    /**
     * 吧一个spider任务压入缓存队列
     */
    void pushSpiderTask(SpiderTask spiderTask);

    boolean removeSpiderTask(SpiderTask spiderTask);
}
