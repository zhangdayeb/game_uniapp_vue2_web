import Vue from 'vue'
import Vuex from 'vuex'
import api from "@/api/api"
import { ACCESS_TOKEN,USER_NAME,USER_INFO } from "@/common/util/constants"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, info) => {
      state.userInfo = info
    }
  },
  actions: {
    // 登录
    mLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
       api.login(userInfo).then(response => {
          if(response.data.code ==200){ 
            const userInfo = response.data.data
			uni.setStorageSync(ACCESS_TOKEN,userInfo.token);
			uni.setStorageSync(USER_INFO,userInfo);
            commit('SET_TOKEN', userInfo.token)
            commit('SET_USERINFO', userInfo)
            resolve(response)
          }else{
            resolve(response)
          }
        }).catch(error => {
			console.log("catch===>response",error)
            reject(error)
        })
      })
    },
    //手机号登录
    PhoneLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        api.phoneNoLogin(userInfo).then(response => {
          if(response.data.code ==200){
            const result = response.data.result
            const userInfo = result.userInfo
			uni.setStorageSync(ACCESS_TOKEN,result.token);
			uni.setStorageSync(USER_INFO,userInfo);
            commit('SET_TOKEN', result.token)
            commit('SET_NAME', { username: userInfo.username,realname: userInfo.realname})
            commit('SET_AVATAR', userInfo.avatar)
            resolve(response)
          }else{
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        let logoutToken = state.token;
        commit('SET_TOKEN', '')
        uni.removeStorageSync(ACCESS_TOKEN)
        api.logout(logoutToken).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },
	// getUserInfo({ commit }, userInfo) {
 //      return new Promise((resolve, reject) => {
	// 	  api.getUserInfo().then(response=>{
			  
	// 	  }).catch(error => {
	// 		console.log("catch===>response",response)
	// 		reject(error)
 //        })
	//   })
	// } 
  },
  getters:{
    token: state => state.token,
	userinfo:state => {state.userinfo=uni.getStorageSync(USER_INFO); return state.userinfo},
  }
})
