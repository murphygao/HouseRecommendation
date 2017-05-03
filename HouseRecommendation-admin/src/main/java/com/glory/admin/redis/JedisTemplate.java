/*******************************************************************************
 * Copyright (c) 2005, 2014 springside.github.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *******************************************************************************/
package com.glory.admin.redis;

import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import redis.clients.jedis.*;
import redis.clients.jedis.exceptions.JedisConnectionException;
import redis.clients.util.Pool;

import java.util.*;
import java.util.Map.Entry;

/**
 * JedisTemplate 提供了一个template方法，负责对Jedis连接的获取与归还。 JedisAction<T> 和
 * JedisActionNoResult两种回调接口，适用于有无返回值两种情况。 同时提供一些最常用函数的封装, 如get/set/zadd等。
 *
 * @author Glory
 * @create 2017-04-21 19:33
 */
@Service
public class JedisTemplate {
	private static Logger log = LoggerFactory.getLogger(JedisTemplate.class);

	private JedisPool jedisPool;

	public JedisTemplate(JedisPool jedisPool) {
		this.jedisPool = jedisPool;
	}
	
	private static String getCacheKey(String key, JedisCacheGroup group) {
		return group.getGroupName() + JedisUtils.SPARTOR_GROP + key;
	}
	
	private static String[] getCacheKey(String[] keys, JedisCacheGroup group) {
		List<String> cacheKeys = new ArrayList<>();
		for(String key : keys){
			cacheKeys.add(group.getGroupName() + JedisUtils.SPARTOR_GROP + key);
		}
		return cacheKeys.toArray(new String[cacheKeys.size()]);
	}

	/**
	 * 执行有返回结果的action。
	 */
	private <T> T execute(JedisAction<T> jedisAction){
		Jedis jedis = null;
		try {
			jedis = jedisPool.getResource();
			return jedisAction.action(jedis);
		} catch (JedisConnectionException e) {
			log.error("Redis connection lost.");
			throw e;
		} finally {
			closeResource(jedis);
		}
	}

	/**
	 * 执行无返回结果的action。
	 */
	private void execute(JedisActionNoResult jedisAction){
		Jedis jedis = null;
		try {
			jedis = jedisPool.getResource();
			jedisAction.action(jedis);
		} catch (JedisConnectionException e) {
			log.error("Redis connection lost.");
			throw e;
		} finally {
			closeResource(jedis);
		}
	}

	/**
	 * 根据连接是否已中断的标志，分别调用returnBrokenResource或returnResource。
	 */
	protected void closeResource(Jedis jedis) {
		if (jedis != null) {
			try {
				jedis.close();
			} catch (Exception e) {
				log.error("Error happen when return jedis to pool, try to close it directly.",e);
				JedisUtils.closeJedis(jedis);
			}
		}
	}

	/**
	 * 获取内部的pool做进一步的动作。
	 */
	public Pool<Jedis> getJedisPool() {
		return jedisPool;
	}

	/**
	 * 有返回结果的回调接口定义。
	 */
	@FunctionalInterface
	public interface JedisAction<T> {
		T action(Jedis jedis);
	}

	/**
	 * 无返回结果的回调接口定义。
	 */
	@FunctionalInterface
	public interface JedisActionNoResult {
		void action(Jedis jedis);
	}

	// ////////////// 常用方法的封装 ///////////////////////// //

	// ////////////// 公共 ///////////////////////////
	/**
	 * 删除key, 如果key存在返回true, 否则返回false。
	 */
	public Boolean del(final String... keys) {
		if(keys.length == 0){
			return true;
		}
		return execute((Jedis jedis) -> jedis.del(keys) == 1);
	}
	
	/**
	 * 删除key, 如果key存在返回true, 否则返回false。
	 */
	public Boolean del(final JedisCacheGroup group, final String... keys) {
		if(keys.length == 0){
			return true;
		}
		return execute((Jedis jedis) -> jedis.del(getCacheKey(keys, group)) == 1);
	}

	public Boolean del(final byte[]... keys) {
		if(keys.length == 0){
			return true;
		}
		return execute((Jedis jedis) -> jedis.del(keys) == 1);
	}

	public Boolean exists(final String key) {
		if(StringUtils.isBlank(key)){
			return false;
		}
		return execute((Jedis jedis) -> jedis.exists(key));
	}
	
	public Boolean exists(final String key, final JedisCacheGroup group) {
		if(StringUtils.isBlank(key)){
			return false;
		}
		return execute((Jedis jedis) -> jedis.exists(getCacheKey(key, group)));
	}

	public void expire(final String key, final JedisCacheGroup group){
		if(!StringUtils.isBlank(key)){
			execute((Jedis jedis) -> jedis.expire(getCacheKey(key, group), group.getTimeOut()));
		}
	}


	// ////////////// 关于String ///////////////////////////
	/**
	 * 如果key不存在, 返回null.
	 */
	public String getAsString(final String key, final JedisCacheGroup group) {
		return execute((Jedis jedis) -> jedis.get(getCacheKey(key, group)));
	}
	
	/**
	 * 批量get
	 */
	public List<String> mget(final String[] keys){
		return execute((Jedis jedis) -> jedis.mget(keys));
	}

	/**
	 * 批量get
	 */
	public List<String> mget(final String[] keys, final JedisCacheGroup group){
		return execute((Jedis jedis) -> jedis.mget(getCacheKey(keys, group)));
	}
	
	/**
	 * 如果key不存在, 返回null.
	 */
	public String get(final String key) {
		return execute((Jedis jedis) -> jedis.get(key));
	}

	/**
	 * 如果key不存在, 返回null.
	 */
	public Long getAsLong(final String key, final JedisCacheGroup group) {
		String result = getAsString(key,group);
		return result != null ? Long.valueOf(result) : null;
	}

	/**
	 * 如果key不存在, 返回null.
	 */
	public Integer getAsInt(final String key, final JedisCacheGroup group) {
		String result = getAsString(key,group);
		return result != null ? Integer.valueOf(result) : null;
	}

	public void set(final String key, final String value, final JedisCacheGroup group) {
		execute((Jedis jedis) -> {
			String cacheKey = getCacheKey(key, group);
			jedis.set(cacheKey, value);
			jedis.expire(cacheKey, group.getTimeOut());
		});
	}

	public void set(final String key, final byte[] value, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key, group);
		byte[] skey = SerializationUtils.serialize(cacheKey);
		if (group.isHasIndex()){
			execute((Jedis jedis) -> jedis.sadd(group.getGroupName(), cacheKey));
		}
		execute((Jedis jedis) -> jedis.set(skey, value));
		execute((Jedis jedis) -> jedis.expire(skey, group.getTimeOut()));
	}

	public void setex(final String key, final String value, final int seconds) {
		execute((Jedis jedis) -> jedis.setex(key, seconds, value));
	}

	/**
	 * 如果key还不存在则进行设置，返回true，否则返回false.
	 */
	public Boolean setnx(final String key, final String value) {
		return execute((Jedis jedis) -> jedis.setnx(key, value) == 1);
	}

	/**
	 * 综合setNX与setEx的效果。
	 */
    public Boolean setnxex(final String key, final String value, final int seconds) {
		return execute((Jedis jedis) -> {
			String status = jedis.set(key, value, "NX", "EX", seconds);
			return JedisUtils.isStatusOk(status);
		});
	}

	public Long incr(final String key) {
		return execute((Jedis jedis) -> jedis.incr(key));
	}

	public Long decr(final String key) {
		return execute((Jedis jedis) -> jedis.decr(key));
	}

	public void setex(final byte[] key, final byte[] value, final int seconds) {
		execute((Jedis jedis) -> jedis.setex(key, seconds, value));
	}

	public Object get(final String key, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key, group);
		byte[] skey = SerializationUtils.serialize(cacheKey);
		byte[] svalue = execute((Jedis jedis) -> jedis.get(skey));
		Object value = null;
		if (null != svalue) {
			value = SerializationUtils.deserialize(svalue);
		}
		return value;
	}
	
	public Object get(final String key, final JedisCacheGroup group,boolean serializeKey) {
		String cacheKey = getCacheKey(key, group);
		Object value = null;
		if(serializeKey){
			byte[] skey = SerializationUtils.serialize(cacheKey);
			byte[] svalue = execute((Jedis jedis) -> jedis.get(skey));
			if (null != svalue) {
				value = SerializationUtils.deserialize(svalue);
			}
		}else{
			value = execute((Jedis jedis) -> jedis.get(cacheKey));
		}
		return value;
	}

	/**
	 * 批量获取
	 */
	public Map<byte[],byte[]> getBatch(final Collection<byte[]> keys) {
		return execute((Jedis jedis) -> {
			Map<byte[], Response<byte[]>> result = new HashMap<>();
			Pipeline p = jedis.pipelined();
			for (byte[] key : keys) {
				result.put(key, p.get(key));
			}
			p.sync();
			Map<byte[], byte[]> map = new HashMap<>();
			byte[] value;
			for (Entry<byte[], Response<byte[]>> entry : result.entrySet()) {
				value = entry.getValue().get();
				if (value != null) {
					map.put(entry.getKey(), value);
				}
			}
			return map;
		});
	}

	public Map<String,String> getAsStringBatch(final Collection<String> keys, JedisCacheGroup jedisCacheGroup) {
		return execute((Jedis jedis) -> {
			Map<String, Response<String>> result = new HashMap<>();
			Pipeline p = jedis.pipelined();
			String cacheKey;
			for (String key : keys) {
				cacheKey = getCacheKey(key, jedisCacheGroup);
				result.put(key, p.get(cacheKey));
			}
			p.sync();
			Map<String,String> map = new HashMap<>();
			String value;
			for (Entry<String,Response<String>> entry : result.entrySet()) {
				value = entry.getValue().get();
				if (value!=null) {
					map.put(entry.getKey(), value);
				}
			}
			return map;
		});
	}

	// ////////////// 关于List ///////////////////////////
	public void lpush(final String key, final JedisCacheGroup jedisCacheGroup, final String... values) {
		String cacheKey = getCacheKey(key, jedisCacheGroup);
		execute((Jedis jedis) -> jedis.lpush(cacheKey, values));
	}

	public void lpushBatch(final String key, final JedisCacheGroup jedisCacheGroup, final List<String> values) {
		String cacheKey = getCacheKey(key, jedisCacheGroup);
		execute((Jedis jedis) -> {
			Pipeline p = jedis.pipelined();
			for(String value : values){
				p.lpush(cacheKey, value);
			}
			p.sync();
		});
	}

	public String rpop(final String key, final JedisCacheGroup jedisCacheGroup) {
		String cacheKey = getCacheKey(key, jedisCacheGroup);
		return execute((Jedis jedis) -> jedis.rpop(cacheKey));
	}

	/**
	 * 返回List长度, key不存在时返回0，key类型不是list时抛出异常.
	 */
	public Long llen(final String key) {
		return execute((Jedis jedis) -> jedis.llen(key));
	}

	/**
	 * 删除List中的第一个等于value的元素，value不存在或key不存在时返回false.
	 */
	public Boolean lremOne(final String key, final String value) {
		return execute((Jedis jedis) -> jedis.lrem(key, 1, value) == 1);
	}

	/**
	 * 删除List中的所有等于value的元素，value不存在或key不存在时返回false.
	 */
	public Boolean lremAll(final String key, final String value) {
		return execute((Jedis jedis) -> jedis.lrem(key, 0, value) > 0);
	}

	// ////////////// 关于Sorted Set ///////////////////////////
	/**
	 * 加入Sorted set, 如果member在Set里已存在, 只更新score并返回false, 否则返回true.
	 */
	public Boolean zadd(final String key, final String member, final double score) {
		return execute((Jedis jedis) -> jedis.zadd(key, score, member) == 1);
	}

	/**
	 * 删除sorted set中的元素，成功删除返回true，key或member不存在返回false。
	 */
	public Boolean zrem(final String key, final String member) {
		return execute((Jedis jedis) -> jedis.zrem(key, member) == 1);
	}

	/**
	 * 当key不存在时返回null.
	 */
	public Double zscore(final String key, final String member) {
		return execute((Jedis jedis) -> jedis.zscore(key, member));
	}

	/**
	 * 返回sorted set长度, key不存在时返回0.
	 */
	public Long zcard(final String key) {
		return execute((Jedis jedis) -> jedis.zcard(key));
	}
	
	/**
	 * 增加分数，如果key或member不存在则先新建则增加.
	 */
	public Double zincrby(final String key, final String member, final double score) {
		return execute((Jedis jedis) -> jedis.zincrby(key, score, member));
	}
	
	/**
	 * 按score倒序返回members
	 */
	public Set<String> zrevrange(final String key, final long start, final long end) {
		return execute((Jedis jedis) -> jedis.zrevrange(key, start, end));
	}
	
	/**
	 * 按score倒序返回members,带分数
	 */
	public Set<Tuple> zrevrangeWithScores(final String key, final long start, final long end) {
		return execute((Jedis jedis) -> jedis.zrevrangeWithScores(key, start, end));
	}

	// //////////////////////关于KEY//////////////////////
	/**
	 * 返回匹配表达式的.
	 */
	public Set<String> keys(final String pattern, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(pattern, group);
		return execute((Jedis jedis) -> jedis.keys(cacheKey));
	}
	
	/**
	 * 返回匹配表达式的.
	 */
	public Set<String> keys(final String pattern) {
		return execute((Jedis jedis) -> jedis.keys(pattern));
	}

	public Set<byte[]> keys(final byte[] pattern) {
		return execute((Jedis jedis) -> jedis.keys(pattern));
	}

	/**
	 * 获取超时时间.
	 */
	public Long ttl(final String key, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key, group);
		return execute((Jedis jedis) -> jedis.ttl(cacheKey));
	}

	/**
	 * 批量获取超时时间
	 */
	public Map<String, Long> ttlBatch(final Collection<String> keys) {
		return execute((Jedis jedis) -> {
			Map<String, Response<Long>> result = new HashMap<>();
			Pipeline p = jedis.pipelined();
			for (String key : keys) {
				result.put(key, p.ttl(key));
			}
			p.sync();
			Map<String, Long> map = new HashMap<>();
			for (Entry<String, Response<Long>> entry : result.entrySet()) {
				if (entry.getValue().get() != null) {
					map.put(entry.getKey(), entry.getValue().get());
				}
			}
			return map;
		});
	}
	
	/**
	 * 批量获取keys
	 */
	public Map<String, Set<String>> keysBatch(final Collection<String> patterns) {
		return execute((Jedis jedis) -> {
			Map<String, Response<Set<String>>> result = new HashMap<>();
			Pipeline p = jedis.pipelined();
			for (String pattern : patterns) {
				result.put(pattern, p.keys(pattern));
			}
			p.sync();
			Map<String, Set<String>> map = new HashMap<>();
			for (Entry<String, Response<Set<String>>> entry : result.entrySet()) {
				if (entry.getValue().get() != null) {
					map.put(entry.getKey(), entry.getValue().get());
				}
			}
			return map;
		});
	}

	// /////////////////////关于Hashes//////////////////////

	/**
	 * 如果 field不存在，返回null
	 */
	public String hget(final String key, final String field, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hget(cacheKey, field));
	}

	/**
	 * 批量获取
	 */
	public Map<String, String> hgetAll(final String key, final Collection<String> fields) {
		return execute((Jedis jedis) -> {
			Map<String, Response<String>> result = new HashMap<>();
			Pipeline p = jedis.pipelined();
			for (String field : fields) {
				result.put(field, p.hget(key, field));
			}
			p.sync();
			Map<String, String> map = new HashMap<>();
			for (Entry<String, Response<String>> entry : result.entrySet()) {
				if (entry.getValue().get() != null) {
					map.put(entry.getKey(), entry.getValue().get());
				}
			}
			return map;
		});
	}

	/**
	 * 获取所有
	 */
	public Map<String, String> hgetAll(final String key, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hgetAll(cacheKey));
	}

	public Long hset(final String key, final String field, final String value, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hset(cacheKey, field, value));
	}

	public Long hset(final String key, final Map<String, String> filedValues, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> {
			Pipeline p = jedis.pipelined();
			for (Entry<String, String> e : filedValues.entrySet()) {
				if(e.getValue() == null){
					continue;
				}
				p.hset(cacheKey, e.getKey(), e.getValue());
				p.expire(cacheKey, group.getTimeOut());
			}
			p.sync();
			return (long) filedValues.size();
		});
	}

	public boolean hexists(final String key, final String field, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hexists(cacheKey, field));
	}

	/**
	 * 批量判断
	 */
	public Map<String, Boolean> hexists(final String key, final Collection<String> fields) {
		return execute((Jedis jedis) -> {
			Map<String, Response<Boolean>> result = new HashMap<>();
			Pipeline p = jedis.pipelined();
			for (String field : fields) {
				result.put(field, p.hexists(key, field));
			}
			p.sync();
			Map<String, Boolean> map = new HashMap<>();
			for (Entry<String, Response<Boolean>> entry : result.entrySet()) {
				if (entry.getValue().get()) {
					map.put(entry.getKey(), entry.getValue().get());
				}
			}
			return map;
		});

	}

	public Long hdel(final String key, final String field, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hdel(cacheKey, field));
	}
	
	public Long hdel(final JedisCacheGroup group, final String key, final String... fields) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hdel(cacheKey, fields));
	}

	public Set<String> hkeys(final String key, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hkeys(cacheKey));
	}

	public List<String> hvals(final String key, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hvals(cacheKey));
	}

	public Long hlen(final String key, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hlen(cacheKey));
	}
	
	public Long hincrBy(final String key, final String field, final long value, final JedisCacheGroup group) {
		String cacheKey = getCacheKey(key,group);
		return execute((Jedis jedis) -> jedis.hincrBy(cacheKey, field, value));
	}
	/**
	 * 如果 field不存在，返回null
	 */
	public byte[] hget(final byte[] key, final byte[] field) {
		return execute((Jedis jedis) -> jedis.hget(key, field));
	}

	public Long hset(final byte[] key, final byte[] field, final byte[] value) {
		return execute((Jedis jedis) -> jedis.hset(key, field, value));
	}

	public Long hdel(final byte[] key, final byte[] field) {
		return execute((Jedis jedis) -> jedis.hdel(key, field));
	}

	public Set<byte[]> hkeys(final byte[] key) {
		return execute((Jedis jedis) -> jedis.hkeys(key));
	}

	public List<byte[]> hvals(final byte[] key) {
		return execute((Jedis jedis) -> jedis.hvals(key));
	}
	// /////////////////////关于有索引无序集合Set//////////////////////
	/**
	 * 向名称为 key 的 set 中添加元素
	 */
	public Boolean sadd(final String key, final String value) {
		return execute((Jedis jedis) -> jedis.sadd(key, value) == 1);
	}
	
	/**
	 * 随机返回名称为 key 的 set 的一个元素
	 */
	public String srandmember(final String key){
		return execute((Jedis jedis) -> jedis.srandmember(key));
	}
	
	/**
	 * 返回名称为 key 的 set 的所有元素
	 */
	public Set<String> smembers(final String key){
		return execute((Jedis jedis) -> jedis.smembers(key));
	}
	
	/**
	 * 删除名称为 key 的 set 中的元素
	 */
	public Boolean srem(final String key, final String value) {
		return execute((Jedis jedis) -> jedis.srem(key, value) == 1);
	}
}
