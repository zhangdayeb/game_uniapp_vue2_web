import { http } from '@/common/service/service.js' 
//客服 api
const customerService = {
	getService(params) {
	 	return http.post('/user/user/config',params)	
	},
};

export default customerService;