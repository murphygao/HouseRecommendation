package com.glory.admin.exception;

/**
 * 参数异常类型
 *
 * @author Glory
 * @create 2017-05-02 14:09
 **/
public class IllegalParameterException extends Exception {
    private static final long serialVersionUID = 1L;

    private final String param;

    public IllegalParameterException(String param) {
        this.param = param;
    }

    @Override
    public String getMessage() {
        return "参数错误，缺少参数: " + param;
    }
}
