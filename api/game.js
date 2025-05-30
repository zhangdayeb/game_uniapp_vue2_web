import { http } from '@/common/service/service.js' 
import configService from '@/common/service/config.service.js';
const apiService = {
	gameType(params) {
	 	return http.post('/user/game/list',params)	
	},
	gameTable(params) {
	 	return http.post('/user/table/list',params)	
	},
	gameTableInfo(params) {
	 	return http.post('/user/table/info',params)	
	},
	
	gameTableBet(params) {
		return http.post('/user/table/bet',params)
	},
	/**
	 * 保存筹码
	 **/
	saveChips(params) {
		return http.post('/user/chip/update',params)
	},
	/**
	 * 获取常用筹码
	 **/
	getCommonlyChips(params) {
		return http.post('/user/chip/update',params)
	},
	/**
	 * 获取桌子视频
	 */
	getTableInfoVideo(params) {
		return http.post('/user/get_table/table_info_video',params)
	},
	/**
	 * 获取通知视频
	 */
	getNoticeList(params) {
		return http.post('/user/notice/list',params)
	},
	/**
	 * 获取带有个人消息的通知
	 */
	getTongZhi_v2(params) {
		return http.post('/user/notice_auth/list',params)
	},
	
	/**
	 * 获取游戏规则
	 */
	getGameInfo(params) {
		return http.post('/user/game/info',params)
	},
	
	/**
	 * 注册
	 **/
	loginRegister(params) {
		return http.post('/user/login/register',params)
	},
	
	/**
	 * 获取验证码
	 **/
	getLoginCaptcha(params) {
		return http.post('/user/login/captcha',params)
	},
	
	/**
	 * 获取国家区号
	 */
	getLoginCountry(params) {
		return http.post('/user/login/country',params)
	}
	
	
};

export default apiService;
