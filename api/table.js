import { http } from '@/common/service/service.js' 
import configService from '@/common/service/config.service.js';
const apiService = {
	//赔率
	 desktopTable(params) {
	 	return http.post('/user/odds/list',params)	
	 },
	 //露珠
	 luzhuTable(params) {
	 	return http.post('/user/luzhu/list',params)	
	 },
	 //下注
	 orderTable(params) {
		let gameType = {
			'3' : '/bjl',
			'2' : '/tiger',
			'6' :  '/cattle'
		}
	 	return http.post( `${gameType[params.game_type]}/bet/order`,params)	
	 },
};

export default apiService;
