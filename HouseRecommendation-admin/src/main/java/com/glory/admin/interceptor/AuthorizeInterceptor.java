package com.glory.admin.interceptor;

import com.glory.admin.entity.form.CommonResult;
import com.glory.admin.service.CacheService;
import com.glory.admin.util.CodeMessageEnum;
import com.glory.common.redis.JedisCacheGroup;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 授权拦截器
 *
 * @author Glory
 * @create 2017-05-06 13:45
 **/
public class AuthorizeInterceptor extends HandlerInterceptorAdapter {

    private static final Logger logger = LoggerFactory.getLogger(AuthorizeInterceptor.class);

    @Autowired
    private CacheService cacheService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 处理结果标记
        boolean HandleFlag = Boolean.TRUE;

        /*
         * 校验请求是否经过登录授权
         * 如果没有授权，设置HandleFlag为false
         * 如果已经授权，更新会话存活时间
         */
        if (!hasAuthorized(request)) {
            logger.error("访问异常, 会话未经登录授权");
            HandleFlag = Boolean.FALSE;
        } else {
            // 更新任务会话存活时间
            cacheService.expire(JedisCacheGroup.HOUSE_ADMIN_SESSION, request.getSession().getId());
        }

        // 未授权处理
        if (!HandleFlag) {
            /*
             *  如果是ajax请求，返回CommonResult对象
             *  如果是同步请求，返回重定向消息
             */
            if (isAjax(request)) {
                CommonResult result = new CommonResult();
                result.setSessionId(request.getSession().getId());
                result.setCodeAndMessage(CodeMessageEnum.AUTHORIZE_NO_LOGIN);
                result.addData("/login.html");
                ObjectMapper mapper = new ObjectMapper();
                String json = mapper.writeValueAsString(result);
                response.getWriter().write(json);
            } else {
                response.sendRedirect(request.getContextPath() + "/login.html");
            }
        }

        return HandleFlag;
    }

    /**
     * 校验用户是否已经登录授权
     * @return   如果缓存中存在会话，返回true，否则返回false
     */
    private boolean hasAuthorized(HttpServletRequest request) {
        // 校验标记
        boolean flag = Boolean.TRUE;
        // 缓存查询
        String cacheResult = cacheService.get(JedisCacheGroup.HOUSE_ADMIN_SESSION, request.getSession().getId());
        if (StringUtils.isBlank(cacheResult)) {
            flag = Boolean.FALSE;
        }

        return flag;
    }

    /**
     * 判断请求是否为ajax请求
     * @param request   请求封装对象
     * @return          如果是ajax请求返回true，否则返回false
     */
    private boolean isAjax(HttpServletRequest request) {
        return (request.getHeader("accept").contains("application/json") ||
                (request.getHeader("X-Requested-With") != null &&
                 request.getHeader("X-Requested-With").contains("XMLHttpRequest")));
    }
}
