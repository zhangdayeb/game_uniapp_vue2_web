import {
	http
} from '@/common/service/service.js'
import configService from '@/common/service/config.service.js';
const apiService = {

	/**
	 * 登录
	 */
	login(params) {
		return http.post('/user/login/index', params)
	},
	
	/**
	 * 设置语言
	 */
	languageUpdate(params) {
		return http.get(`/user/language/update?lang=${params.lang}`)
	}, 

	//试玩体验
	loginTest(params) {
		return http.post('/user/login/test', params);
	},
	phoneNoLogin(params) {
		return http.post('/user/sys/phoneLogin', params);
	},

	/**
	 * 修改密码
	 */
	updatePwd(params) {
		return http.post('/user/pwd/update', params);
	},
	/**
	 * 更新手机
	 */
	updateUserPhone(params) {
		return http.post('/user/phone/update', params);
	},
	/**
	 * 退出
	 */
	logout(params) {
		return http.post('/user/sys/logout', params);
	},
	//验证码
	getVscode(params) {
		return http.post('/user/verify', params);
	},

	//用户信息
	getUserInfo(params) {
		return http.post('/user/user/index', params);
	},
	//用户信息
	getConfig(params) {
		return http.post('/user/user/config', params);
	},
	//用户在线状态
	getUserOnline(params) {
		return http.post('/user/curl/info', params);
	},

	/**
	 * 获取文件访问路径
	 * @param avatar
	 * @param subStr
	 * @returns {*}
	 */
	getFileAccessHttpUrl(avatar, subStr) {
		if (!subStr) subStr = 'http'
		if (avatar && avatar.startsWith(subStr)) {
			return avatar;
		} else {
			return configService.staticDomainURL + "/user/" + avatar;
		}
	},
	//保存银行信息
	saveBankInfo(params) {
		return http.post('/user/user/bin', params);
	},
	
	/**
	 * 保存用户头像信息
	 **/
	userImgUpdate(params) {
		return http.post('/user/user/img_update', params);
	},
	/**
	 * 获取桌子列表
	 */
	getTableList(params) {
		return http.post('/user/table/list',params)
	},
	/**
	 * 获取用户客服聊天
	 */
	getUserWhat(params) {
		return http.post('/user/user/what', params);
	}
	
};

export default apiService;
