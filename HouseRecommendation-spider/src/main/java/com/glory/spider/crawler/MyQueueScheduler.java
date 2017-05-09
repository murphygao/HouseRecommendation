package com.glory.spider.crawler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.scheduler.DuplicateRemovedScheduler;
import us.codecraft.webmagic.scheduler.MonitorableScheduler;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * request调度队列
 * <p>
 * 扩展QueueScheduler，添加request时全部不进行URL过滤操作
 *
 * @author Glory
 * @create 2017-05-06 19:41
 **/
public class MyQueueScheduler extends DuplicateRemovedScheduler implements MonitorableScheduler {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    private BlockingQueue<Request> queue = new LinkedBlockingQueue<>();

    @Override
    public void push(Request request, Task task) {
        logger.debug("push to queue {}", request.getUrl());
        queue.add(request);
    }

    @Override
    public synchronized Request poll(Task task) {
        return queue.poll();
    }

    @Override
    public int getLeftRequestsCount(Task task) {
        return queue.size();
    }

    @Override
    public int getTotalRequestsCount(Task task) {
        return getDuplicateRemover().getTotalRequestsCount(task);
    }
}
