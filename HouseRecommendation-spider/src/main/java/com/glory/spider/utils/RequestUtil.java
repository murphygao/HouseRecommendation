package com.glory.spider.utils;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.utils.HttpConstant;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * webMagic请求reqeust初始化工具
 *
 * @author Glory
 * @create 2017-05-08 12:13
 **/
public class RequestUtil {

    private static Logger logger = LoggerFactory.getLogger(RequestUtil.class);
    // 默认优先级
    private static final long DEFAULT_PRIORITY = 0L;

    private RequestUtil(){}

    /**
     * 请求获取方法
     * @param url		url
     * @param type	    抓取类型：skip、info
     * @return			返回Request对象
     */
    public static Request newRequest(String url, String type) {
        return newRequest(DEFAULT_PRIORITY, url, type);
    }

    /**
     * 请求获取方法
     * @param priority    请求优先级
     * @param url         请求URL
     * @param type        请求类型
     * @return            返回Request对象
     */
    public static Request newRequest(long priority, String url, String type) {
        return newRequest(priority, url, type, HttpConstant.Method.GET);
    }

    public static Request newRequest(String url, String type, String method) {
        return newRequest(DEFAULT_PRIORITY, url, type, method);
    }

    public static Request newRequest(long priority, String url, String type, String method) {
        return newRequest(priority, url, type, method, null);
    }

    /**
     * 创建一个新的webMaigc reqeust
     * @param priority       请求优先级
     * @param url            请求URL
     * @param type           请求类型
     * @param method         请求方法
     * @param queryParams    请求参数集合
     * @return               返回Request对象
     */
    public static Request newRequest(long priority,
                                     String url,
                                     String type,
                                     String method,
                                     Map<String, String> queryParams) {
        // 新建request
        Request req = new Request(url);
        // 设置请求类型
        req.putExtra(CommonTag.TYPE, type);
        // 设置请求方法
        req.setMethod(method);
        // 设置请求优先级
        req.setPriority(priority);
        // 设置请求参数
        if (queryParams != null) {
            req.putExtra(CommonTag.NAMEVALUEPAIR, convertMap2Array(queryParams));
        }

        return req;
    }

    /**
     * 根据URL集合创建request
     * @param priority       请求优先级
     * @param urlList        请求URL集合
     * @param type           请求类型
     * @param method         请求方法
     * @param queryParams    请求参数集合
     * @return               返回Request集合
     */
    public static List<Request> createRequestList(long priority,
                                                  List<String> urlList,
                                                  String type,
                                                  String method,
                                                  Map<String, String> queryParams) {
        // request集合
        List<Request> reqList = new LinkedList<>();
        // 去除重复的URL
        removeDuplicateUrl(urlList);
        // 循环创建reqeust
        for (String url : urlList) {
            reqList.add(newRequest(priority, url, type, method, queryParams));
        }

        return reqList;
    }

    public static List<Request> createRequestList(long priority,
                                                  List<String> urlList,
                                                  String type,
                                                  String method) {

        return createRequestList(priority, urlList, type, method, null);
    }

    public static List<Request> createRequestList(long priority, List<String> urlList, String type) {
        return createRequestList(priority, urlList, type, HttpConstant.Method.GET);
    }

    public static List<Request> createRequestList(List<String> urlList, String type) {
        return createRequestList(DEFAULT_PRIORITY, urlList, type);
    }

    /**
     * 将参数map转换成NameValuePair
     * @param params
     * @return
     */
    private static NameValuePair[] convertMap2Array(Map<String, String> params){
        NameValuePair[] nameValuePair = new NameValuePair[params.size()];
        int index = 0 ;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            nameValuePair[index ++] = new BasicNameValuePair(entry.getKey(),entry.getValue());
        }
        return  nameValuePair;
    }

    /**
     * 去除重复的URL
     * @param urlList
     */
    private static void removeDuplicateUrl(List<String> urlList) {
        HashSet<String> set = new HashSet<>(urlList);
        logger.debug("去除重复的URL: before_remove_size={}, after_remove_size={}", urlList.size(), set.size());
        urlList.clear();
        urlList.addAll(set);
    }
}
