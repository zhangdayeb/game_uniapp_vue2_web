import gameApi from '@/api/game'
import Vue from 'vue';
let maintainState = {
	
}
/**
 * 获取整站通知
 * */
maintainState.getNoticeList = () => {
	return new Promise((resolve, reject) => {
		//3 整站维护
		const MAINTAIN = 3
		gameApi.getNoticeList({id : MAINTAIN}).then(res => {
			if(res.data.code == 200){
				resolve(res.data.data)
				// if(res.data.data.web_maintain_status != 1){
				// 	uni.navigateTo({
				// 		url: '/pages/maintain/maintain'
				// 	})
				// }
				
				// Vue.prototype.$maintainVue.show({content: res.content})
			}else{
				reject(res.data)
			}
		}).catch(err => {
			// console.log(err)
			reject(err)
		})
		// 每秒判断用户 是否登录状态
	})
}

export default maintainState