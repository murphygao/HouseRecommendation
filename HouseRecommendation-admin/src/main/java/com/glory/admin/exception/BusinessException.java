package com.glory.admin.exception;

/**
 * 业务异常类型
 *
 * @author Glory
 * @create 2017-05-02 14:05
 **/
public class BusinessException extends RuntimeException {

    public BusinessException() {
        super();
    }

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(Throwable cause) {
        super(cause);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
