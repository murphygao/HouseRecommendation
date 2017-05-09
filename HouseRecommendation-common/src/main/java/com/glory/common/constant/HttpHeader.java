package com.glory.common.constant;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Http请求头常量设置
 *
 * @author Glory
 * @create 2017-05-07 15:03
 **/
public class HttpHeader {

    private HttpHeader(){}

    public static Map<String, String> getHeader(String host, String referer) {
        Map<String, String> headerMap = new LinkedHashMap<>();
        headerMap.put("Host", host);
        headerMap.put("Connection", "keep-alive");
        headerMap.put("Upgrade-Insecure-Requests", "1");
        headerMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36");
        headerMap.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        headerMap.put("Referer", referer);
        headerMap.put("Accept-Encoding", "gzip, deflate, sdch, br");
        headerMap.put("Accept-Language", "zh-CN,zh;q=0.8");

        return headerMap;
    }
}
