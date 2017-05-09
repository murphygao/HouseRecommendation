package com.glory.spider.proxy;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class ProxyWeight {

	private int bankType;
	private int adslWeight;
	private int fixedWeight;
	private int thirdWeight;
	private int dialAdslWeight;

	/**
	 * 判断使用的代理类型
	 * @param pecent 1(包含)到100(不包含)之间的数
	 * @return
	 */
	public int judgeProxyType(int pecent) {
		int fixed = fixedWeight;
		int adsl = adslWeight + fixed;
		int dialAdsl = dialAdslWeight + adsl;
		if (pecent <= fixed) {
			return ProxyType.FIXED;
		} else if (pecent <= adsl) {
			return ProxyType.ADSL;
		} else if (pecent <= dialAdsl) {
			return ProxyType.DAIL_ADSL;
		} else {
			return ProxyType.THIRD;
		}
			
	}

	public int getBankType() {
		return bankType;
	}

	public void setBankType(int bankType) {
		this.bankType = bankType;
	}

	public int getAdslWeight() {
		return adslWeight;
	}

	public void setAdslWeight(int adslWeight) {
		this.adslWeight = adslWeight;
	}

	public int getFixedWeight() {
		return fixedWeight;
	}

	public void setFixedWeight(int fixedWeight) {
		this.fixedWeight = fixedWeight;
	}

	public int getThirdWeight() {
		return thirdWeight;
	}

	public void setThirdWeight(int thirdWeight) {
		this.thirdWeight = thirdWeight;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this);
	}

	
}
