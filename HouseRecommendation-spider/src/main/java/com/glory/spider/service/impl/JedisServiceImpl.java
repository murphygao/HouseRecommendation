package com.glory.spider.service.impl;

import com.glory.common.entity.SpiderTask;
import com.glory.spider.service.JedisService;

/**
 * redis缓存服务实现类
 *
 * @author Glory
 * @create 2017-05-05 17:57
 **/
public class JedisServiceImpl implements JedisService {

    @Override
    public SpiderTask popSpiderTask() {
        return null;
    }

    @Override
    public void pushSpiderTask(SpiderTask spiderTask) {

    }

    @Override
    public boolean removeSpiderTask(SpiderTask spiderTask) {
        return false;
    }
}
