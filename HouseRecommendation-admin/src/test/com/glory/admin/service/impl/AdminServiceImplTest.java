package com.glory.admin.service.impl;

import com.glory.admin.entity.Admin;
import com.glory.admin.service.AdminService;
import com.glory.admin.test.TestBase;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

import static org.junit.Assert.assertTrue;

/**
 * Created by 荣耀 on 2017/5/2.
 */
public class AdminServiceImplTest extends TestBase {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    AdminService adminService;

    @Test
    public void addAdmin() throws Exception {
        Admin admin = new Admin("glory", "liuyao1216");
        adminService.addAdmin(admin);
    }

    @Test
    public void updateAdmin() throws Exception {
        Admin admin = new Admin();
        admin.setId(1L);
        admin.setName("刘荣耀");
        adminService.updateAdmin(admin);
    }

    @Test
    public void updateAdminPassword() throws Exception {
        adminService.updateAdminPassword(1L, "liuyao1216", "123456");
    }


    @Test
    public void updateAdminLoginDateTime() throws Exception {
        adminService.updateAdminLoginDateTime(1L, new Date());
    }

    @Test
    public void isExist() throws Exception {
        assertTrue(adminService.isExist("刘荣耀"));
    }

    @Test
    public void selectAdminById() throws Exception {
        logger.info("admin={}", adminService.getAdminById(1L).toString());
    }

    @Test
    public void selectAdminByName() throws Exception {
        logger.info("admin={}", adminService.getAdminByName("刘荣耀").toString());
    }
}