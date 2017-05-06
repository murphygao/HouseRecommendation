package com.glory.spider;

import com.glory.spider.crawler.Worker;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * 爬虫启动入口
 *
 * @author Glory
 * @create 2017-05-05 21:47
 **/
public class Entry {

    private static final String SPRING_CONTEXT_CONF_FILENAME = "classpath:spring-*.xml";

    private Entry() {
    }

    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(SPRING_CONTEXT_CONF_FILENAME);
        context.registerShutdownHook();
        Worker worker = context.getBean(Worker.class);
        worker.setContext(context);
        worker.start();
    }
}
