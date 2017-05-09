package com.glory.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * URL工具类
 *
 * @author Glory
 * @create 2017-05-06 19:36
 **/
public class URLUtil {
    private static final Logger log = LoggerFactory.getLogger(URLUtil.class);

    private static final String NAME_OF_HTTP = "http";

    private static Pattern p = Pattern.compile("(%[0-9a-fA-F]{2})+");

    private static Set<String> worldDomains = new HashSet<>(); // 世界域名后缀大全，所有国家域名后缀(小写字母)

    private static boolean isToSameCase = true;

    private static int caseStep = 'a' - 'A';

    static {
        // 世界域名后缀大全，所有国家域名后缀
        worldDomains.add("ad");// ad : Andorra , 安道尔
        worldDomains.add("ae");// ae : United Arab Emirates , 阿联酋
        worldDomains.add("af");// af : Afghanistan , 阿富汗
        worldDomains.add("ag");// ag : Antigua and Barbuda , 安提瓜和巴布达
        worldDomains.add("ai");// ai : Anguilla , 安格拉
        worldDomains.add("al");// al : Albania , 阿尔巴尼亚
        worldDomains.add("am");// am : Armenia , 亚美尼亚
        worldDomains.add("an");// an : Netherlands Antilles , 荷兰属地
        worldDomains.add("ao");// ao : Angola , 安哥拉
        worldDomains.add("aq");// aq : Antarctica , 南极洲
        worldDomains.add("ar");// ar : Argentina , 阿根廷
        worldDomains.add("as");// as : American Samoa , 东萨摩亚
        worldDomains.add("at");// at : Austria , 奥地利
        worldDomains.add("au");// au : Australia , 澳大利亚
        worldDomains.add("aw");// aw : Aruba , 阿鲁巴
        worldDomains.add("az");// az : Azerbaijan , 阿塞拜疆

        worldDomains.add("ba");// ba : Bosnia Hercegovina , 波黑
        worldDomains.add("bb");// bb : Barbados , 巴巴多斯
        worldDomains.add("bd");// bd : Bangladesh , 孟加拉国
        worldDomains.add("be");// be : Belgium , 比利时
        worldDomains.add("bf");// bf : Burkina Faso , 布基纳法索
        worldDomains.add("bg");// bg : Bulgaria , 保加利亚
        worldDomains.add("bh");// bh : Bahrain , 巴林
        worldDomains.add("crawlers");// crawlers : Burundi , 布隆迪
        worldDomains.add("bj");// bj : Benin , 贝宁
        worldDomains.add("bm");// bm : Bermuda , 百慕大
        worldDomains.add("bn");// bn : Brunei Darussalam , 文莱达鲁萨兰国
        worldDomains.add("bo");// bo : Bolivia , 玻利维亚
        worldDomains.add("br");// br : Brazil , 巴西
        worldDomains.add("bs");// bs : Bahamas , 巴哈马
        worldDomains.add("bt");// bt : Bhutan , 不丹
        worldDomains.add("bv");// bv : Bouvet Island , 布韦群岛
        worldDomains.add("bw");// bw : Botswana, 伯兹瓦纳
        worldDomains.add("by");// by : Belarus, 白俄罗斯
        worldDomains.add("bz");// bz : Belize , 伯利兹

        worldDomains.add("ca");// ca : Canada , 加拿大
        worldDomains.add("cc");// cc : Cocos Islands , 科科斯群岛
        worldDomains.add("cf");// cf : Central African Republic , 中非共和国
        worldDomains.add("cg");// cg : Congo , 刚果
        worldDomains.add("ch");// ch : Switzerland , 瑞士
        worldDomains.add("ci");// ci : Ivory Coast, 象牙海岸
        worldDomains.add("ck");// ck : Cook Islands , 库克群岛
        worldDomains.add("cl");// cl : Chile , 智利
        worldDomains.add("cm");// cm : Cameroon , 喀麦隆
        worldDomains.add("cn");// cn : China , 中国
        worldDomains.add("co");// co : Colombia , 哥伦比亚
        worldDomains.add("cq");// cq : Equatorial Guinea , 赤道几内亚
        worldDomains.add("cr");// cr : Costa Rica , 哥斯达黎加
        worldDomains.add("cu");// cu : Cuba , 古巴
        worldDomains.add("cv");// cv : Cape Verde , 佛得角
        worldDomains.add("cx");// cx : Christmas Island, 圣诞岛（英
        worldDomains.add("cy");// cy : Cyprus , 塞浦路斯
        worldDomains.add("cz");// cz : Czech Republic , 捷克共和国

        worldDomains.add("de");// de : Germany , 德国
        worldDomains.add("dj");// dj : Djibouti , 吉布提
        worldDomains.add("dk");// dk : Denmark , 丹麦
        worldDomains.add("dm");// dm : Dominica , 多米尼加联邦
        worldDomains.add("do");// do : Dominican Republic , 多米尼加共和国
        worldDomains.add("dz");// dz : Algeria , 阿尔及利亚属）

        worldDomains.add("ec");// ec : Ecuador , 厄瓜多尔
        worldDomains.add("ee");// ee : Estonia , 爱沙尼亚
        worldDomains.add("eg");// eg : Egypt , 埃及
        worldDomains.add("eh");// eh : Western Sahara , 西萨摩亚
        worldDomains.add("es");// es : Spain , 西班牙
        worldDomains.add("et");// et : Ethiopia , 埃塞俄比亚
        worldDomains.add("ev");// ev : El Salvador , 萨尔瓦多

        worldDomains.add("fi");// fi : Finland , 芬兰
        worldDomains.add("fj");// fj : Fiji , 斐济
        worldDomains.add("fk");// fk : Falkland Islands , 福克兰群岛
        worldDomains.add("fm");// fm : Micronesia , 密克罗尼西亚
        worldDomains.add("fo");// fo : Faroe Islands , 法罗群岛
        worldDomains.add("fr");// fr : France , 法国

        worldDomains.add("ga");// ga : Gobon, 加蓬
        worldDomains.add("gb");// gb : Great Britain (UK) , 大不列颠联合王国
        worldDomains.add("gd");// gd : Grenada , 格林纳达
        worldDomains.add("ge");// ge : Georgia , 格鲁吉亚
        worldDomains.add("gf");// gf : French Guiana , 法属圭亚那
        worldDomains.add("gh");// gh : Ghana , 加纳
        worldDomains.add("gi");// gi : Gibraltar , 直布罗陀
        worldDomains.add("gl");// gl : Greenland , 格陵兰群岛
        worldDomains.add("gm");// gm : Gambia , 冈比亚
        worldDomains.add("gn");// gn : Guynea , 几内亚
        worldDomains.add("gp");// gp : Guadeloupe, 瓜德罗普岛（法属）
        worldDomains.add("gr");// gr : Greece ,希腊
        worldDomains.add("gt");// gt : Guatemala , 危地马拉
        worldDomains.add("gu");// gu : Guam , 关岛
        worldDomains.add("gw");// gw : Guinea-Bissau , 几内亚比绍
        worldDomains.add("gy");// gy : Guyana , 圭亚那

        worldDomains.add("hk");// hk : Hong Kong , 香港
        worldDomains.add("hm");// hm : Heard & McDonald Is. , 赫特与麦克唐纳群岛
        worldDomains.add("hn");// hn : Honduras , 洪都拉斯
        worldDomains.add("hr");// hr : Croatia , 克罗蒂亚
        worldDomains.add("ht");// ht : Haiti , 海地
        worldDomains.add("hu");// hu : Hungary , 匈牙利

        worldDomains.add("id");// id : Indonesia , 印度尼西亚
        worldDomains.add("ie");// ie : Ireland , 爱尔兰共和国
        worldDomains.add("il");// il : Israel , 以色列
        worldDomains.add("in");// in : India , 印度
        worldDomains.add("io");// io : British Indian Ocean Territory, 英属印度洋领地
        worldDomains.add("iq");// iq : Iraq , 伊拉克
        worldDomains.add("ir");// ir : Iran , 伊朗
        worldDomains.add("is");// is : Iceland , 冰岛
        worldDomains.add("it");// it : Italy , 意大利

        worldDomains.add("jm");// jm : Jamaica , 牙买加
        worldDomains.add("jo");// jo : Jordan , 约旦
        worldDomains.add("jp");// jp : Japan ,

        worldDomains.add("ke");// ke : Kenya , 肯尼亚
        worldDomains.add("kg");// kg : Kyrgyzstan , 吉尔吉斯斯坦
        worldDomains.add("kh");// kh : Cambodia , 柬埔塞
        worldDomains.add("ki");// ki : Kiribati , 基里巴斯
        worldDomains.add("km");// km : Comoros , 科摩罗
        worldDomains.add("kn");// kn : St. Kitts & Nevis, 圣茨和尼维斯
        worldDomains.add("kp");// kp : Korea-North , 北朝鲜
        worldDomains.add("kr");// kr : Korea-South , 南朝鲜
        worldDomains.add("kw");// kw : Kuwait , 科威特
        worldDomains.add("ky");// ky : Cayman Islands, 开曼群岛（英属）
        worldDomains.add("kz");// kz : Kazakhstan , 哈萨克斯坦

        worldDomains.add("la");// la : Lao People's Republic , 老挝人民共和国
        worldDomains.add("lb");// lb : Lebanon , 黎巴嫩
        worldDomains.add("lc");// lc : St. Lucia, 圣露西亚岛
        worldDomains.add("li");// li : Liechtenstein , 列支敦士登
        worldDomains.add("lk");// lk : Sri Lanka , 斯里兰卡
        worldDomains.add("lr");// lr : Liberia , 利比里亚
        worldDomains.add("ls");// ls : Lesotho , 莱索托
        worldDomains.add("lt");// lt : Lithuania , 立陶宛
        worldDomains.add("lu");// lu : Luxembourg , 卢森堡
        worldDomains.add("lv");// lv : Latvia , 拉脱维亚
        worldDomains.add("ly");// ly : Libya , 利比亚

        worldDomains.add("ma");// ma : Morocco , 摩洛哥
        worldDomains.add("mc");// mc : Monaco , 摩纳哥
        worldDomains.add("md");// md : Moldova , 摩尔多瓦
        worldDomains.add("mg");// mg : Madagascar , 马达加斯加
        worldDomains.add("mh");// mh : Marshall Islands , 马绍尔群岛
        worldDomains.add("ml");// ml : Mali , 马里
        worldDomains.add("mm");// mm : Myanmar, 缅甸
        worldDomains.add("mn");// mn : Mongolia , 蒙古
        worldDomains.add("mo");// mo : Macau , 澳门
        worldDomains.add("mp");// mp : Northern Mariana Islands, 北马里亚纳群岛
        worldDomains.add("mq");// mq : Martinique , 马提尼克岛（法属）
        worldDomains.add("mr");// mr : Mauritania , 毛里塔尼亚
        worldDomains.add("ms");// ms : Montserrat, 蒙塞拉特岛
        worldDomains.add("mt");// mt : Malta , 马尔他
        worldDomains.add("mv");// mv : Maldives , 马尔代夫
        worldDomains.add("mw");// mw : Malawi , 马拉维
        worldDomains.add("mx");// mx : Mexico , 墨西哥
        worldDomains.add("my");// my : Malaysia , 马来西亚
        worldDomains.add("mz");// mz : Mozambique , 莫桑比克

        worldDomains.add("na");// na : Namibia , 纳米比亚
        worldDomains.add("nc");// nc : New Caledonia, 新喀里多尼亚
        worldDomains.add("ne");// ne : Niger , 尼日尔
        worldDomains.add("nf");// nf : Norfolk Island, 诺福克岛
        worldDomains.add("ng");// ng : Nigeria , 尼日利亚
        worldDomains.add("ni");// ni : Nicaragua , 尼加拉瓜
        worldDomains.add("nl");// nl : Netherlands , 荷兰
        worldDomains.add("no");// no : Norway , 挪威
        worldDomains.add("np");// np : Nepal , 尼泊尔
        worldDomains.add("nr");// nr : Nauru , 瑙鲁
        worldDomains.add("nt");// nt : Neutral Zone , 中立区
        worldDomains.add("nu");// nu : Niue, 纽埃
        worldDomains.add("nz");// nz : New Zealand

        worldDomains.add("om");// om : Oman , 阿曼

        worldDomains.add("qa");// qa : Qatar , 卡塔尔

        worldDomains.add("pa");// pa : Panama , 巴拿马
        worldDomains.add("pe");// pe : Peru , 秘鲁
        worldDomains.add("pf");// pf : French Polynesia , 法属玻利尼西亚
        worldDomains.add("pg");// pg : Papua New Guinea , 巴布亚新几内亚
        worldDomains.add("ph");// ph : Philippines , 菲律宾
        worldDomains.add("pk");// pk : Pakistan , 巴基斯坦
        worldDomains.add("pl");// pl : Poland , 波兰
        worldDomains.add("pm");// pm : St. Pierre & Mequielon, 圣皮埃尔和密克隆岛
        worldDomains.add("pn");// pn : Pitcairn Island, 皮特克恩岛
        worldDomains.add("pr");// pr : Puerto Rico , 波多黎各
        worldDomains.add("pt");// pt : Portugal , 葡萄牙
        worldDomains.add("pw");// pw : Palau , 帕劳
        worldDomains.add("py");// py : Paraguay , 巴拉圭

        worldDomains.add("re");// re : Reunion Island, 留尼汪岛（法属）
        worldDomains.add("ro");// ro : Romania , 罗马尼亚
        worldDomains.add("ru");// ru : Russian Federation , 俄罗斯联邦
        worldDomains.add("rw");// rw : Rwanda , 卢旺达

        worldDomains.add("sa");// sa : Saudi Arabia , 沙特阿拉伯
        worldDomains.add("sb");// sb : Solomon Islands , 所罗门群岛
        worldDomains.add("sc");// sc : Seychelles , 塞舌尔
        worldDomains.add("sd");// sd : Sudan , 苏旦
        worldDomains.add("se");// se : Sweden , 瑞典
        worldDomains.add("sg");// sg : Singapore , 新加坡
        worldDomains.add("sh");// sh : St. Helena , 海伦娜
        worldDomains.add("si");// si : Slovenia , 斯洛文尼亚
        worldDomains.add("sj");// sj : Svalbard & Jan Mayen, 斯马尔巴特和扬马延岛
        worldDomains.add("sk");// sk : Slovakia , 斯洛伐克
        worldDomains.add("sl");// sl : Sierra Leone , 塞拉利昂
        worldDomains.add("sm");// sm : San Marino , 圣马力诺
        worldDomains.add("sn");// sn : Senegal , 塞内加尔
        worldDomains.add("so");// so : Somalia , 索马里
        worldDomains.add("sr");// sr : Suriname , 苏里南
        worldDomains.add("st");// st : Sao Tome & Principe , 圣多美和普林西比
        worldDomains.add("su");// su : USSR , 苏联
        worldDomains.add("sy");// sy : Syrian Arab Republic , 叙利亚
        worldDomains.add("sz");// sz : Swaziland , 斯威士兰

        worldDomains.add("tc");// tc : Turks & Caicos Islands , 特克斯群岛与凯科斯群岛
        worldDomains.add("td");// td : Chad , 乍得
        worldDomains.add("tf");// tf : French Southern Territories , 法属南半球领地
        worldDomains.add("tg");// tg : Togo , 多哥
        worldDomains.add("th");// th : Thailand , 泰国
        worldDomains.add("tj");// tj : Tajikistan , 塔吉克斯坦
        worldDomains.add("tk");// tk : tokelau, 托克劳群岛
        worldDomains.add("tm");// tm : Turkmenistan , 土库曼斯坦
        worldDomains.add("tn");// tn : Tunisia , 突尼斯
        worldDomains.add("to");// to : Tonga , 汤加
        worldDomains.add("tp");// tp : East Timor , 东帝汶
        worldDomains.add("tr");// tr : Turkey , 土耳其
        worldDomains.add("tt");// tt : Trinidad & Tobago , 特立尼达和多巴哥
        worldDomains.add("tv");// tv : Tuvalu , 图瓦鲁
        worldDomains.add("tw");// tw : Taiwan , 台湾
        worldDomains.add("tz");// tz : Tanzania , 坦桑尼亚

        worldDomains.add("ua");// ua : Ukrainian SSR , 乌克兰
        worldDomains.add("ug");// ug : Uganda , 乌干达
        worldDomains.add("uk");// uk : United Kingdom , 英国
        worldDomains.add("us");// us : United States , 美国
        worldDomains.add("uy");// uy : Uruguay , 乌拉圭

        worldDomains.add("va");// va : Vatican City State , 梵地冈
        worldDomains.add("vc");// vc : St. Vincent & the Grenadines, 圣文森特和格林纳丁斯
        worldDomains.add("ve");// ve : Venezuela , 委内瑞拉
        worldDomains.add("vg");// vg : Virgin Islands , 维京群岛
        worldDomains.add("vn");// vn : Vietnam , 越南
        worldDomains.add("vu");// vu : Vanuatu , 瓦努阿图

        worldDomains.add("wf");// wf : Wallis & Fortuna Is. , 瓦利斯和富图纳群岛
        worldDomains.add("ws");// ws : Samoa , 东萨摩亚

        worldDomains.add("ye");// ye : Yemen , 也门
        worldDomains.add("yu");// yu : Yugoslavia , 南斯拉夫

        worldDomains.add("za");// za : South Africa , 南非
        worldDomains.add("zm");// zm : Zambia , 赞比亚
        worldDomains.add("zr");// zr : Zaire , 扎伊尔
        worldDomains.add("zw");// zw : Zimbabwe , 津巴布韦

        // 组织域名:
        worldDomains.add("com");// com : Commercial organizations,商业组织,公司
        worldDomains.add("edu");// edu : Educational institutions,教研机构
        worldDomains.add("gov");// gov : Governmental entities,政府部门
        worldDomains.add("int");// int : International organizations,国际组织
        worldDomains.add("mil");// mil : Military (U.S),美国军部
        worldDomains.add("net");// net : Network operations and service
        // centers,网络服务商
        worldDomains.add("org");// org : Other organizations,非盈利组织
    }

    private URLUtil() {
    }

    /**
     * 解析相对url
     *
     * @param hrefUrl 相对url
     * @param baseUrl 基url
     * @return 成功:相对url的完全url, 失败:空串("")或null
     */
    public static String completeUrl(String hrefUrl, String baseUrl) {
        String tempHrefUrl = hrefUrl == null ? "" : hrefUrl.trim().replace("&amp;", "&");
        String tempBaseUrl = baseUrl;
        if (tempHrefUrl.length() == 0 || tempHrefUrl.startsWith("http:") || tempHrefUrl.startsWith("ftp:")) {
            return tempHrefUrl;
        }

        if (tempHrefUrl.startsWith("?")) {
            int pint = baseUrl.indexOf('?');
            if (pint != -1) {
                tempBaseUrl = baseUrl.substring(0, pint);
            }
            return tempBaseUrl + tempHrefUrl;
        } else {
            tempHrefUrl = trimUrl(tempHrefUrl.trim());
        }

        tempHrefUrl = getHrefUrlByBase(tempHrefUrl, tempBaseUrl);

        tempHrefUrl = tempHrefUrl.replaceAll("&amp;", "&");

        int cutIdx = tempHrefUrl.indexOf('#');
        if (cutIdx != -1) {
            tempHrefUrl = tempHrefUrl.substring(0, cutIdx);
        }

        return tempHrefUrl;
    }

    private static String getHrefUrlByBase(final String hrefUrl, final String baseUrl){
        if ("".equals(hrefUrl) || hrefUrl.startsWith(NAME_OF_HTTP) || baseUrl == null || baseUrl.length() <= 9) {
            return hrefUrl;
        }
        String tempHrefUrl = hrefUrl;
        int pint = 0;
        String prefix;
        try {
            if ('/' == tempHrefUrl.charAt(0)) {
                pint = baseUrl.indexOf('/', 8);
                prefix = pint > 0 ? baseUrl.substring(0, pint) : baseUrl;
                return prefix + tempHrefUrl;
            }
            pint = baseUrl.indexOf('?');
        } catch (StringIndexOutOfBoundsException e) {
            log.error("-ff- StringIndexOutOfBoundsException! baseUrl = {}, hrefUrl = {}", baseUrl, tempHrefUrl, e);
        }
        pint = (pint < 0) ? baseUrl.length() : pint;
        pint = baseUrl.lastIndexOf('/', pint);

        prefix = (pint > 8) ? baseUrl.substring(0, pint) : baseUrl;

        while (tempHrefUrl.startsWith("../")) {
            pint = prefix.lastIndexOf('/');
            if (pint > 0) {
                tempHrefUrl = tempHrefUrl.substring(3);
            } else {
                log.warn("prefix = {}; hrefUrl = {}", prefix, tempHrefUrl);
                break;
            }
            if (pint > 8) {
                prefix = prefix.substring(0, pint);
            }
        }

        tempHrefUrl = prefix  + "/" + tempHrefUrl;

        return tempHrefUrl;
    }

    /**
     * 解析相对url
     *
     * @param baseUrl 基url
     * @param relativeUrl 相对url
     * @return 成功:相对url的完全url, 失败:空串("")
     */
    public static String resolve(String baseUrl, String relativeUrl) {
        if (baseUrl == null || relativeUrl == null) {
            return "";
        }

        String url = "";
        try {
            URI uri = new URI(baseUrl);
            url = uri.resolve(relativeUrl).toString();
        } catch (Exception e) {
            url = "";
            log.error(e.getMessage(), e);
        }

        if (url == null) {
            url = "";
        }

        return url;
    }

    /**
     * 得到url扩展名
     *
     * @return 成功:url扩展名,失败:空串("")
     */
    public static String getExt(String url) {
        if (url == null || "".equals(url)) {
            return "";
        }
        String tempUrl = trimParam(url);// 去除url参数
        int idx = tempUrl.indexOf('/', 8);
        if (-1 == idx) { // 比如 http://wap.easou.com或https://wap.easou.com
            return "";
        }

        // 比如:http://app.easou.com/bbb/a.apk
        String path = tempUrl.substring(idx).trim();
        idx = path.lastIndexOf('.');
        if (-1 == idx) {
            return "";
        }

        String ext = path.substring(idx + 1).trim();
        if (ext.length() > 10) { // 校验长度
            return "";
        }

        return ext;
    }

    public static String getBase(String urlStr) {
        String base = "";
        if (urlStr != null && urlStr.toLowerCase().startsWith(NAME_OF_HTTP)) {
            int prefixIdx = urlStr.indexOf("//") + 2;
            int subfixIdx = urlStr.lastIndexOf('/');
            if (subfixIdx == -1 || subfixIdx < prefixIdx) {
                subfixIdx = urlStr.length();
            }
            base = urlStr.substring(0, subfixIdx);
        }
        return base;
    }

    /**
     * 得到顶级域名
     *
     * @return 成功:顶级域名,失败:空串("")
     */
    public static String getDomain(String url) {
        if (url == null || url.length() == 0) {
            return "";
        }

        // 得到主机名
        String host = getHost(url).toLowerCase();
        if (host.length() == 0) {
            return "";
        }

        StringBuilder domain = new StringBuilder("");
        String[] hostTokens = host.split("\\.");
        for (int i = hostTokens.length - 1; i >= 0; i--) {
            if (!worldDomains.contains(hostTokens[i])) {// 找到了顶级域名
                domain.append(hostTokens[i]);
                for (int j = i + 1; j < hostTokens.length; j++) {
                    domain.append(".").append(hostTokens[j]);
                }
                break;
            }
        }

        return domain.toString();
    }

    /**
     * 得到url主机名
     *
     * @return 成功:url主机名,失败:空串("")
     */
    public static String getHost(String url) {
        if (url == null || url.length() == 0) {
            return "";
        }

        String host = "";
        try {
            host = new URL(url).getHost();
        } catch (MalformedURLException e) {
            host = url.replaceAll("^.*//|/.*$|\\?.*$", "");
        }

        if (host == null) {
            host = "";
        }

        return host;
    }

    /**
     * 去除url参数
     */
    public static String trimParam(String url) {
        if (url == null || url.length() == 0) {
            return url;
        }

        String tempUrl = url;
        int idx = tempUrl.indexOf('?');
        if (-1 == idx) {
            return tempUrl;
        } else {
            tempUrl = tempUrl.substring(0, idx);
            return tempUrl;
        }
    }

    /**
     * 编码URL
     *
     * @return 成功:编码后的url，失败:返回@param:urlStr
     */
    public static String encode(String urlStr, String encoding) {
        if (urlStr == null || urlStr.length() == 0) {
            return urlStr;
        }

        String tempEncoding = encoding;
        URL url;
        try {
            url = new URL(urlStr);
        } catch (MalformedURLException e) {
            log.error(e.getMessage(), e);
            return urlStr;
        }

        if (encoding == null || encoding.length() == 0) {
            tempEncoding = "utf-8";
        }

        String encodedPath = encodePath(url.getPath(), tempEncoding);
        String encodedQuery = encodeQuery(url.getQuery(), tempEncoding);

        StringBuilder encodedUrl = new StringBuilder();
        encodedUrl.append(url.getProtocol()).append("://").append(url.getAuthority()).append(encodedPath);
        if (encodedQuery != null && !encodedQuery.isEmpty()) {
            encodedUrl.append("?").append(encodedQuery);
        }

        return encodedUrl.toString();

    }

    /**
     * 编码url path
     *
     * @return 编码后的path
     */
    private static String encodePath(final String path, final String encoding) {
        if (path == null || path.isEmpty() || "/".equals(path)) {
            return path;
        }

        StringBuilder encodedPath = new StringBuilder();
        String[] tokens = path.split("/");
        for (String token : tokens) {
            Matcher matcher = p.matcher(token);
            if (!matcher.find()) { // 未编码，则编码
                token = urlEncode(token, encoding);
            }
            encodedPath.append(token).append("/");
        }
        if (encodedPath.length() > 0 && !path.endsWith("/")) { // 删除最后一个"/"
            encodedPath = encodedPath.deleteCharAt(encodedPath.length() - 1);
        }

        return encodedPath.toString();
    }

    /**
     * 编码url query
     *
     * @return 编码后的query
     */
    private static String encodeQuery(final String query, final String encoding) {
        if (query == null || query.length() == 0) {
            return query;
        }

        Scanner scanner = new Scanner(query);

        final StringBuilder result = new StringBuilder();
        scanner.useDelimiter("&");
        while (scanner.hasNext()) {
            String param = jointParameter(scanner.next(), encoding);

            if (param == null){
                continue;
            }

            if (result.length() > 0) {
                result.append("&");
            }
            result.append(param);
        }

        // query只有一个key的情况，特殊处理
        if (query.indexOf('=') == -1 && result.charAt(result.length() - 1) == '=') {
            result.deleteCharAt(result.length() - 1);
        }
        scanner.close();

        return result.toString();
    }

    private static String jointParameter(final String param, final String encoding){
        String[] tokens = param.split("="); // 当param的值为"="或"========="时
        if (param.trim().length() == 0 || tokens.length == 0) {
            return null;
        }

        StringBuilder parameter = new StringBuilder();
        for (String token : tokens) {
            Matcher matcher = p.matcher(token);
            if (!matcher.find()) { // 未编码，则编码
                token = urlEncode(token, encoding);
            }
            if (parameter.length() > 0) {
                parameter.append("=");
            }
            parameter.append(token);
        }
        if (tokens.length == 1) {
            parameter.append("=");
        }
        return parameter.toString();
    }

    public static String urlEncode(final String content, final String encoding) {
        try {
            return URLEncoder.encode(content, encoding != null ? encoding : "utf-8").replace("+", "%20");
        } catch (UnsupportedEncodingException problem) {
            throw new IllegalArgumentException(problem);
        }
    }

    private static String trimUrl(String urlStr) {
        String domain;
        String path;
        if (urlStr != null && startsWithIgnoreCase(urlStr, NAME_OF_HTTP)) {
            int p = urlStr.indexOf('/', 8);
            if (p >= 8) {
                domain = urlStr.substring(0, p);
                path = urlStr.substring(p);
            } else {
                domain = urlStr;
                path = "";
            }
        } else {
            domain = "";
            path = urlStr;
        }
        if (path == null)
            path = "";

        domain = domain.replaceFirst(":80$", "").replaceFirst(":80/$", "/").toLowerCase();
        path = path.replaceAll("^(?:\\./)+", "").replaceAll("/(?:\\./)+", "/")
                /** .replaceAll("//", "/") */
                .replaceAll("(?i:http:/)", "http://");
        return domain + path;
    }

    private static boolean startsWithIgnoreCase(String src, String prefix) {
        return startsWithIgnoreCase(src, prefix, 0);
    }

    private static boolean startsWithIgnoreCase(String src, String prefix, int fromIndex) {
        int to = fromIndex;
        char[] srcChars = src.toCharArray();
        int srcLength = src.length();
        char[] prefixChars = prefix.toCharArray();
        int po = 0;
        int pc = prefix.length();
        if ((fromIndex < 0) || (fromIndex > srcLength - pc)) {
            return false;
        }
        while (--pc >= 0) {
            if (toLowerCase(srcChars[to++]) != toLowerCase(prefixChars[po++])) {
                return false;
            }
        }
        return true;
    }

    private static char toLowerCase(char source) {
        if (isToSameCase) {
            if (source >= 'A' && source <= 'Z') {
                return (char) ((int) source + caseStep);
            } else {
                return source;
            }
        } else {
            return source;
        }
    }
}
