package com.glory.common.constant;

/**
 * 系统常量配置
 *
 * @author Glory
 * @create 2017-05-06 18:24
 **/
public class SystemConstants {

    // debug模式开关
    public static final String GLOBAL_DEBUG_SWITCH = "global.debug.switch";

    /**
     * 判断当前是否测试环境
     * @return true or false
     */
    public static boolean isDebugEnv(){
        String debugProperty = System.getProperty(GLOBAL_DEBUG_SWITCH);
        return debugProperty != null && "true".equalsIgnoreCase(debugProperty);
    }
}
