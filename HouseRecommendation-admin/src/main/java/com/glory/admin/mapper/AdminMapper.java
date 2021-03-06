package com.glory.admin.mapper;

import com.glory.admin.entity.Admin;

import java.util.List;

/**
 * 管理员映射类
 *
 * @author Glory
 * @create 2017-05-02 13:47
 **/
public interface AdminMapper {

    Admin selectAdminById(long id);

    Admin selectAdminByName(String name);

    List<Admin> selectAllAdmin();

    void insertAdmin(Admin admin);

    void updateAdmin(Admin admin);
}
