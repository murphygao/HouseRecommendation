package com.glory.admin.controller;

import com.glory.admin.annotation.ControllerLog;
import com.glory.admin.util.Common;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 视图控制器
 *
 * @author Glory
 * @create 2017-05-06 13:10
 **/
@Controller
@RequestMapping("/view/")
public class ViewController {

    private static final Logger logger = LoggerFactory.getLogger(ViewController.class);

    @RequestMapping("index")
    @ControllerLog(module="首页重定向",methods="重定向-验证会话是否已经登录授权")
    public String index() {
        return Common.BACKGROUND_PATH + "/index";
    }

    @RequestMapping("model")
    @ControllerLog(module="视图转发",methods="视图转发-通过view参数转发对应视图")
    public String model(String view) {
        return Common.BACKGROUND_PATH + "/" + view;
    }
}
