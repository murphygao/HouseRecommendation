package com.glory.spider.service.impl;

import com.alibaba.fastjson.JSON;
import com.glory.common.entity.SpiderTask;
import com.glory.common.redis.JedisCacheGroup;
import com.glory.common.redis.JedisTemplate;
import com.glory.spider.service.JedisService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * redis缓存服务实现类
 *
 * @author Glory
 * @create 2017-05-05 17:57
 **/
@Service
public class JedisServiceImpl implements JedisService {

    @Autowired
    private JedisTemplate jedisTemplate;

    @Override
    public SpiderTask popSpiderTask() {
        // 从redis缓存队列中取出一个任务
        String spiderTaskJson = jedisTemplate.rpop(SpiderTask.SPIDER_TASK_QUEUE_NAME, JedisCacheGroup.HOUSE_SPIDER_TASK);
        if(StringUtils.isNotEmpty(spiderTaskJson)){
            return JSON.parseObject(spiderTaskJson, SpiderTask.class);
        }
        return null;
    }

    @Override
    public void pushSpiderTask(SpiderTask spiderTask) {
        String json = JSON.toJSONString(spiderTask);
        // 以list方式压入redis缓存队列
        jedisTemplate.lpush(SpiderTask.SPIDER_TASK_QUEUE_NAME, JedisCacheGroup.HOUSE_SPIDER_TASK, json);
    }

    @Override
    public void addSpiderWorking(SpiderTask spiderTask) {
        String json = JSON.toJSONString(spiderTask);
        jedisTemplate.set(spiderTask.getUniqueKey(), json, JedisCacheGroup.HOUSE_SPIDER_WORKING);
    }

    @Override
    public boolean removeSpiderWorking(SpiderTask spiderTask) {
        return jedisTemplate.del(JedisCacheGroup.HOUSE_SPIDER_WORKING, spiderTask.getUniqueKey());
    }


    @Override
    public boolean isSpiderTaskExists(SpiderTask spiderTask) {
        return jedisTemplate.exists(spiderTask.getUniqueKey(), JedisCacheGroup.HOUSE_SPIDER_WORKING);
    }
}
