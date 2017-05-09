package com.glory.spider.proxy;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

import java.io.Serializable;

public class AutoProxy implements Serializable {

	private static final long serialVersionUID = -7802788260236910005L;
	// 代理id, 该代理的唯一标识
	private String id;
	/** 代理IP */
	private String ip = "";
	/** 端口 */
	private int port = 0;
	// 对应ProxyType中的值
	private int type = 0;
	// 使用该代理需要的账户和密码
	private String account;
	private String password;
	// 代理ip与客户端ip是否属于同省
	private boolean sameProvinceWithClientIp;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isSameProvinceWithClientIp() {
		return sameProvinceWithClientIp;
	}

	public void setSameProvinceWithClientIp(boolean sameProvinceWithClientIp) {
		this.sameProvinceWithClientIp = sameProvinceWithClientIp;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this);
	}

	/**
	 * 
	 * @return 我们关注的代理的一些细节
	 */
	public String getDescription() {
		return "代理ip：" + ip + "===代理ip与客户端ip是否同省:" + sameProvinceWithClientIp;
	}

}
