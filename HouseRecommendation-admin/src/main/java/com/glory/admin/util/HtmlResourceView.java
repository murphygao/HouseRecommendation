package com.glory.admin.util;

import org.springframework.web.servlet.view.InternalResourceView;

import java.io.File;
import java.util.Locale;

/**
 * html视图解释器
 *
 * @author Glory
 * @create 2017-05-05 10:59
 **/
public class HtmlResourceView extends InternalResourceView {

    @Override
    public boolean checkResource(Locale locale) throws Exception {
        File file = new File(this.getServletContext().getRealPath("/") + getUrl());
        // 判断该页面是否存在
        return file.exists();
    }
}
