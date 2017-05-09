package com.glory.spider.proxy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Lazy(false)
public class ProxyCenter {

	@Value("#{settings['mode']}")
	private String mode;
	@Autowired
	private DialADSLProxyCenter dialADSLProxyCenter;


	private static final Random ram = new Random();

	private Map<Integer, ProxyWeight> proxyWeighttMap = new ConcurrentHashMap<>();

	public synchronized AutoProxy availableProxy(int bankType, String clientIp) {
		// 本地开发，不用代理，或者用特定代理
		int proxyType;
		if (!"dev".equals(mode)) {
			AutoProxy autoProxy = null;
			ProxyWeight proxyWeight = proxyWeighttMap.get(bankType);
			if (proxyWeight != null) {
				// 用随机数来区分百分比
				proxyType = proxyWeight.judgeProxyType(ram.nextInt(100));

				if (ProxyType.DAIL_ADSL == proxyType) {
					autoProxy = dialADSLProxyCenter.pop(clientIp);
				} else {
					autoProxy = null;
				}
			}
			return autoProxy;
		} else {
			return null;
		}
	}

}
