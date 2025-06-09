import Request from '@/common/luch-request/index.js'
import {ACCESS_TOKEN} from '@/common/util/constants.js'
import configService from './config.service.js'
import tip from '@/common/util/tip.js';
import store from '@/store/index.js';
import Vue from 'vue';
//服务器url名字
const serviceName = {
	tigerUrl: '/tiger',
	bjlUrl: '/bjl',
	cattleUrl: '/cattle',
	userUrl: '/user'
}

const getTokenStorage = () => {
	let token = ''
	try{
		token = uni.getStorageSync(ACCESS_TOKEN)
	}catch(e){
		//TODO handle the exception
		// console.log("getTokenStorage",token)
	}
	return token
}



const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
  config.header = {
    ...config.header
  }
  return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
// 有默认，非必写
http.validateStatus = (statusCode) => {
  return statusCode === 200
}
/* 请求之前拦截器 */
http.interceptor.request((config, cancel) => { 
	//设置请求地址
	for(let k in serviceName){
		if(config.url.includes(serviceName[k])) {
			config.baseUrl = configService[k]
			break
		}
	}
  config.header = {
    ...config.header,
    // 'Content-Type':'multipart/form-data',
	//'Access-Control-Allow-Headers':'token',
     'x-csrf-token':getTokenStorage(),
     //'token':getTokenStorage(),
  }
  /*
  if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
  }
  */
  return config
})

// 必须使用异步函数，注意
http.interceptor.response(async (response) => { /* 请求之后拦截器 */
  // if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
  //   return Promise.reject(response)
  // }
	if(response.data.code == 505) {
		Vue.prototype.$otherPlaceVue.show({})
		return
	}
  return response
}, (response) => {
	// 请求错误做点什么
  // if (response) {
	  
    //   let data = response.data
    //   const token = uni.getStorageSync(ACCESS_TOKEN)
    //   console.log("------异常响应------",token)
    //   console.log("------异常响应------",data.status)
    //   switch (data.status) {
    //     case 403:
    //       tip.error('拒绝访问');
    //       break
    //     case 505:
    // //       if(!token || data.message=="Token失效，请重新登录"){
    // //         let timeout=setTimeout(tip.alert('登录已过期'), 1000);
    // //         store.dispatch('Logout').then(() => {
				
				// // clearTimeout(timeout)
    // //             window.location.reload()
				// // // this.$router.push('/pages/login/login')	
    // //         }) 
    // //       }
    //       break
    //     case 404:
    //       break
    //     case 504:
    //      break
    //     case 401:
    //       if (token) {
    //        /* store.dispatch('Logout').then(() => {
    //           setTimeout(() => {
    //             window.location.reload()
    //           }, 1500)
    //         }) */
    //       }
    //       break
    //     default:
    //       // tip.error({
    //       //   duration: 0,
    //       //   forbidClick: true,
    //       //   message: data.message
    //       // });
    //       break
    //   }
    // }
  return response
})

export {
  http
}
