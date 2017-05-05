package com.glory.admin.service.impl;

import com.glory.admin.entity.Admin;
import com.glory.admin.exception.BusinessException;
import com.glory.admin.mapper.AdminMapper;
import com.glory.admin.service.AdminService;
import com.glory.common.encrypt.EncryptUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * 管理员操作服务实现类
 *
 * @author Glory
 * @create 2017-05-02 19:06
 **/
@Transactional
@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public void addAdmin(Admin admin) {
        try {
            String encrypt = EncryptUtil.passwordEncrypt(admin.getPassword());
            admin.setPassword(encrypt);
            adminMapper.insertAdmin(admin);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("添加管理员账号异常");
        }
    }

    @Override
    public void updateAdmin(Admin admin) {
        Admin existAdmin = null;
        try {
            existAdmin = adminMapper.selectAdminById(admin.getId());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("管理员账号更新异常");
        }
        // 检查是否存在管理账号
        if (existAdmin == null) {
            throw new BusinessException("未查询到相关管理员账号");
        }

        try {
            existAdmin.setName(admin.getName());
            existAdmin.setPassword(admin.getPassword());
            existAdmin.setLoginDateTime(admin.getLoginDateTime());
            adminMapper.updateAdmin(existAdmin);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("管理员账号更新异常");
        }
    }

    @Override
    public void updateAdminPassword(long id, String oldPassword, String newPassword) {
        if (StringUtils.isBlank(oldPassword)) {
            throw new BusinessException("旧密码为空");
        }
        if (StringUtils.isBlank(newPassword)) {
            throw new BusinessException("新密码为空");
        }
        // 查询更新用户
        Admin admin = adminMapper.selectAdminById(id);
        // 比较密码是否相同
        String oldEncrypt = EncryptUtil.passwordEncrypt(oldPassword);
        if (!oldEncrypt.equals(admin.getPassword())) {
            throw new BusinessException("旧密码错误");
        }
        // 更新密码
        String newEncrypt = EncryptUtil.passwordEncrypt(newPassword);
        admin.setPassword(newEncrypt);
        adminMapper.updateAdmin(admin);
    }

    @Override
    public void updateAdminLoginDateTime(long id, Date loginDateTime) {
        Admin existAdmin = null;
        try {
            existAdmin = adminMapper.selectAdminById(id);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("管理员账号登录更新异常");
        }
        // 检查是否存在管理账号
        if (existAdmin == null) {
            throw new BusinessException("登录更新异常，未查询到相关管理员账号");
        }
        existAdmin.setLoginDateTime(loginDateTime);
        adminMapper.updateAdmin(existAdmin);
    }

    @Override
    public boolean isExist(String name) {
        boolean existFlag = Boolean.FALSE;
        try {
            existFlag = adminMapper.selectAdminByName(name) != null;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("查询管理员账号是否存在异常");
        }
        return existFlag;
    }

    @Override
    public Admin getAdminById(long id) {
        Admin admin = null;
        try {
            admin = adminMapper.selectAdminById(id);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("通过id查询管理员账号异常");
        }

        return admin;
    }

    @Override
    public Admin getAdminByName(String name) {
        Admin admin = null;
        try {
            admin = adminMapper.selectAdminByName(name);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("通过name查询管理员账号异常");
        }

        return admin;
    }
}
