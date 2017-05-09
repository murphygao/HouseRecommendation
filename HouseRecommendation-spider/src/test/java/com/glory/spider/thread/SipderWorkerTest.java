package com.glory.spider.thread;

import com.glory.common.entity.SpiderTask;
import com.glory.spider.crawler.SpiderConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import us.codecraft.webmagic.utils.HttpConstant;

import java.util.UUID;

/**
 * Created by 荣耀 on 2017/5/7.
 */
@ContextConfiguration(locations = {"classpath*:spring-*.xml"})
@RunWith(SpringJUnit4ClassRunner.class)
public class SipderWorkerTest {

    @Autowired
    SpiderConfig spiderConfig;

    @Test
    public void work() {
        // 任务配置
        SpiderTask spiderTask = new SpiderTask();
        spiderTask.setTaskId(UUID.randomUUID().toString());
        spiderTask.setHost("sz.lianjia.com");
        spiderTask.setReferer("https://sz.lianjia.com/ershoufang/");
        spiderTask.setInitUrl("https://sz.lianjia.com/ershoufang/");
        spiderTask.setInitMethod(HttpConstant.Method.GET);

        // 新建工作线程
        SipderWorker sipderWorker = new SipderWorker(spiderTask, spiderConfig);
        // 启动线程
        sipderWorker.run();
    }
}