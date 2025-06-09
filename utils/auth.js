import { http } from '@/common/service/service.js'
import configService from '@/common/service/config.service.js';
import { getUrlParams }  from './urlParams.js';
class AuthManager {
  constructor() {
    this.userInfo = null;
    this.token = null;
    this.userId = null;
  }
  
  // 从URL参数初始化登录状态
  initFromUrlParams() {
    const params = getUrlParams();
    
    if (params.user_id && params.token) {
      this.userId = params.user_id;
      this.token = params.token;
      
      // 保存到本地存储
      uni.setStorageSync('user_id', this.userId);
      uni.setStorageSync('token', this.token);
      
      console.log('从URL获取登录信息:', {
        userId: this.userId,
        token: this.token
      });
      
      return true;
    }
    
    return false;
  }
  
  // 从本地存储恢复登录状态
  restoreFromStorage() {
    try {
      this.userId = uni.getStorageSync('user_id');
      this.token = uni.getStorageSync('token');
      
      if (this.userId && this.token) {
        console.log('从本地存储恢复登录状态');
        return true;
      }
    } catch (e) {
      console.error('恢复登录状态失败:', e);
    }
    
    return false;
  }
  
  // 检查登录状态
  isLoggedIn() {
    return !!(this.userId && this.token);
  }
  
  // 获取用户信息
  getUserInfo() {
    return {
      userId: this.userId,
      token: this.token,
      userInfo: this.userInfo
    };
  }
  
  // 验证token有效性（向服务器验证）
  async validateToken() {
    if (!this.token || !this.userId) {
      return false;
    }
    
	try {
	  const params = {
		user_id: this.userId,
		token: this.token
	  };
	  
	  const res = await http.post('/user/curl/info', params);
	  
	  if (res.data && res.data.code === 200) {
		this.userInfo = res.data.userInfo;
		return true;
	  }
	} catch (e) {
	  console.error('验证token失败:', e);
	}
    
    return false;
  }
  
  // 清除登录状态
  logout() {
    this.userId = null;
    this.token = null;
    this.userInfo = null;
    
    // 清除本地存储
    uni.removeStorageSync('user_id');
    uni.removeStorageSync('token');
    
    console.log('已清除登录状态');
  }
}


const authManager = new AuthManager();

export default authManager;