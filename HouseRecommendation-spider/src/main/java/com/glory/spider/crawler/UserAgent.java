package com.glory.spider.crawler;

import org.apache.commons.lang3.RandomUtils;

/**
 * 用户代理标识
 *
 * @author Glory
 * @create 2017-05-06 15:31
 **/
public enum UserAgent {

    USER_AGENT_IOS_3(1, "ios_3", "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16"),
    USER_AGENT_WIN_FIREFOX(2, "win_firefox", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0"),
    USER_AGENT_IE8(3, "ie8", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)"),
    USER_AGENT_WIN_CHROME(4, "win_chrome", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36");

    // 代理标识编号
    private int id;
    // 代理标识名称
    private String name;
    // 代理标识内容
    private String value;

    UserAgent(int id, String name, String value) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

    /**
     * 随机获取一个用户代理标识
     * @return
     */
    public static String getUserAgent() {
        int random = RandomUtils.nextInt(1, UserAgent.values().length + 1);
        String agent = null;
        for (UserAgent userAgent: UserAgent.values()) {
            if (userAgent.getId() == random) {
                agent = userAgent.getValue();
                break;
            }
        }
        return agent;
    }

    public int getId() {
        return id;
    }

    public String getValue() {
        return value;
    }
}
