package com.glory.admin.entity.form;

import java.util.List;

/**
 * 通用结果实体类
 *
 * @author Glory
 * @create 2017-05-04 13:42
 **/
public class CommonResult {

    // 请求执行结果
    private boolean result;
    // 消息
    private String message;
    // 结果代码
    private String resultCode;
    // 时间戳
    private long timestamp;
    // 返回数据
    private List data;

    public CommonResult() {
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public List getData() {
        return data;
    }

    public void setData(List data) {
        this.data = data;
    }

    public String getResultCode() {
        return resultCode;
    }

    public void setResultCode(String resultCode) {
        this.resultCode = resultCode;
    }

    @Override
    public String toString() {
        return "CommonResult{" +
                "result=" + result +
                ", message='" + message + '\'' +
                ", resultCode='" + resultCode + '\'' +
                ", timestamp=" + timestamp +
                ", data=" + data +
                '}';
    }
}

