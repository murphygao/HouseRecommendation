package com.glory.admin.entity;

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

    public Admin() {
        super();
    }

    public Admin(long id, String name, String password, Date addDateTime, Date loginDateTime) {
        super();
        this.id = id;
        this.name = name;
        this.password = password;
        this.addDateTime = addDateTime;
        this.loginDateTime = loginDateTime;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }

    public void setLoginDateTime(Date loginDateTime) {
        this.loginDateTime = loginDateTime;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public Date getLoginDateTime() {
        return loginDateTime;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", addDateTime=" + addDateTime +
                ", loginDateTime=" + loginDateTime +
                '}';
    }
}
