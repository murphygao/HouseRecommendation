package com.glory.admin.service;

import com.glory.admin.entity.Admin;

import java.util.Date;

/**
 * 管理员操作服务
 *
 * @author Glory
 * @create 2017-05-02 18:35
 **/
public interface AdminService {

    void addAdmin(Admin admin);

    void updateAdmin(Admin admin);

    void updateAdminPassword(long id, String oldPassword, String newPassword);

    void updateAdminLoginDateTime(long id, Date loginDateTime);

    boolean isExist(String name);

    Admin getAdminById(long id);

    Admin getAdminByName(String name);
}
