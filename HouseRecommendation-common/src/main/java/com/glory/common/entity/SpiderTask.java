package com.glory.common.entity;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * 爬虫任务
 *
 * @author Glory
 * @create 2017-05-05 15:22
 **/
public class SpiderTask {

    // 爬虫任务队列名称
    public static final String SPIDER_TASK_QUEUE_NAME = "SpiderTask";
    // 任务id
    private String taskId;
    // 初始URL
    private String initUrl;
    // 初始查询参数
    private String initQueryParams;
    // 初始内容
    private String initContent;
    // URL过滤规则
    private String urlFilterPattern;
    // URL提取规则
    private String urlParsePattern;
    // 时间戳
    private String timestamp;

    public String getInitUrl() {
        return initUrl;
    }

    public void setInitUrl(String initUrl) {
        this.initUrl = initUrl;
    }

    public String getInitQueryParams() {
        return initQueryParams;
    }

    public void setInitQueryParams(String initQueryParams) {
        this.initQueryParams = initQueryParams;
    }

    public String getInitContent() {
        return initContent;
    }

    public void setInitContent(String initContent) {
        this.initContent = initContent;
    }

    public String getUrlFilterPattern() {
        return urlFilterPattern;
    }

    public void setUrlFilterPattern(String urlFilterPattern) {
        this.urlFilterPattern = urlFilterPattern;
    }

    public String getUrlParsePattern() {
        return urlParsePattern;
    }

    public void setUrlParsePattern(String urlParsePattern) {
        this.urlParsePattern = urlParsePattern;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * 通过属性计算出唯一key
     *
     * @return
     */
    public String getUniqueKey() {
        // 哈希字符串
        StringBuilder hashStr = new StringBuilder();
        // 字符串拼接
        hashStr.append("taskId:").append(taskId);
        hashStr.append("_timestamp:").append(timestamp);
        if (StringUtils.isNoneBlank(initUrl)) {
            hashStr.append("_initUrl:").append(initUrl);
        }
        if (StringUtils.isNoneBlank(initUrl)) {
            hashStr.append("_queryParams:").append(initQueryParams);
        }
        if (StringUtils.isNoneBlank(initUrl)) {
            hashStr.append("_initContent:").append(initContent);
        }
        if (StringUtils.isNoneBlank(initUrl)) {
            hashStr.append("_urlFilterPattern:").append(urlFilterPattern);
        }
        if (StringUtils.isNoneBlank(initUrl)) {
            hashStr.append("_urlParsePattern:").append(urlParsePattern);
        }

        return DigestUtils.md5Hex(hashStr.toString());
    }

    @Override
    public String toString() {
        return "SpiderTask{" +
                "taskId='" + taskId + '\'' +
                ", initUrl='" + initUrl + '\'' +
                ", initQueryParams='" + initQueryParams + '\'' +
                ", initContent='" + initContent + '\'' +
                ", urlFilterPattern='" + urlFilterPattern + '\'' +
                ", urlParsePattern='" + urlParsePattern + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}
