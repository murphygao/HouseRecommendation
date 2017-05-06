package com.glory.spider.crawler;

import com.glory.common.entity.SpiderTask;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;

/**
 * 爬虫抓取结果解析类
 *
 * @author Glory
 * @create 2017-05-06 15:44
 **/
public class SpiderProcessor implements PageProcessor {

    // 网络配置
    private Site site;
    // 爬虫配置
    private SpiderConfig spiderConfig;
    // 爬虫任务
    private SpiderTask spiderTask;

    public SpiderProcessor(Site site, SpiderConfig spiderConfig, SpiderTask spiderTask) {
        this.site = site;
        this.spiderConfig = spiderConfig;
        this.spiderTask = spiderTask;
    }

    @Override
    public void process(Page page) {

    }

    @Override
    public Site getSite() {
        return this.site;
    }
}
