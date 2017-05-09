package com.glory.spider.thread;

import com.glory.common.constant.HttpHeader;
import com.glory.common.thread.Threads;
import com.glory.spider.utils.HttpConfig;
import com.glory.spider.utils.HttpFetchUtils;
import org.junit.Test;
import us.codecraft.webmagic.utils.HttpConstant;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * http抓取测试
 *
 * @author Glory
 * @create 2017-05-07 18:25
 **/
public class HttpFecthTest {

    @Test
    public void fetch() throws IOException {
        HttpConfig config = new HttpConfig();
        config.setFiddlerProxy();
        config.setHeaders(HttpHeader.getHeader("sz.lianjia.com", "https://sz.lianjia.com/ershoufang/"));

        String baseUrl = "https://sz.lianjia.com/api/newhouserecommend";
        String referer;
        String url;

        // 第一次请求
        HttpFetchUtils.get(config, "https://sz.lianjia.com/ershoufang/");
        String result = HttpFetchUtils.get(config, baseUrl + "?type=1&query=https://sz.lianjia.com/ershoufang/");

        for (int count = 2; count < 10; count++) {
            referer = "https://sz.lianjia.com/ershoufang/pg" + count + "/";
            url = baseUrl + "?type=1&query=" + referer;
            HttpFetchUtils.get(config, referer);
            config.getSite().addHeader(HttpConstant.Header.REFERER, referer);
            String res = HttpFetchUtils.get(config, url);
            // 判断是否一样
            if (result.equals(res)) {
                HttpFetchUtils.get(config, "https://www.baidu.com");
            }
            Threads.sleep(2, TimeUnit.SECONDS);
        }
    }

}
