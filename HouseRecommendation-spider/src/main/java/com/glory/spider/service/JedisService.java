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
     * @return    如果队列中存在任务，返回spiderTask任务对象，否则返回null
     */
    SpiderTask popSpiderTask();

    /**
     * 把一个spider任务压入缓存队列
     * @param spiderTask  spider任务
     */
    void pushSpiderTask(SpiderTask spiderTask);

    /**
     * 缓存一个正在执行的spider任务
     * @param spiderTask    spider任务
     */
    void addSpiderWorking(SpiderTask spiderTask);

    /**
     * 删除一个spider任务
     * @param spiderTask  spider任务
     * @return            删除成功返回true。否则返回false
     */
    boolean removeSpiderWorking(SpiderTask spiderTask);

    /**
     * 查询当前spider任务是否已经存在
     * @param spiderTask  spider任务
     * @return            如果存在返回true。否则返回false
     */
    boolean isSpiderTaskExists(SpiderTask spiderTask);


}
