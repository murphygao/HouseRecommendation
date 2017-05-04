package com.glory.admin.controller;

import com.glory.admin.annotation.ControllerLog;
import com.glory.admin.entity.Admin;
import com.glory.admin.entity.form.CommonResult;
import com.glory.admin.redis.JedisCacheGroup;
import com.glory.admin.service.AdminService;
import com.glory.admin.service.CacheService;
import com.glory.admin.util.CodeMessageEnum;
import com.glory.admin.util.Common;
import com.glory.admin.util.EncryptUtil;
import com.glory.admin.util.ValidateUtil;
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

/**
 * 管理员操作控制类
 *
 * @author Glory
 * @create 2017-05-04 17:57
 **/
@Controller
@RequestMapping("/admin/")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;
    @Autowired
    private CacheService cacheService;

    @ResponseBody
    @RequestMapping("load")
    @ControllerLog(module="管理员信息加载",methods="管理员信息加载-从缓存中加载用户信息")
    public CommonResult loadAdmin(HttpServletRequest request) throws IOException {
        // 执行结果对象
        CommonResult result = new CommonResult();
        // 设置会话id
        String sessionId = request.getSession().getId();
        result.setSessionId(sessionId);

        // 缓存查询
        String cacheResult = cacheService.get(JedisCacheGroup.HOUSE_ADMIN_SESSION, sessionId);
        if (StringUtils.isBlank(cacheResult)) {
            result.setCodeAndMessage(CodeMessageEnum.ADMIN_NO_LOGIN);
            return result;
        }

        // 反序列化
        ObjectMapper mapper = new ObjectMapper();
        Admin admin = mapper.readValue(cacheResult, Admin.class);
        // 清除密码
        admin.setPassword("");
        result.addData(admin);
        result.setCodeAndMessage(CodeMessageEnum.ADMIN_LOAD_SUCCESS);

        return result;
    }

    @ResponseBody
    @RequestMapping("modify")
    @ControllerLog(module="修改密码",methods="修改密码-根据用户id修改密码")
    public CommonResult modify(HttpServletRequest request, long id, String oldPassword, String newPassword) {
        // 执行结果对象
        CommonResult result = new CommonResult();
        // 设置会话id
        String sessionId = request.getSession().getId();
        result.setSessionId(sessionId);

        if (StringUtils.isBlank(oldPassword)) {
            result.setCodeAndMessage(CodeMessageEnum.MODIFY_OLD_EMPTY);
            return result;
        }
        if (!ValidateUtil.validPassword(oldPassword)) {
            result.setCodeAndMessage(CodeMessageEnum.MODIFY_OLD_FORMAT_ERROR);
            return result;
        }
        if (StringUtils.isBlank(newPassword)) {
            result.setCodeAndMessage(CodeMessageEnum.MODIFY_NEW_EMPTY);
            return result;
        }
        if (!ValidateUtil.validPassword(newPassword)) {
            result.setCodeAndMessage(CodeMessageEnum.MODIFY_NEW_FORMAT_ERROR);
            return result;
        }

        // 旧密码不正确
        Admin admin = adminService.getAdminById(id);
        String oldEncrypt = EncryptUtil.passwordEncrypt(oldPassword);
        if (!oldEncrypt.equals(admin.getPassword())) {
            result.setCodeAndMessage(CodeMessageEnum.MODIFY_OLD_ERROR);
            return result;
        }

        String newEncrypt = EncryptUtil.passwordEncrypt(newPassword);
        admin.setPassword(newEncrypt);
        // 更新admin
        adminService.updateAdmin(admin);
        // 更新成功
        result.setCodeAndMessage(CodeMessageEnum.MODIFY_SUCCESS);

        return result;
    }

    @RequestMapping("modifyView")
    @ControllerLog(module="修改密码页面",methods="修改密码页面-响应修改密码view")
    public String view() {
        return Common.BACKGROUND_PATH + "/modifyPassword";
    }
}
