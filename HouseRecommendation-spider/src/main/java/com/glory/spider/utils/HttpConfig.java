package com.glory.spider.utils;

import com.glory.common.constant.UserAgent;
import com.glory.spider.crawler.MyHttpClientDownloader;
import com.glory.spider.proxy.AutoProxy;
import com.glory.spider.proxy.ProxyCenter;
import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.http.HttpHost;
import org.apache.http.HttpStatus;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.springframework.web.context.ContextLoader;
import us.codecraft.webmagic.Site;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Http请求配置
 *
 * @author Glory
 * @create 2017-05-07 15:46
 **/
public class HttpConfig {

    /**
     * 默认超时毫秒数
     */
    private static final int DEFAULT_TIMEOUT = 15000;
    /**
     * MyHttpClientDownloader 下载器
     */
    private MyHttpClientDownloader httpClient;
    /**
     * 终端IP，当需要使用终端所在地代理IP时设置
     */
    private String clientIp;
    /**
     * 自动代理
     */
    private AutoProxy autoProxy;
    /**
     * 目标网站策略信息
     */
    private Site site;
    /**
     * 请求头信息
     */
    private Map<String, String> headers;

    /**
     * 请求附加参数
     */
    private Map<String, Object> requestExtras = new HashMap<>();

    /**
     * 是否保留请求头
     */
    private boolean keepHeaders = true;

    /**
     * 是否支持自动跳转
     */
    private Boolean isAutoRedirect = true;

    /**
     *  是否开启返回响应头
     */
    private boolean isGetResponseHeaders = false;

    /**
     * 响应头
     */
    private Map<String, String> responseHeaders;

    /**
     * 追加的cookies,取出就会自动清除掉
     */
    private Table<String, String, String> appendCookies = HashBasedTable.create();

    private int statusCode;

    public HttpConfig(){
        this.initHttpClient();
    }

    public boolean isGetResponseHeaders() {
        return this.isGetResponseHeaders;
    }

    public void setGetResponseHeaders(boolean getResponseHeaders) {
        this.isGetResponseHeaders = getResponseHeaders;
    }

    public Map<String, String> getResponseHeaders() {
        if(this.responseHeaders == null){
            this.responseHeaders = new HashMap<>();
        }
        return this.responseHeaders;
    }

    public void setResponseHeaders(Map<String, String> responseHeaders) {
        this.responseHeaders = responseHeaders;
    }

    public void addResponseHeaders(String name, String value) {
        if(this.responseHeaders == null){
            this.responseHeaders = new HashMap<>();
        }
        this.responseHeaders.put(name, value);
    }

    public AutoProxy getAutoProxy() {
        return this.autoProxy;
    }

    public void setAutoProxy(AutoProxy autoProxy) {
        this.autoProxy = autoProxy;
        this.setProxyToHttpClient();
    }

    public Map<String, Object> getRequestExtras() {
        return requestExtras;
    }

    public void addAllRequestExtras(Map<String, Object> requestExtras) {
        this.requestExtras.putAll(requestExtras);
    }

    public void addRequestExtras(String name, Object value) {
        this.requestExtras.put(name, value);
    }

    public void setHttpClient(MyHttpClientDownloader httpClient) {
        this.httpClient = httpClient;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }

    /**
     * 追加cookie
     * @param domain 域名
     * @param name cookie名
     * @param value cookie值
     */
    public void addAppendCookie(String domain, String name, String value) {
        appendCookies.put(domain, name, value);
    }

    public Table<String, String, String> getAppendCookies() {
        return appendCookies;
    }

    private void initHttpClient() {
        this.httpClient = new MyHttpClientDownloader();
        // 设置代理ip
        if (this.autoProxy == null && null != ContextLoader.getCurrentWebApplicationContext()) {
            ProxyCenter proxyCenter = ContextLoader.getCurrentWebApplicationContext().getBean(ProxyCenter.class);
            this.autoProxy = proxyCenter.availableProxy(0, this.clientIp);// autoProxy中的数据在释放代理时会用到
        }
        this.site = Site.me();
        this.site.setTimeOut(DEFAULT_TIMEOUT);
        this.site.setUserAgent(UserAgent.USER_AGENT_IE8.getValue());
        Set<Integer> acceptStatCodes = new HashSet<>();
        acceptStatCodes.add(HttpStatus.SC_OK);
        acceptStatCodes.add(HttpStatus.SC_MOVED_PERMANENTLY);
        acceptStatCodes.add(HttpStatus.SC_MOVED_TEMPORARILY);
        acceptStatCodes.add(HttpStatus.SC_SEE_OTHER);
        acceptStatCodes.add(HttpStatus.SC_TEMPORARY_REDIRECT);
        this.site.setAcceptStatCode(acceptStatCodes);

        this.setProxyToHttpClient();
    }

    private void setProxyToHttpClient(){
        if(this.autoProxy == null || StringUtils.isEmpty(this.autoProxy.getIp())){
            return;
        }
        HttpHost httpHost = new HttpHost(this.autoProxy.getIp(), this.autoProxy.getPort());
        this.site.setHttpProxy(httpHost);
        UsernamePasswordCredentials usernamePasswordCredentials = null;
        if(StringUtils.isNotEmpty(this.autoProxy.getAccount()) && StringUtils.isNotEmpty(this.autoProxy.getPassword())){
            usernamePasswordCredentials = new UsernamePasswordCredentials(this.autoProxy.getAccount(), this.autoProxy.getPassword());
        }else if(StringUtils.isNotEmpty(this.autoProxy.getPassword())){
            usernamePasswordCredentials = new UsernamePasswordCredentials(this.autoProxy.getPassword());
        }
        if(usernamePasswordCredentials != null) {
            this.site.setUsernamePasswordCredentials(usernamePasswordCredentials);
        }
    }

    /**
     * 设置Fiddler代理
     */
    public void setFiddlerProxy(){
       /* if(SystemConstants.isDebugEnv()){
            autoProxy = new AutoProxy();
            autoProxy.setIp("127.0.0.1");
            autoProxy.setPort(8888);
            setProxyToHttpClient();
        }*/
        autoProxy = new AutoProxy();
        autoProxy.setIp("127.0.0.1");
        autoProxy.setPort(8888);
        setProxyToHttpClient();
    }

    public MyHttpClientDownloader getHttpClient() {
        return this.httpClient;
    }

    /**
     * 设置cookies
     * @param domain 域
     * @param cookies cookies
     */
    public void initHttpClientCookie(String domain, Map<String, String> cookies) {
        if (cookies == null || cookies.isEmpty()) {
            return;
        }
        for (Map.Entry<String, String> entry : cookies.entrySet()) {
            this.site.addCookie(domain, entry.getKey(), entry.getValue());
        }
    }

    /**
     * 设置cookies
     * @param domain 域
     * @param cookies cookies
     */
    public void initHttpClientCookie(String domain, String cookies) {
        if (cookies == null || cookies.isEmpty()) {
            return;
        }
        for (String item : cookies.split(";")) {
            this.site.addCookie(domain, StringUtils.trim(StringUtils.substringBefore(item, "=")), StringUtils.trim(StringUtils.substringAfter(item, "=")));
        }
    }

    public String getClientIp() {
        return this.clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public Map<String, String> getHeaders() {
        return this.headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
        if(headers != null && this.site != null){
            this.site.getHeaders().putAll(headers);
        }
    }

    public void addHeader(String name, String value) {
        if(this.headers != null){
            this.headers.put(name, value);
            if(this.site != null){
                this.site.addHeader(name, value);
            }
        }
    }

    public boolean isKeepHeaders() {
        return this.keepHeaders;
    }

    public void setKeepHeaders(boolean keepHeaders) {
        this.keepHeaders = keepHeaders;
    }

    public Boolean isAutoRedirect() {
        return this.isAutoRedirect;
    }

    public void setAutoRedirect(Boolean autoRedirect) {
        this.isAutoRedirect = autoRedirect;
    }

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }
}
