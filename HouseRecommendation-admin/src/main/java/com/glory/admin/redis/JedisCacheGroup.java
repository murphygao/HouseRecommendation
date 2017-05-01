package com.glory.admin.redis;

/**
 * Redis分组定义
 *
 * @author Glory
 * @create 2017-04-21 19:33
 */
public enum JedisCacheGroup {

	//采集任务任务队列
	FUNDHOUSE_LOGINTASK_QUEUE("FundHouse:LQ", -1, true),
	//采集引擎当前正在执行的任务队列
	FUNDHOUSE_CRAWLER("FundHouse:Crawler", 1 * 60, true),
	//采集引擎session
	FUNDHOUSE_SESSION("FundHouse:Session", 10 * 60, true),
	//采集日志队列
	FUNDHOUSE_LOG_QUEUE("FundHouse:Log", -1, false),
    //百度图片识别
	FUNDHOUSE_BAIDU_OCR("FundHouse:BaiDuOCR",30 * 24 * 60 * 60,true);
	
	private String groupName;
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
