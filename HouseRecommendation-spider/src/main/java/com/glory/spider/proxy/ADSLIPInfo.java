package com.glory.spider.proxy;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import java.io.Serializable;

/**
 * [{"ip":"117.86.203.32","port":808,"pronvice":"江苏","city":"南通","id":"0005",
 * "provider":"电信",
 * "status":1,"refId":"1466401754378_056","connectionCountSocket"
 * :0,"connectionCountHttp":0, "sameProvince":false}]
 * 
 * @author liyuncong
 * 
 */
public class ADSLIPInfo implements Serializable {

	private static final long serialVersionUID = -3430310341075257851L;

	private String ip;
	// 端口
	private int port;
	// 省份
	private String pronvice;
	// 城市
	private String city;
	// 编号
	private String id;
	// 运营商
	private String provider;
	// 状态
	private int status = STATUS_NORMAL;
	// 引用ID
	private String refId;
	private int connectionCountSocket;
	private int connectionCountHttp;
	private boolean sameProvince;

	public static final int STATUS_NORMAL = 1;
	public static final int STATUS_UNUSABLE = 0;

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getPronvice() {
		return pronvice;
	}

	public void setPronvice(String pronvice) {
		this.pronvice = pronvice;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getRefId() {
		return refId;
	}

	public void setRefId(String refId) {
		this.refId = refId;
	}

	public int getConnectionCountSocket() {
		return connectionCountSocket;
	}

	public void setConnectionCountSocket(int connectionCountSocket) {
		this.connectionCountSocket = connectionCountSocket;
	}

	public int getConnectionCountHttp() {
		return connectionCountHttp;
	}

	public void setConnectionCountHttp(int connectionCountHttp) {
		this.connectionCountHttp = connectionCountHttp;
	}

	public boolean isSameProvince() {
		return sameProvince;
	}

	public void setSameProvince(boolean sameProvince) {
		this.sameProvince = sameProvince;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this,
				ToStringStyle.SHORT_PREFIX_STYLE);
	}

	/**
	 * 串接代理 redis key
	 * 
	 * @return
	 */
	public String getProxyRedisKey() {
		if (pronvice != null && city != null && id != null) {
			return pronvice + "_" + city + "_" + id;
		}
		return null;
	}
}
