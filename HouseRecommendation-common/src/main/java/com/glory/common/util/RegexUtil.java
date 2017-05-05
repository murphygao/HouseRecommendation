package com.glory.common.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 正则工具类
 *
 * @author Glory
 * @create 2017-05-05 13:41
 **/
public class RegexUtil {

	private RegexUtil(){}

	public static String singleExtract(String content, String regex, int groupIndex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		if (matcher.find()) {
			return matcher.group(groupIndex);
		}
		return null;
	}
	
	public static String singleDotallExtract(String targetStr,String patternStr,int groupIndex){
		
		Pattern pattern = Pattern.compile(patternStr,Pattern.CASE_INSENSITIVE|Pattern.DOTALL);
		Matcher matcher = pattern.matcher(targetStr);
		while(matcher.find()){
			return matcher.group(groupIndex);
		}
		return null;
	}

	public static String singleExtract(String content, Pattern pattern, int groupIndex) {
		Matcher matcher = pattern.matcher(content);
		if (matcher.find()) {
			return matcher.group(groupIndex);
		}
		return null;
	}

	public static List<String> multiExtract(String content, String regex, int groupIndex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		List<String> list = new ArrayList<>();
		while (matcher.find()) {
			list.add(matcher.group(groupIndex));
		}
		return list;
	}

	public static String[] multiExtract(String content, String regex, int groupIndex, int arrayLength) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		String[] array = new String[arrayLength];
		int i = 0;
		while (matcher.find()) {
			array[i] = matcher.group(groupIndex);
			i++;
			if (i >= arrayLength)
				break;
		}
		return array;
	}

	public static MatchResult singleExtractToMatchResult(String content, String regex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		while (matcher.find()) {
			return matcher.toMatchResult();
		}
		return null;
	}

	public static List<MatchResult> multiExtractToMatchResult(String content, String regex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		List<MatchResult> matchResults = new ArrayList<>();
		while (matcher.find()) {
			matchResults.add(matcher.toMatchResult());
		}
		return matchResults;
	}

	public static List<MatchResult> multiExtractToMatchResultOnlyFive(String content, String regex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		List<MatchResult> matchResults = new ArrayList<>();
		int i = 5;
		while (matcher.find() && i >= 0) {
			matchResults.add(matcher.toMatchResult());
			i--;
		}
		return matchResults;
	}

	public static List<MatchResult> multiExtractToMatchResult(String content, Pattern pattern) {
		Matcher matcher = pattern.matcher(content);
		List<MatchResult> matchResults = new ArrayList<>();
		while (matcher.find()) {
			matchResults.add(matcher.toMatchResult());
		}
		return matchResults;
	}

	public static boolean match(String content, String regex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		return matcher.find();
	}

	public static boolean match(String content, Pattern pattern) {
		Matcher matcher = pattern.matcher(content);
		return matcher.find();
	}

	public static String repalceAll(String content, String regex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		return matcher.replaceAll("");
	}

	public static List<Integer> multiExtractInteger(String content, String regex, int groupIndex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		List<Integer> list = new ArrayList<>();
		while (matcher.find()) {
			Integer i = Integer.parseInt(matcher.group(groupIndex).trim());
			if (i == null) {
				i = 0;
			}
			list.add(i);
		}
		return list;
	}
}
