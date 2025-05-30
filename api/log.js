import { http } from '@/common/service/service.js' 
import configService from '@/common/service/config.service.js';
const apiService = {
	 moneylog(params) {
	 	return http.post('/user/money_log/list',params)	
	 },
	 money_out_log(params) {
	 	return http.post('/user/money_out/list',params)	
	 },
	 betlog(params) {
	 	return http.post('/user/money_count/list',params)	
	 },
	 bet_list_log(params) {
	 	return http.post('/user/bet_log/list',params)	
	 },
	 betlogby(params) {
	 	return http.post('/user/bet_sum/list',params)	
	},
	/**
	 * 获取游戏结果
	 **/
	getResultGamePoker(params) {
		return http.post('/user/game/poker',params)	
	},
	// /**
	//  * 获取游戏结果
	//  **/
	// getResultBjlGamePoker(params) {
	// 	return http.post('/bjl/game/poker',params)	
	// },
	// /**
	//  * 获取游戏结果
	//  **/
	// getResultTigerGamePoker(params) {
	// 	return http.post('/tiger/game/poker',params)	
	// },
	// /**
	//  * 获取游戏结果
	//  **/
	// getResultCattleGamePoker(params) {
	// 	return http.post('/cattle/game/poker',params)	
	// },
};

export default apiService;
