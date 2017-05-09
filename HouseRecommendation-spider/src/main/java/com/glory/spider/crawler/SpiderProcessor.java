package com.glory.spider.crawler;

import com.glory.common.entity.SpiderTask;
import com.glory.spider.parse.Parser;
import com.glory.spider.parse.impl.LianJiaParser;
import com.glory.spider.utils.CommonTag;
import com.glory.spider.utils.RequestUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;

import java.util.List;

/**
 * 爬虫抓取结果解析类
 *
 * @author Glory
 * @create 2017-05-06 15:44
 **/
public class SpiderProcessor implements PageProcessor {

    private static Logger logger = LoggerFactory.getLogger(SpiderProcessor.class);
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
        // 请求类型
        String type = String.valueOf(page.getRequest().getExtra(CommonTag.TYPE));

        if (type.equals(CommonTag.SKIP_TYPE)) {
            // 添加内容请求
            List<String> urlList = page.getHtml().links().regex(spiderTask.getUrlParsePattern()).all();
            List<Request> requestList = RequestUtil.createRequestList(urlList, CommonTag.INFO_TYPE);
            requestList.forEach(page::addTargetRequest);
        }

        // 信息提取
        if (type.equals(CommonTag.INFO_TYPE)) {
            Parser parser = new LianJiaParser(page);
            parser.parse();
        }
    }

    @Override
    public Site getSite() {
        return this.site;
    }
}
