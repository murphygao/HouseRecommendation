package com.glory.admin.service;

import com.glory.common.redis.JedisCacheGroup;

import java.util.List;

/**
 * 缓存服务
 *
 * @author Glory
 * @create 2017-05-03 18:13
 **/
public interface CacheService {

    /**
     * 添加字段缓存
     * @param key    缓存key
     * @param value  缓存的value
     * @param group  缓存分组
     */
    void add(JedisCacheGroup group, String key, String value);

    /**
     * 删除缓存字段
     * @param group  缓存分组
     * @param key    缓存的key
     * @return       如果key存在返回true, 否则返回false
     */
    boolean remove(JedisCacheGroup group, String key);

    /**
     * 获取缓存值
     * @param group  缓存分组枚举
     * @param key    缓存key
     * @return       如果key存在, 返回缓存值, 否则返回null
     */
    String get(JedisCacheGroup group, String key);

    /**
     * 批量获取缓存值
     * @param group  缓存分组枚举
     * @param keys   缓存key数组
     * @return       如果key存在, 返回对应的缓存值, 否则对应key位置返回null
     */
    List<String> get(JedisCacheGroup group, String... keys);

    /**
     * 查询key是否存在
     * @param group  缓存分组枚举
     * @param key    缓存key
     * @return       如果key存在，返回true，否则返回false
     */
    boolean exists(JedisCacheGroup group, String key);
}
