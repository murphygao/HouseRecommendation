package com.glory.spider.crawler;

import com.glory.common.util.URLUtil;
import com.google.common.collect.Sets;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.*;
import org.apache.http.client.CookieStore;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.cookie.Cookie;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.downloader.HttpClientDownloader;
import us.codecraft.webmagic.proxy.Proxy;
import us.codecraft.webmagic.utils.HttpConstant;
import us.codecraft.webmagic.utils.UrlUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.SocketTimeoutException;
import java.nio.charset.Charset;
import java.util.*;

/**
 * 基于httpclient的下载器
 *
 * @author Glory
 * @create 2017-05-06 19:27
 **/
public class MyHttpClientDownloader extends HttpClientDownloader {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private static final String DEFAULT_CONTENT_TYPE = "multipart/form-data";
    public static final String DEFAULT_CHARSET = "utf-8";
    public static final String EXTRA_DATA = "data";
    public static final String EXTRA_HEADERS = "headers";
    public static final String EXTRA_CHARSET = "charset";
    public static final String EXTRA_URL_PREFIX = "urlPrefix";
    public static final String EXTRA_IS_AUTO_REDIRECT = "isAutoRedirect";
    public static final String EXTRA_NAME_VALUE_PAIR = "nameValuePair";
    public static final String EXTRA_APPEND_COOKIES = "appendCookies";
    public static final int TIME_OUT_CODE = 900;
    public static final int UNKNOWN_CODE = 999;

    private MyHttpClientGenerator httpClientGenerator;

    public MyHttpClientDownloader() {
        try {
            Field httpClientGeneratorField = HttpClientDownloader.class.getDeclaredField("httpClientGenerator");
            httpClientGeneratorField.setAccessible(true);
            httpClientGenerator = new MyHttpClientGenerator();
            httpClientGeneratorField.set(this, httpClientGenerator);
        } catch (Exception e) {
            logger.error("Init MyHttpClientGenerator occur error! ", e);
        }
    }

    public CloseableHttpResponse downloadResponse(Request request, Task task){
        Site site = null;
        if (task != null) {
            site = task.getSite();
        }
        if(site == null){
            return null;
        }
        logger.info("downloading page {}", request.getUrl());
        CloseableHttpResponse httpResponse = null;
        int statusCode = 0;
        try {
            appendCookies(request);
            httpResponse = httpClientExecute(request, site);
            if(logger.isDebugEnabled()) {
                logger.debug("-----cookies:" + this.getCookies());
            }
            statusCode = httpResponse.getStatusLine().getStatusCode();
        } catch (SocketTimeoutException ex) {
            statusCode = TIME_OUT_CODE;
            logger.warn("download page " + request.getUrl() + " error", ex);
            if (site.getCycleRetryTimes() > 0) {
                return addToCycleRetryRetrunResponse(request, site);
            }
            onError(request);
        } catch (IOException e) {
            statusCode = UNKNOWN_CODE;
            logger.warn("download page " + request.getUrl() + " error", e);
            if (site.getCycleRetryTimes() > 0) {
                return addToCycleRetryRetrunResponse(request, site);
            }
            onError(request);
        } finally {
            request.putExtra(Request.STATUS_CODE, statusCode);
            if (site.getHttpProxyPool() != null && site.getHttpProxyPool().isEnable()) {
                site.returnHttpProxyToPool((HttpHost) request.getExtra(Request.PROXY), (Integer) request
                        .getExtra(Request.STATUS_CODE));
            }
        }
        return httpResponse;
    }

    public Page getPageFromResponse(HttpResponse httpResponse, Request request, Task task){
        if(httpResponse == null){
            return null;
        }
        Site site = null;
        if (task != null) {
            site = task.getSite();
        }
        String charset = null;
        Set<Integer> acceptStatCode;
        if (site != null) {
            charset = site.getCharset();
            acceptStatCode = site.getAcceptStatCode();
        }else{
            acceptStatCode = Sets.newHashSet(HttpStatus.SC_OK);
        }
        Page page = null;
        try {
            int statusCode = httpResponse.getStatusLine().getStatusCode();
            if (statusAccept(acceptStatCode, statusCode)) {
                page = handleResponse(request, charset, httpResponse, task);
                onSuccess(request);
            }else{
                logger.warn("code error " + statusCode + "\t" + request.getUrl());
            }
        } catch (IOException e) {
            logger.warn("getPageFromResponse page " + request.getUrl() + " error", e);
        }
        return page;
    }

    public byte[] getBytesFromResponse(CloseableHttpResponse httpResponse, Request request, Task task){
        byte[] contentBytes = new byte[]{};
        if(httpResponse == null){
            return contentBytes;
        }
        Site site = null;
        if (task != null) {
            site = task.getSite();
        }
        Set<Integer> acceptStatCode;
        if (site != null) {
            acceptStatCode = site.getAcceptStatCode();
        } else {
            acceptStatCode = Sets.newHashSet(HttpStatus.SC_OK);
        }
        try {
            int statusCode = httpResponse.getStatusLine().getStatusCode();
            if (statusAccept(acceptStatCode, statusCode)) {
                contentBytes = readContentFromResponse(httpResponse);
                onSuccess(request);
            } else {
                logger.warn("code error " + statusCode + "\t" + request.getUrl());
            }
        } catch (IOException e) {
            logger.warn("getBytesFromResponse page error url:" + request.getUrl(), e);
            onError(request);
        } finally {
            try {
                EntityUtils.consume(httpResponse.getEntity());
            } catch (IOException e) {
                logger.warn("close response fail", e);
            }
        }
        return contentBytes;
    }

    public List<Cookie> getCookies() {
        List<Cookie> cookies = new ArrayList<>();
        CookieStore cookieStore = this.httpClientGenerator.getCookieStore();
        if(cookieStore != null) {
            cookies = cookieStore.getCookies();
        }
        return cookies;
    }

    @Override
    protected String getContent(String charset, HttpResponse httpResponse) throws IOException {
        String tempCharset = DEFAULT_CHARSET;
        byte[] contentBytes = readContentFromResponse(httpResponse);
        if (charset == null) {
            String htmlCharset = getHtmlCharset(httpResponse, contentBytes);
            if (StringUtils.isNotBlank(htmlCharset)) {
                tempCharset = htmlCharset;
            }
        } else {
            tempCharset = charset;
        }
        return new String(contentBytes, tempCharset);
    }

    @Override
    protected HttpUriRequest getHttpUriRequest(Request request, Site site, Map<String, String> headers,
                                               HttpHost proxy) {
        Map<String, String> tempHeaders = new HashMap<>();
        RequestBuilder requestBuilder = selectRequestMethod(request).setUri(request.getUrl());

        @SuppressWarnings("unchecked")
        Map<String, String> requestHeaders = (Map<String, String>) request.getExtra(EXTRA_HEADERS);
        if (requestHeaders != null) {
            tempHeaders.putAll(requestHeaders);
        } else {
            tempHeaders.putAll(headers);
        }

        if (!tempHeaders.isEmpty()) {
            for (Map.Entry<String, String> headerEntry : tempHeaders.entrySet()) {
                requestBuilder.setHeader(headerEntry.getKey(), headerEntry.getValue());
            }
        }

        RequestConfig.Builder requestConfigBuilder = RequestConfig.custom()
                .setConnectionRequestTimeout(site.getTimeOut())
                .setSocketTimeout(site.getTimeOut())
                .setConnectTimeout(site.getTimeOut())
                .setCookieSpec(CookieSpecs.DEFAULT);
        if (proxy != null) {
            requestConfigBuilder.setProxy(proxy);
            request.putExtra(Request.PROXY, proxy);
        }
        requestBuilder.setConfig(requestConfigBuilder.build());
        return requestBuilder.build();
    }

    @Override
    protected RequestBuilder selectRequestMethod(Request request) {
        String method = (request.getMethod() == null) ? HttpConstant.Method.GET : request.getMethod().toUpperCase();

        Map<String, RequestBuilder> requestBuilderMap = new HashMap<>();
        requestBuilderMap.put(HttpConstant.Method.GET, RequestBuilder.get());
        requestBuilderMap.put(HttpConstant.Method.POST, createPostRequestBuilder(request));
        requestBuilderMap.put(HttpConstant.Method.HEAD, RequestBuilder.head());
        requestBuilderMap.put(HttpConstant.Method.PUT, RequestBuilder.put());
        requestBuilderMap.put(HttpConstant.Method.DELETE, RequestBuilder.delete());
        requestBuilderMap.put(HttpConstant.Method.TRACE, RequestBuilder.trace());

        if (requestBuilderMap.containsKey(method)) {
            return requestBuilderMap.get(method);
        } else {
            throw new IllegalArgumentException("Illegal HTTP Method " + method);
        }
    }

    @Override
    protected String getHtmlCharset(HttpResponse httpResponse, byte[] contentBytes) throws IOException {
        String value = "";
        HttpEntity entity = httpResponse.getEntity();
        if (entity != null && entity.getContentType() != null) {
            value = entity.getContentType().getValue();
        }
        String charset = UrlUtils.getCharset(value);
        if (StringUtils.isNotBlank(charset)) {
            if(logger.isDebugEnabled()) {
                logger.debug("Auto get charset: {}", charset);
            }
            return charset;
        }

        Charset defaultCharset = Charset.defaultCharset();
        String content = new String(contentBytes, defaultCharset.name());

        charset = getCharSetFromContent(content);

        if(logger.isDebugEnabled()) {
            logger.debug("Auto get charset: {}", charset);
        }
        return charset;
    }

    private String getCharSetFromContent(String content) {
        String charset = "";
        if (StringUtils.isEmpty(content)) {
            return charset;
        }
        Document document = Jsoup.parse(content);
        Elements links = document.select("meta");
        if (links != null) {
            Iterator var9 = links.iterator();
            while (var9.hasNext()) {
                Element link = (Element) var9.next();
                String metaContent = link.attr("content");
                String metaCharset = link.attr(EXTRA_CHARSET);
                if (metaContent.contains(EXTRA_CHARSET)) {
                    metaContent = metaContent.substring(metaContent.indexOf(EXTRA_CHARSET), metaContent.length());
                    charset = metaContent.split("=")[1];
                }
                if (StringUtils.isNotEmpty(metaCharset)) {
                    charset = metaCharset;
                }
                if (StringUtils.isNotBlank(charset)) {
                    break;
                }
            }
        }
        return charset;
    }

    private RequestBuilder createPostRequestBuilder(Request request) {
        RequestBuilder requestBuilder = RequestBuilder.post();
        String data = (String) request.getExtra(EXTRA_DATA);
        if (data != null) {
            String charset = (String) request.getExtra(EXTRA_CHARSET);
            String contentType = (String) request.getExtra(HTTP.CONTENT_TYPE);
            if (charset == null) {
                charset = DEFAULT_CHARSET;
            }
            if (contentType == null) {
                contentType = DEFAULT_CONTENT_TYPE;
            }
            requestBuilder.setHeader(HTTP.CONTENT_TYPE, contentType);
            StringEntity entity = new StringEntity(data, Charset.forName(charset));
            entity.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, ContentType.APPLICATION_JSON.getMimeType()));
            requestBuilder.setEntity(entity);
        } else {
            NameValuePair[] nameValuePair = (NameValuePair[]) request.getExtra(EXTRA_NAME_VALUE_PAIR);
            String charset = (String) request.getExtra(EXTRA_CHARSET);
            if (nameValuePair == null || nameValuePair.length == 0) {
                return requestBuilder;
            }
            try {
                if (StringUtils.isNotBlank(charset)) {
                    // 使用指定编码进行URL编码
                    requestBuilder.setEntity(new UrlEncodedFormEntity(Arrays.asList(nameValuePair), charset));
                } else {
                    // 使用默认编码进行URL编码
                    requestBuilder.setEntity(new UrlEncodedFormEntity(Arrays.asList(nameValuePair), DEFAULT_CHARSET));
                }
            } catch (UnsupportedEncodingException e) {
                logger.error("UnsupportedEncodingException {}", e);
            }
        }
        return requestBuilder;
    }

    @Override
    protected Page handleResponse(Request request, String charset, HttpResponse httpResponse, Task task)
            throws IOException {
        int statusCode = (int) request.getExtra(Request.STATUS_CODE);
        Boolean isAutoRedirect = (Boolean) request.getExtra(EXTRA_IS_AUTO_REDIRECT);
        if ((isAutoRedirect == null || isAutoRedirect) && isRedirectStatus(statusCode)) {
            Header header = httpResponse.getFirstHeader("Location");
            String urlPrefix = (String) request.getExtra(EXTRA_URL_PREFIX);
            if(StringUtils.isEmpty(urlPrefix)){
                urlPrefix = URLUtil.getBase(request.getUrl());
            }
            String uri = header.getValue();
            if(!isUrl(uri)){
                if(!uri.startsWith("/")){
                    uri = "/" + uri;
                }
                uri = urlPrefix.concat(uri);
            }
            Request forwardRequest = new Request();
            forwardRequest.setExtras(request.getExtras());
            forwardRequest.setMethod(HttpConstant.Method.GET);
            forwardRequest.setUrl(uri);
            return download(forwardRequest, task);
        }
        return super.handleResponse(request, charset, httpResponse, task);
    }

    @Override
    public Page download(Request request, Task task) {
        CloseableHttpResponse httpResponse = this.downloadResponse(request, task);
        return this.getPageFromResponse(httpResponse, request, task);
    }

    private boolean isRedirectStatus(int statusCode){
        return statusCode == HttpStatus.SC_MOVED_PERMANENTLY ||
                statusCode == HttpStatus.SC_MOVED_TEMPORARILY ||
                statusCode == HttpStatus.SC_SEE_OTHER ||
                statusCode == HttpStatus.SC_TEMPORARY_REDIRECT;
    }

    private CloseableHttpClient getCloseableHttpClient(Site site, Proxy proxy) {
        try {
            Method getHttpClientMethod = this.getClass().getSuperclass().getDeclaredMethod("getHttpClient", Site.class, Proxy.class);
            getHttpClientMethod.setAccessible(true);
            return (CloseableHttpClient) getHttpClientMethod.invoke(this, site, proxy);
        } catch (Exception e) {
            logger.error("invoke getHttpClient occur error! ",e);
        }
        return null;
    }

    private CloseableHttpResponse httpClientExecute(Request request, Site site) throws IOException {
        Map<String, String> headers = site.getHeaders();
        HttpHost proxyHost = null;
        Proxy proxy = null;
        if (site.getHttpProxyPool() != null && site.getHttpProxyPool().isEnable()) {
            proxy = site.getHttpProxyFromPool();
            proxyHost = proxy.getHttpHost();
        } else if(site.getHttpProxy()!= null){
            proxyHost = site.getHttpProxy();
        }

        HttpUriRequest httpUriRequest = getHttpUriRequest(request, site, headers, proxyHost);
        return getCloseableHttpClient(site, proxy).execute(httpUriRequest);
    }

    private CloseableHttpResponse addToCycleRetryRetrunResponse(Request request, Site site) {
        Object cycleTriedTimesObject = request.getExtra(Request.CYCLE_TRIED_TIMES);
        if (cycleTriedTimesObject == null) {
            request.setPriority(0).putExtra(Request.CYCLE_TRIED_TIMES, 1);
        } else {
            int cycleTriedTimes = (Integer) cycleTriedTimesObject;
            cycleTriedTimes++;
            if (cycleTriedTimes >= site.getCycleRetryTimes()) {
                return null;
            }
            request.setPriority(0).putExtra(Request.CYCLE_TRIED_TIMES, cycleTriedTimes);
        }
        return this.downloadResponse(request, site.toTask());
    }

    private boolean isUrl(String uri) {
        boolean isUrl = false;
        if(uri != null && uri.startsWith("http")){
            isUrl = true;
        }
        return isUrl;
    }

    private byte[] readContentFromResponse(HttpResponse httpResponse) throws IOException{
        byte[] content = new byte[]{};
        InputStream contentInputStream = httpResponse.getEntity().getContent();
        int len = (int) httpResponse.getEntity().getContentLength();
        byte[] buffer = new byte[4096];
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            while ((len = contentInputStream.read(buffer)) > -1){
                byteArrayOutputStream.write(buffer, 0, len);
            }
            byteArrayOutputStream.flush();
            content = byteArrayOutputStream.toByteArray();
        } catch (ConnectionClosedException e) {
            if(e.getMessage().contains("Content-Length") && len > 0){
                logger.warn(e.getMessage());
                buffer = new byte[len];
                contentInputStream.read(buffer);
                byteArrayOutputStream.write(buffer);
                byteArrayOutputStream.flush();
                content = byteArrayOutputStream.toByteArray();
            }else{
                throw e;
            }
        }finally {
            try {
                byteArrayOutputStream.close();
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
            try {
                contentInputStream.close();
            }catch (ConnectionClosedException e){
                logger.warn(e.getMessage(), e);
            }
        }
        return content;
    }

    private void appendCookies(Request request){
        Map<String,Map<String, String>> cookies = (Map<String,Map<String, String>>) request.getExtra(EXTRA_APPEND_COOKIES);
        if(cookies != null){
            httpClientGenerator.addCookies(cookies);
            cookies.clear();
        }
    }
}
