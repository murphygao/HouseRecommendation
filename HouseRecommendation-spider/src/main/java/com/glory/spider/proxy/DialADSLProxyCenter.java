package com.glory.spider.proxy;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.List;

import static org.apache.http.impl.client.HttpClients.createDefault;

/**
 * 获得拨号ADSL代理
 * @author liyuncong
 *
 */
@Component
public class DialADSLProxyCenter {
	public static final Logger logger = LoggerFactory.getLogger(DialADSLProxyCenter.class);

	// s.feidee.com 10.192.1.62
	@Value("#{settings['proxy.ip.server']}")
	private String proxyIPServer;

	private static final String CONTENT_TYPE = "Content-Type";

	private static final String CONTENT_TYPE_FORM = "application/x-www-form-urlencoded";

	/**
	 * 获取一个代理
	 * 
	 * @return 成功时返回代理，失败时返回null
	 */
	public AutoProxy pop(String clientIp) {
		String proxyJson;
		
		// 应对获取代理时，返回结果为[]的情况
		int count = 0;
		do {
			proxyJson = getOneProxy(clientIp);
		} while ((proxyJson == null || proxyJson.length() < 5) && ++count < 3);
		
		// 1000是一个大于proxyJson长度的我随意想的一个数
		if (proxyJson == null || !proxyJson.contains("[") || proxyJson.length() < 5 || proxyJson.length() > 1000) {
			return null;
		}

		try {
			Gson gson = new Gson();
			JsonArray proxys = gson.fromJson(proxyJson, JsonArray.class);
			JsonObject proxy = proxys.get(0).getAsJsonObject();
			ADSLIPInfo adslIpInfo = gson.fromJson(proxy, ADSLIPInfo.class);

            increase(adslIpInfo);

			return createAutoProxy(adslIpInfo);
		} catch (Exception e) {
			logger.error("获取代理异常:{} clientIp:{} 获取代理返回结果:{}", e.getMessage(), clientIp, proxyJson, e);
		}
		return null;
	}

	private AutoProxy createAutoProxy(ADSLIPInfo adslIpInfo){
		AutoProxy autoProxy = new AutoProxy();
		autoProxy.setType(ProxyType.DAIL_ADSL);
		autoProxy.setId(adslIpInfo.getProxyRedisKey());
		autoProxy.setIp(adslIpInfo.getIp());
		autoProxy.setPort(adslIpInfo.getPort());
		autoProxy.setAccount("cardniu");
		autoProxy.setPassword("iek*(202KJ");
		autoProxy.setSameProvinceWithClientIp(adslIpInfo.isSameProvince());
		return autoProxy;
	}

	/**
	 * 把该代理的使用次数加1
	 * 
	 * @param adslIpInfo
	 */
	public static void increase(ADSLIPInfo adslIpInfo) {
		DialADSLUsedCondition condition = new DialADSLUsedCondition();
		condition.setAdslIpInfo(adslIpInfo);
		condition.setUsedTime(condition.getUsedTime() + 1);
	}

	/**
	 * 释放代理
	 *
	 * @param adslIpInfo
	 * @return
	 */
	public String releaseProxy(ADSLIPInfo adslIpInfo) {
		if (adslIpInfo == null) {
			return null;
		}

		String url = proxyIPServer + "/releaseProxy.do";
		HttpPost httpPost = new HttpPost(url);

		// 设置请求和传输超时时间
		RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(10000).setSocketTimeout(10000).build();
		httpPost.setConfig(requestConfig);
		try {
			Gson gson = new Gson();
			String parameter = gson.toJson(adslIpInfo);
			List<NameValuePair> nvps = new LinkedList<>();
			nvps.add(new BasicNameValuePair("ipInfoJson", parameter));
			httpPost.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
			httpPost.setHeader(CONTENT_TYPE, CONTENT_TYPE_FORM);
			return sendRequest(httpPost);
		} catch (Exception e) {
			logger.error("释放代理异常:{}", e.getMessage(), e);
		}

		return null;
	}

	/**
	 * 发送请求。
	 * 
	 * @param request
	 * @return
	 */
	private static String sendRequest(HttpUriRequest request) {
		CloseableHttpClient httpClient = createDefault();

		CloseableHttpResponse response = null;
		try {
			response = httpClient.execute(request);
			// 得到相应实体、包括响应头以及相应内容
			HttpEntity entity = response.getEntity();
			// 得到response的内容
			return EntityUtils.toString(entity, "utf-8");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (Exception e) {
					logger.error(e.getMessage(), e);
				}
			}

			try {
				httpClient.close();
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
			}
		}
		return "";
	}
	
	/**
	 * 
	 * @param clientIp 客户端ip
	 * @param count 返回的代理ip数量
	 * @param randomGlobal 1 如果没有与该ip同省的代理ip，则随机返回；0 如果没有与该ip同省的代理ip，则不返回
	 * @return 返回与clientIp同省的代理ip，如果这样的ip不存在，则随机返回代理ip
	 */
	public String getProxy(String clientIp, int count, int randomGlobal) {
		String url = proxyIPServer + "/getProxyRandom.do?count=" + count;

		if (StringUtils.isNotBlank(clientIp)) {
			url = proxyIPServer + "/getProxyByIp.do?ip=" + clientIp
					+ "&count=" + count + "&randomGlobal=" + randomGlobal;
		}

		HttpGet httpGet = new HttpGet(url);
		// 设置请求和传输超时时间
		RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(10000).setSocketTimeout(10000).build();
		httpGet.setConfig(requestConfig);
		httpGet.setHeader(CONTENT_TYPE, CONTENT_TYPE_FORM);
		return sendRequest(httpGet);
	}
	
	/**
	 * 
	 * @param clientIp clientIp 客户端ip
	 * @return 返回与clientIp同省的代理ip，如果这样的ip不存在，则随机返回代理ip
	 */
	public String getOneProxy(String clientIp) {
		return getProxy(clientIp, 1, 1);
	}

}
