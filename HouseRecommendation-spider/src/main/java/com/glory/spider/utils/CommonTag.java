package com.glory.spider.utils;

/**
 * 静态常量
 *
 * @author Glory
 * @create 2017-05-08 13:27
 **/
public class CommonTag {
    // 跳过解析类型请求
    public static final String SKIP_TYPE = "skip";
    // 解析信息的请求
    public static final String INFO_TYPE = "info";

    // webMagic的request优先级
    private static final long MAX_PRIORITY = 0L;
    private static final long MIDDLE_PRIORITY = 6L;
    private static final long MIN_PRIORITY = 10L;

    // 请求参数键值对常量名
    public static final String NAMEVALUEPAIR = "nameValuePair";
    // 参数类型常量名
    public static final String TYPE = "type";

    private CommonTag(){}
}
