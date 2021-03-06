package com.glory.admin.service.impl;

import com.glory.admin.exception.BusinessException;
import com.glory.admin.service.CacheService;
import com.glory.common.redis.JedisCacheGroup;
import com.glory.common.redis.JedisTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 缓存实现类
 *
 * @author Glory
 * @create 2017-05-03 18:33
 **/
@Service
public class CacheServiceImpl implements CacheService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private JedisTemplate jedisTemplate;

    @Override
    public void add(JedisCacheGroup group, String key, String value) {
        try {
            jedisTemplate.set(key, value, group);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("缓存添加异常");
        }
    }

    @Override
    public boolean remove(JedisCacheGroup group, String key) {
        boolean delFlag = Boolean.FALSE;
        try {
            delFlag = jedisTemplate.del(group, key);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("缓存清除异常");
        }

        return delFlag;
    }

    @Override
    public String get(JedisCacheGroup group, String key) {
        String res = null;
        try {
            res = jedisTemplate.getAsString(key, group);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("缓存获取异常");
        }

        return res;
    }

    @Override
    public List<String> get(JedisCacheGroup group, String... keys) {
        List<String> list = null;
        try {
            list = jedisTemplate.mget(keys, group);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("缓存获取异常");
        }

        return list;
    }

    @Override
    public boolean exists(JedisCacheGroup group, String key) {
        boolean existsFlag = Boolean.FALSE;
        try {
            existsFlag = jedisTemplate.exists(key, group);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new BusinessException("缓存查询异常");
        }

        return existsFlag;
    }

    @Override
    public void expire(JedisCacheGroup group, String key) {
        try {
            jedisTemplate.expire(key, JedisCacheGroup.HOUSE_ADMIN_SESSION);
        } catch (Exception e) {
            throw new BusinessException("缓存时间刷新异常");
        }
    }
}
