package com.glory.admin.annotation;

import java.lang.annotation.*;

/**
 * Created by 荣耀 on 2017/5/3.
 * 自定义注解 拦截Controller
 */
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ControllerLog {
    String module()  default "";
    String methods()  default "";
    String description()  default "";
}
