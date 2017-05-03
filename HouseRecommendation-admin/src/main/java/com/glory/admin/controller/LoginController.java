package com.glory.admin.controller;

import com.glory.admin.annotation.ControllerLog;
import com.glory.admin.service.AdminService;
import com.glory.admin.service.impl.AdminServiceImpl;
import com.glory.admin.util.Common;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 登录控制器
 *
 * @author Glory
 * @create 2017-05-03 13:59
 **/
@Controller
@RequestMapping("/admin/")
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private AdminService adminService;

    @RequestMapping("login")
    @ControllerLog(module="登录验证",methods="登录控制-验证登录参数")
    public String login(String name, String password) {
        logger.info("name={}, password={}", name, password);
        return Common.BACKGROUND_PATH + "/index";
    }

    @RequestMapping("index")
    @ControllerLog(module="首页重定向",methods="重定向-验证会话是否已经登录授权")
    public String redirect() {
        return Common.BACKGROUND_PATH + "/index";
    }
}
