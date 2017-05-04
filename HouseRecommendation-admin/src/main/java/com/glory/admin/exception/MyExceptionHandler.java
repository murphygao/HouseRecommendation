package com.glory.admin.exception;

import org.slf4j.Logger;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * 统一异常处理，有效地针对异步和非异步请求
 * 不同异常会到不同页面
 * throw new IllegalParameterException("XXXX")  －－－－ >  error-parameter.jsp
 * throw new SystemException("XXXX")  －－－－ >  error-System.jsp
 * throw new Exception("XXXX")  －－－－ >  error.jsp
 * Status  value
 * 1001 业务异常返回 1001
 * 1002 参数异常返回 
 * 1000 其他异常返回
 *
 * @author glory
 * @date 2017-03-27
 */
public class MyExceptionHandler implements HandlerExceptionResolver {

	private static final Logger logger = getLogger(MyExceptionHandler.class);

	@Override
	public ModelAndView resolveException(HttpServletRequest request,
										 HttpServletResponse response,
										 Object handler,
										 Exception ex) {

		logger.error("操作出现异常:{}",ex.getMessage());
		Map<String, Object> model = new HashMap<>();
		model.put("ex", ex);
		//是否异步请求
		 if (!(request.getHeader("accept").contains("application/json") || (request
                 .getHeader("X-Requested-With")!= null && request  
                 .getHeader("X-Requested-With").contains("XMLHttpRequest")))) {
			    // 根据不同错误转向不同页面
				if(ex instanceof BusinessException) {
					response.setStatus(1001);//业务异常返回 1001
					return new ModelAndView("WEB-INF/page/exception/error-system", model);
				}else if(ex instanceof IllegalParameterException) {
					response.setStatus(1002);//参数异常返回 1002
					return new ModelAndView("WEB-INF/page/exception/error-parameter", model);
				} else {
					response.setStatus(1000);//其他异常返回 1000
					return new ModelAndView("WEB-INF/page/error", model);
				}
		 }else{
			 try {  
				 if(ex instanceof BusinessException) {
						response.setStatus(1001);//业务异常返回 1001
					}else if(ex instanceof IllegalParameterException) {
						response.setStatus(1002);//参数异常返回 1002
					} else {
						response.setStatus(1000);//其他异常返回 1000
					}
                 PrintWriter writer = response.getWriter();  
                 writer.write(ex.getMessage());  
                 writer.flush();  
             } catch (IOException e) { 
            	 logger.error("IO异常:{}",e.getMessage());
            	 model.put("ex", e);
            	 return new ModelAndView("WEB-INF/page/error", model);
             }  
             return null;  
		 }
	}
}