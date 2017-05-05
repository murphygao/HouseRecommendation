package com.glory.admin.controller;

import com.glory.admin.annotation.ControllerLog;
import com.glory.admin.entity.Admin;
import com.glory.admin.entity.form.CommonResult;
import com.glory.admin.exception.BusinessException;
import com.glory.admin.service.AdminService;
import com.glory.admin.service.CacheService;
import com.glory.admin.util.CodeMessageEnum;
import com.glory.admin.util.Common;
import com.glory.admin.util.ValidateUtil;
import com.glory.common.redis.JedisCacheGroup;
import com.glory.common.encrypt.EncryptUtil;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;

/**
 * 登录控制器
 *
 * @author Glory
 * @create 2017-05-03 13:59
 **/
@Controller
@RequestMapping("/")
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private AdminService adminService;
    @Autowired
    private CacheService cacheService;

    @ResponseBody
    @RequestMapping("loginValid")
    @ControllerLog(module="登录验证",methods="登录控制-验证登录参数")
    public CommonResult login(HttpServletRequest request, String name, String password) {
        // 执行结果对象
        CommonResult result = new CommonResult();
        // 设置会话id
        String sessionId = request.getSession().getId();
        result.setSessionId(sessionId);

        // 用户名为空
        if (StringUtils.isBlank(name)) {
            result.setCodeAndMessage(CodeMessageEnum.LOGIN_NAME_EMPTY);
            return result;
        }
        // 用户名格式不正确
        if (!ValidateUtil.validName(name)) {
            result.setCodeAndMessage(CodeMessageEnum.LOGIN_NAME_ERROR);
            return result;
        }
        // 密码为空
        if (StringUtils.isBlank(password)) {
            result.setCodeAndMessage(CodeMessageEnum.LOGIN_PASSWORD_EMPTY);
            return result;
        }
        // 密码格式不正确
        if (!ValidateUtil.validPassword(password)) {
            result.setCodeAndMessage(CodeMessageEnum.LOGIN_PASSWORD_FORMAT_ERROR);
            return result;
        }
        // 用户不存在
        Admin admin = adminService.getAdminByName(name);
        if (admin == null) {
            result.setCodeAndMessage(CodeMessageEnum.LOGIN_ADMIN_NO_EXIST);
            return result;
        }
        // 密码不正确
        String encrypt = EncryptUtil.passwordEncrypt(password);
        if (!encrypt.equals(admin.getPassword())) {
            result.setCodeAndMessage(CodeMessageEnum.LOGIN_PASSWORD_ERROR);
            return result;
        }

        // 更新登录时间
        admin.setLoginDateTime(new Date());
        // 添加或更新缓存
        ObjectMapper mapper = new ObjectMapper();
        String value = null;
        try {
            value = mapper.writeValueAsString(admin);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("登录操作，json转换异常");
        }
        cacheService.add(JedisCacheGroup.HOUSE_ADMIN_SESSION, sessionId, value);
        // 设置登录成功消息
        result.setCodeAndMessage(CodeMessageEnum.LOGIN_SUCCESS);

        return result;
    }

    @RequestMapping("index")
    @ControllerLog(module="首页重定向",methods="重定向-验证会话是否已经登录授权")
    public String redirect(HttpServletRequest request) {
        // 缓存查询
        String cacheResult = cacheService.get(JedisCacheGroup.HOUSE_ADMIN_SESSION, request.getSession().getId());
        if (StringUtils.isBlank(cacheResult)) {
            logger.error("重定向错误, 会话未登录授权");
            throw new BusinessException("重定向错误, 会话未登录授权");
        }
        return Common.BACKGROUND_PATH + "/index";
    }

    @RequestMapping("logout")
    @ControllerLog(module="注销",methods="注销-清除登录授权")
    public String logout(HttpServletRequest request) {
        // 清除缓存
        cacheService.remove(JedisCacheGroup.HOUSE_ADMIN_SESSION, request.getSession().getId());
        return "login";
    }
}
