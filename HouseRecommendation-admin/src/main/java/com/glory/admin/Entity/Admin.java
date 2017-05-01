package com.glory.admin.Entity;

import java.util.Date;

/**
 * 管理员实体
 *
 * @author Glory
 * @create 2017-05-01 19:33
 **/
public class Admin {

    // 编号
    private long id;
    // 登录名
    private String name;
    // 密码
    private String password;
    // 添加管理员时间
    private Date addDateTime;
    // 最近一次登录时间
    private Date loginDateTime;


}
