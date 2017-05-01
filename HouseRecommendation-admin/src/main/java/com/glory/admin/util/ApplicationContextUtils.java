package com.glory.admin.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * Spring上下文工具类，方便无法使用注解的地方获取上下文
 *
 * @author Glory
 * @create 2017-04-12 19:33
 */
public class ApplicationContextUtils implements ApplicationContextAware {

	private static ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		ApplicationContextUtils.applicationContext = applicationContext;
	}

	public static ApplicationContext getApplicationContext() {
		return ApplicationContextUtils.applicationContext;
	}

	public static Object getBean(String name) {
		return applicationContext.getBean(name);
	}

	public static <T> T getBean(Class<T> c) {
	
		return applicationContext.getBean(c);
	}

}
