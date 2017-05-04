package com.glory.admin.util;

/**
 * 结果代码、消息枚举
 *
 * @author Glory
 * @create 2017-05-04 13:59
 **/
public enum CodeMessageEnum {

    // 登录代码、消息枚举
    LOGIN_NAME_EMPTY(1, "login-1000", false, "用户名为空"),
    LOGIN_NAME_ERROR(2, "login-1001", false, "用户名格式错误"),
    LOGIN_PASSWORD_EMPTY(3, "login-1002", false, "密码为空"),
    LOGIN_PASSWORD_FORMAT_ERROR(4, "login-1003", false, "密码格式错误"),
    LOGIN_PASSWORD_ERROR(5, "login-1004", false, "密码不正确"),
    LOGIN_ADMIN_NO_EXIST(6, "login-1005", false, "用户不存在"),
    LOGIN_ERROR(7, "login-1006", false, "登录失败"),
    LOGIN_SUCCESS(8, "login-1007", true, "登录成功"),

    // 加载管理员信息：代码、消息枚举
    ADMIN_NO_LOGIN(9, "admin-1000", false, "用户未登录"),
    ADMIN_LOAD_SUCCESS(10, "admin-1001", true, "用户信息加载成功"),

    // 修改密码：代码、消息枚举
    MODIFY_OLD_EMPTY(11, "modify-1000", false, "旧密码为空"),
    MODIFY_OLD_FORMAT_ERROR(12, "modify-1001", false, "旧密码格式错误"),
    MODIFY_OLD_ERROR(13, "modify-1002", false, "旧密码不正确"),
    MODIFY_NEW_EMPTY(14, "modify-1003", false, "新密码为空"),
    MODIFY_NEW_FORMAT_ERROR(15, "modify-1004", false, "新密码格式错误"),
    MODIFY_FAILURE(16, "modify-1005", false, "密码修改失败"),
    MODIFY_SUCCESS(17, "modify-1006", true, "密码修改成功");

    private int index;
    // 结果代码
    private String code;
    // 结果
    private boolean result;
    // 结果消息
    private String message;

    CodeMessageEnum(int index, String code, boolean result, String message) {
        this.index = index;
        this.code = code;
        this.result = result;
        this.message = message;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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
}
