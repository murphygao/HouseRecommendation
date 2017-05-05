package com.glory.common.encrypt;

import org.slf4j.Logger;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.util.UUID;

import static org.slf4j.LoggerFactory.getLogger;

/*******************************************
 * AES crypto class AES key size must be equal to 128
 * 
 * @author xing_xiong
 * @version 0.1
 * @date 2010-3-25
 *******************************************/
public class AES {
	private static final Logger logger = getLogger(AES.class);
    // 加密公钥
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final String PWD       = "(*&^&^$%JKGHKHiqdfw43546(*&$%#$^#$%#&*GGJH*Rouasad^*^hk^%+_";
    public static final String  UNION_PWD = "&*($HJDGH4867%&T";
    public static final String  UNION_IV  = "v8Csiw3gWqicGWFl";
    private static final String DEFAULT_CASRSET = "UTF-8";
    private AES(){
		
	}

    public static String decrypt(String cipherText, String iv) {
        String myIV = iv.length() > 16 ? iv.substring(0, 16) : iv;
        return decrypt(cipherText, PWD, myIV);
    }

    /**
     * 解密 以String密文输入,String明文输出
     *
     */
    public static String decrypt(String cipherText, String password, String iv) {
        try {
			byte[] bytes = decrypt(Base64.decode(cipherText), password, iv);
			return new String(bytes, DEFAULT_CASRSET);
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(),e);
			return null;
		}
    }

    /**
     * 解密以byte[]密文输入,以byte[]明文输出
     * 
     * @param byteD
     * @return
     */
    public static byte[] decrypt(byte[] byteD, String pwd, String iv) {
        Cipher cipher;
        byte[] byteFina = null;
        try {
            cipher = Cipher.getInstance(ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(getKey(pwd), "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(iv.getBytes(DEFAULT_CASRSET));
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
            byteFina = cipher.doFinal(byteD);
        } catch (Exception e) {
        	logger.error(e.getMessage(),e);
        }
        return byteFina;
    }

    /**
     * 获取随机向量,取前16位
     * 
     * @return
     */
    public static String getRandomIv() {
        return UUID.randomUUID().toString().substring(0, 16);
    }

    private static byte[] getKey(String password) throws UnsupportedEncodingException {
    	StringBuilder sb = new StringBuilder(password);
        // 使用256位密码
        if (password.length() > 16){
        	sb = new StringBuilder(password.substring(0, 16));
        }else if (password.length() < 16) {
            int count = 16 - password.length();
            for (int i = 0; i < count; i++) {
            	sb.append("0");
            }
        }
        return sb.toString().getBytes(DEFAULT_CASRSET);
    }
    
    /**
     * 加密
     * 
     * @param plainText 明文
     * @param iv 16位的随机码
     * @return
     */
    public static String encrypt(String plainText, String password, String iv) {
        try {
            return Base64.encode(encrypt(plainText.getBytes(DEFAULT_CASRSET), password, iv));
        } catch (UnsupportedEncodingException e) {
        	logger.error(e.getMessage(),e);
            return null;
        }
    }

    /**
     * 加密
     * 
     * @param plainText 明文
     * @param iv 16位的随机码
     * @return
     */
    public static String encrypt(String plainText, String iv) {
        try {
            String myIV = iv.length() > 16 ? iv.substring(0, 16) : iv;
            return Base64.encode(encrypt(plainText.getBytes(DEFAULT_CASRSET), PWD, myIV));
        } catch (UnsupportedEncodingException e) {
        	logger.error(e.getMessage(),e);
            return null;
        }
    }

    /**
     * 加密以byte[]明文输入,byte[]密文输出
     * 
     * @param byteS
     * @return
     */
    public static byte[] encrypt(byte[] byteS, String pwd, String iv) {
        byte[] byteFina = null;
        Cipher cipher;
        try {
            cipher = Cipher.getInstance(ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(getKey(pwd), "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(iv.getBytes(DEFAULT_CASRSET));
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
            byteFina = cipher.doFinal(byteS);
        } catch (Exception e) {
        	logger.error(e.getMessage(),e);
        }
        return byteFina;
    }

    /**
     * 解密 以String名文输入,String密文输出
     */
    public static String encryptAll(String plainText, String pwd, String iv) {
        try {
            String myiv = iv.length() > 16 ? iv.substring(0, 16) : iv;
            return Base64.encode(encrypt(plainText.getBytes(DEFAULT_CASRSET), pwd, myiv));
        } catch (UnsupportedEncodingException e) {
        	logger.error(e.getMessage(),e);
            return null;
        }
    }

    public static void main(String[] args) {
        try {
        	 String iv = getRandomIv();
             String xxx = AES.encrypt("4505",iv);
             logger.info(xxx);
             String base64 = Base64.encode(xxx.getBytes());
             String yyy = AES.decrypt(new String(Base64.decode(base64)), iv);
             logger.info(yyy);
        } catch (Exception e) {
        	logger.error(e.getMessage(),e);
        }
    }
}
