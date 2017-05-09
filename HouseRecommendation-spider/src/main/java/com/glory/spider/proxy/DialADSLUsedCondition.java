package com.glory.spider.proxy;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import java.io.Serializable;

public class DialADSLUsedCondition implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 6933131325956467353L;
	
	private int usedTime;
	private ADSLIPInfo adslIpInfo;
	
	public int getUsedTime() {
		return usedTime;
	}
	public void setUsedTime(int usedTime) {
		this.usedTime = usedTime;
	}
	public ADSLIPInfo getAdslIpInfo() {
		return adslIpInfo;
	}
	public void setAdslIpInfo(ADSLIPInfo adslIpInfo) {
		this.adslIpInfo = adslIpInfo;
	}
	
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}
}
