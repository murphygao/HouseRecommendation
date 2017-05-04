package com.glory.admin.util;

import java.util.regex.Pattern;

/**
 * 数据验证工具
 *
 * @author Glory
 * @create 2017-05-04 14:22
 **/
public class ValidateUtil {

    // 用户名校验正则
    private static final String NAME_REGEX = "^[0-9a-zA-Z_@\\u4e00-\\u9fa5]{2,}$";
    // 密码校验正则
    private static final String PASSWORD_REGEX = "^[0-9a-zA-Z_!@#$%^&*)(-=+;:,?></]{3,}$";

    private ValidateUtil() {
    }

    /**
     * 校验用户名是否符合预期格式
     *
     * @param name 用户名
     * @return 如果符合预期格式，返回true，否则返回false
     */
    public static boolean validName(String name) {
        return valid(NAME_REGEX, name);
    }

    /**
     * 校验密码是否符合预期格式
     *
     * @param password 密码
     * @return 如果符合预期格式，返回true，否则返回false
     */
    public static boolean validPassword(String password) {
        return valid(PASSWORD_REGEX, password);
    }

    private static boolean valid(String pattern, String content) {
        return Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(content).find();
    }
}
