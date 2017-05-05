package com.glory.common.encrypt;

import org.apache.commons.codec.digest.DigestUtils;

/**
 * 加密工具类
 *
 * @author Glory
 * @create 2017-05-02 22:45
 **/
public class EncryptUtil {

    public EncryptUtil() {}

    public static String passwordEncrypt(String password) {
        return DigestUtils.md5Hex(password);
    }
}
