package com.glory.common.redis;

/**
 * Redis分组定义
 *
 * @author Glory
 * @create 2017-04-21 19:33
 */
public enum JedisCacheGroup {

	// 采集引擎任务队列
	HOUSE_SPIDER_TASK("House:SpiderTask", 60, true),
	// 采集引擎工作队列
	HOUSE_SPIDER_WORKING("House:SpiderWorking", 10 * 60, true),
	// 采集日志队列
	HOUSE_LOG_QUEUE("House:Log", -1, false),
	// 管理员登录缓存时间
	HOUSE_ADMIN_SESSION("House:AdminSession", 20 * 60,false);

	// 缓存分组名称
	private String groupName;
	// 过期时间
	private int timeOut;
	// 是否加入索引
	private boolean hasIndex;

	JedisCacheGroup(String groupName, int timeOut, boolean hasIndex) {
		this.groupName = groupName;
		this.timeOut = timeOut;
		this.hasIndex = hasIndex;
	}

	public boolean isHasIndex() {
		return hasIndex;
	}

	public int getTimeOut() {
		return timeOut;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
}
