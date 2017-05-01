package com.glory.admin.util;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * 设置切换数据库数据源
 * @author glory
 * @date 2017-03-27
 */
public class MultipleDataSource extends AbstractRoutingDataSource {
	public static final String DATA_SOURCE_ADMIN = "adminDataSource";
	public static final String DATA_SOURCE_HOUSE = "houseDataSource";
	    
    private static final ThreadLocal<String> dataSourceKey = new InheritableThreadLocal<>();

    public static void setDataSourceKey(String dataSource) {
        dataSourceKey.set(dataSource);
    }

    @Override
    protected Object determineCurrentLookupKey() {
        return dataSourceKey.get();
    }
    
    public static void removeDataSourceKey(){
    	dataSourceKey.remove();
    }
}
