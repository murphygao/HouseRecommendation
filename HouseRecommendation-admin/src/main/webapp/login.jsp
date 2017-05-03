<%--
  Created by IntelliJ IDEA.
  User: 荣耀
  Date: 2017/5/1
  Time: 18:43
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- 禁用屏幕缩放功能 默认缩放比例1.0-->
    <meta name = "viewport" content="width = device-width,
                                     initial-scale = 1.0,
                                     maximum-scale = 1.0,
                                     user-scalable = no">
    <!-- 启动最新的IE文档模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge，chrome=1">
    <!-- 禁用缓存 -->
    <meta http-equiv="pragma"          content="no-cache">
    <meta http-equiv="Cache-Control"   content="no-cache">
    <meta http-equiv="Expires"         content="0">
    <title>登录</title>
    <!-- 网站图标 -->
    <link rel="icon" type="image/png" href="${ctx}/statis/images/favicon.png">
    <link rel="stylesheet" type="text/css" href="${ctx}/statis/css/login_style.css">
</head>
<body>
<div class="container">
    <div class="panel-box">
        <div class="panel-title">
            <h2>房源信息采集后台管理</h2>
        </div>
        <div class="panel-content">
            <div class="panel-content-item">
                <i class="icon icon-sign icon-user"></i>
                <input type="text" class="panel-item-input input-success" placeholder="用户名">
                <i class="icon icon-checked icon-checked-ok"></i>
            </div>
            <div class="panel-content-item">
                <i class="icon icon-sign icon-password"></i>
                <input type="password" class="panel-item-input input-error" placeholder="密码">
                <i class="icon icon-checked icon-checked-error"></i>
            </div>
            <div class="panel-content-item item-checkbox">
                <input type="checkbox" class="checkbox-password" title="记住密码">记住密码
                <input type="checkbox" class="checkbox-login" title="记住密码">自动登录
            </div>
            <div class="panel-content-item">
                <a href="admin/index"><button type="button" class="panel-item-btn">登录</button></a>
            </div>
        </div>
    </div>
</div>
<script type="application/javascript" src="${ctx}/statis/js/jquery-1.11.1.js"></script>
<script type="application/javascript" src="${ctx}/statis/js/login_event.js"></script>
</body>
</html>
