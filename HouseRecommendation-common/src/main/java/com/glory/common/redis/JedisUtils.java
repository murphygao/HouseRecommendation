package com.glory.common.redis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.Protocol;

/**
 * Jedis工具类
 *
 * @author Glory
 * @create 2017-04-21 19:33
 */
public class JedisUtils {
	static final Logger log = LoggerFactory.getLogger(JedisUtils.class);
	public static final String DEFAULT_HOST = "localhost";
	public static final int DEFAULT_PORT = Protocol.DEFAULT_PORT;
	public static final int DEFAULT_TIMEOUT = Protocol.DEFAULT_TIMEOUT;
	//组分隔符
	public static final String SPARTOR_GROP = ":";
	//key分隔符
	public static final String SPARTOR_KEY = "_";

	private static final String OK_CODE = "OK";
	private static final String OK_MULTI_CODE = "+OK";
	
	private JedisUtils() {
	}

	/**
	 * 快速设置JedisPoolConfig, 不执行idle checking。
	 */
	public static JedisPoolConfig createPoolConfig(int maxIdle, int maxTotal) {
		JedisPoolConfig poolConfig = new JedisPoolConfig();
		poolConfig.setMaxIdle(maxIdle);
		poolConfig.setMaxTotal(maxTotal);
		poolConfig.setTimeBetweenEvictionRunsMillis(-1);
		return poolConfig;
	}

	/**
	 * 快速设置JedisPoolConfig, 设置执行idle checking的间隔和可被清除的idle时间.
	 * 默认的checkingIntervalSecs是30秒，可被清除时间是60秒。
	 */
	public static JedisPoolConfig createPoolConfig(int maxIdle, int maxTotal, int checkingIntervalSecs,
			int evictableIdleTimeSecs) {
		JedisPoolConfig poolConfig = createPoolConfig(maxIdle, maxTotal);

		poolConfig.setTimeBetweenEvictionRunsMillis(checkingIntervalSecs * 1000L);
		poolConfig.setMinEvictableIdleTimeMillis(evictableIdleTimeSecs * 1000L);
		return poolConfig;
	}

	/**
	 * 判断 是 OK 或 +OK.
	 */
	public static boolean isStatusOk(String status) {
		return (status != null) && (OK_CODE.equals(status) || OK_MULTI_CODE.equals(status));
	}

	/**
	 * 退出然后关闭Jedis连接。如果Jedis为null则无动作。
	 */
	public static void closeJedis(Jedis jedis) {
		if ((jedis != null) && jedis.isConnected()) {
			try {
				jedis.quit();
			} catch (Exception e) {
				log.error("quit jedis fail!", e);
			}
			try {
				jedis.disconnect();
			} catch (Exception e) {
				log.error("close jedis fail!", e);
			}
		}
	}
}
