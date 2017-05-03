package com.glory.admin.test;

import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * 测试基类
 *
 * @author Glory
 * @create 2017-05-02 23:25
 **/
@ContextConfiguration(locations = {"classpath*:spring-*.xml"})
@RunWith(SpringJUnit4ClassRunner.class)
public abstract class TestBase {

    private static final Logger logger = getLogger(TestBase.class);

    /**
     * 读取文件方法
     * @param filePath
     * @param encoding
     * @return
     */
    public static String readTxtFile(String filePath,String encoding){
        StringBuilder result = new StringBuilder();
        File file=new File(filePath);
        if(file.isFile() && file.exists()){
            try(FileInputStream fis = new FileInputStream(file);
                InputStreamReader read =  new InputStreamReader(fis,encoding)){
                BufferedReader bufferedReader = new BufferedReader(read);
                String lineTxt;
                while((lineTxt = bufferedReader.readLine()) != null){
                    result.append(lineTxt).append("\n");
                }
            }catch (Exception e) {
                logger.error("读取文件出现异常:{}",e.getMessage());
                logger.error(e.getMessage(),e);
            }
        }else{
            logger.info("没有找到指定的文件:{}",filePath);
        }
        return result.toString();
    }
}
