<template>
  <!-- 登录页面主容器 -->
  <view class="login" id="login" ref="loginRef">
    
    <!-- 语言选择区域 -->
    <view class="login-language">
      <view class="" v-if="needLanguage">
        <!-- 当前选择的语言显示 -->
        <view class="login-choice-flag" id="login-selected" @click="showLocales()">
          <view class="login-flag" :class="selectedLocal.className"></view>
          <text>{{ selectedLocal.title }}</text>
        </view>
        
        <!-- 语言选择下拉面板 -->
        <view class="login-locales" id="login-locales" v-if="openLocalesPanel">
          <view 
            class="login-choice-flag" 
            @click="setLanguage(item)" 
            v-for="(item, index) in languageData" 
            :key="index"
          >
            <view class="login-flag" :class="item.className"></view>
            <text>{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 主要内容区域 -->
    <view class="login-section">
      
      <!-- 顶部logo区域 -->
      <view class="login-log">
        <!-- 主logo -->
        <view class="login-sun">
          <image 
            style="width: 280rpx; height: 280rpx;" 
            src="/static/img/login/logo.png"
          ></image>
        </view>
        
        <!-- 副logo -->
        <view class="login-sun">
          <image src="/static/img/login/logo_2.png"></image>
        </view>
        
        <!-- 文字logo区域 -->
        <view class="login-text">
          <view class="login-log-text">
            <!-- {{ loginLocales.groupName }} -->
          </view>
          <view class="">
            <!-- GOLDEN HORSE CASINO -->
          </view>
        </view>
      </view>
      
      <!-- 登录表单面板 -->
      <view class="login-panel">
        
        <!-- 登录表单 -->
        <view class="">
          <!-- 账号输入 -->
          <view class="login-row">
            <view class="login-in-box">
              <image 
                class="login-in-img" 
                src="../../static/img/login/user.svg"
              ></image>
              <input 
                class="login-box" 
                v-model="loginform.phone" 
                type="text" 
                @input="cancelPwd()" 
                value="" 
                :placeholder="loginLocales.inputAccount" 
              />
            </view>
          </view>
          
          <!-- 密码输入 -->
          <view class="login-row">
            <view class="login-in-box">
              <image 
                class="login-in-img" 
                src="../../static/img/login/mima.svg"
              ></image>
              <input 
                class="login-box" 
                :value="pwd_show" 
                type="text" 
                @input="handleInput($event)" 
                :placeholder="loginLocales.inputPassword" 
              />
            </view>
          </view>
          
          <!-- 登录按钮组 -->
          <view class="login-row login-btns">
            <!-- 登录按钮 -->
            <view 
              class="login-btn login-main-btn" 
              @click="loginFun()"
            >
              {{ loginLocales.login }}
            </view>
          </view>
          
          <!-- 注册和游客试用按钮组 -->
          <view class="login-row login-btns">
            <!-- 注册按钮 -->
            <view 
              class="login-btn login-register-btn" 
              @click="goToRegister()"
            >
              注册
            </view>
            <!-- 游客试用按钮 -->
            <view 
              class="login-btn login-trial-btn"
              @click="loginTest()"
            >
              试玩游戏
            </view>
          </view>
        </view>
        
        <!-- 客服按钮组 -->
        <view class="login-row login-service-btns-simple">
          <!-- Telegram按钮 -->
          <view class="service-btn-simple telegram" @click="openTelegram()">
            Telegram
          </view>
          <!-- 在线客服按钮 -->
          <view class="service-btn-simple customer-service" @click="openCustomerService()">
            在线客服
          </view>
        </view>
        
        <!-- H5平台特有内容（已注释） -->
        <!--#ifdef H5-->
        <!-- H5下载和保存指导（已注释）-->
        <!--#endif -->
      </view>
      
      <!-- 底部动画logo（已注释） -->
      <!-- <view class="login-sun" style="margin-top: 180rpx;">
        <image style="width: 380rpx; height: 380rpx;" src="/static/img/login/logo.gif"></image>
      </view> -->
      
      <!-- 维护提示面板（已注释） -->
      <!-- <view class="login-panel login-maintain-panel" v-if="maintainData.web_maintain_status == WEB_MAINTAIN">
        <view class="login-maintain-title"></view>
        <view class="maintain-content">{{ maintainData.content }}</view>
      </view> -->
    </view>
    
    <!-- 添加到桌面指导组件 -->
    <guidance :show="showGuidance" @close="showGuidance = false"></guidance>
  </view>
</template>

<script>
import { mapActions } from "vuex"
import Vue from 'vue'
import api from "@/api/api"
import guidance from './guidance.vue'
import md5 from "@/common/util/md5.js"
import configService from '@/common/service/config.service.js'
import customerService from '@/api/customer.js'

export default {
  // 组件名称
  name: 'LoginPage',
  
  // 注册子组件
  components: {
    guidance
  },
  
  // 组件数据
  data() {
    return {
      // ========== 登录相关数据 ==========
      // 登录表单数据
      loginform: {
        phone: '',    // 手机号/账号
        pwd: ''       // 密码
      },
      
      // ========== 密码显示控制 ==========
      pwd_show: '',        // 显示的密码（可能是明文或*号）
      pwd_send: '',        // 实际发送的密码
      pwd_hide: '',        // 隐藏显示的密码（*号）
      pwd_number: 0,       // 密码长度
      pwd_before: '',      // 密码输入前的内容
      showPwd: false,      // 是否显示明文密码
      
      // ========== 系统配置 ==========
      openLocalesPanel: false,        // 是否打开语言选择面板
      needLanguage: true,             // 是否需要多语言功能
      
      // ========== 国际化相关 ==========
      // 当前页面语言包
      loginLocales: this._i18n.messages[this.$storageLan].login,
      
      // 支持的语言列表
      languageData: [
        {
          className: 'login-flag-zh',   // CSS类名
          title: '简体中文',             // 显示名称
          type: 'zh',                   // 语言类型
          serviceValue: 'zh-cn'         // 服务端值
        },
        {
          className: 'login-flag-en',
          title: 'English',
          type: 'en',
          serviceValue: 'en-us'
        },
        {
          className: 'login-flag-jp',
          title: '日本語',
          type: 'jpn',
          serviceValue: 'jpn'
        },
        {
          className: 'login-flag-kor',
          title: '한글',
          type: 'kor',
          serviceValue: 'kor'
        },
        {
          className: 'login-flag-tha',
          title: 'ภาษาไทย',
          type: 'tha',
          serviceValue: 'tha'
        },
        {
          className: 'login-flag-vnm',
          title: 'ViệtName',
          type: 'vnm',
          serviceValue: 'vnm'
        }
      ],
      
      // 当前选择的语言
      selectedLocal: {},
      
      // ========== 页面状态控制 ==========
      showGuidance: false,         // 是否显示添加到桌面指导
      
      // ========== 系统配置数据 ==========
      appKeFuUrl: {},             // 客服地址
	  appFeiJiUrl: {},             // 飞机地址
    }
  },
  
  /**
   * 页面加载时的处理
   * @param {Object} option - 页面参数
   */
  onLoad(option) {
    // 清除所有本地存储
    this.clearAllStorage()
  },
  
  /**
   * 组件挂载后的处理
   */
  mounted() {
    this.getNoticeList()        // 获取通知列表
    
    // H5平台特有处理
    //#ifdef H5
    this.setLoginLocales()      // 设置语言面板事件监听
    //#endif
    
    this.getCustomerService()   // 获取客服信息
  },
  
  /**
   * 页面显示时的处理
   */
  onShow() {
    this.getNoticeList()        // 重新获取通知列表
    this.clearAllStorage()      // 清除本地存储
    
    // 设置当前语言到本地存储
    uni.setStorageSync('language', this.$storageLan)
    
    // 根据当前语言设置选择的语言对象
    this.languageData.forEach(el => {
      if (el.type == this.$storageLan) {
        this.selectedLocal = el
      }
    })
    
    // 如果不需要多语言功能，使用默认语言
    if (!this.needLanguage) {
      this.selectedLocal = this.languageData[0]
      Vue.prototype.$storageLan = this.selectedLocal.type
      this.loginLocales = this._i18n.messages[this.$storageLan].login
      uni.setStorageSync('language', this.selectedLocal.type)
    }
  },
  
  /**
   * 页面卸载时的处理
   */
  onUnload() {
    this.clearAllStorage()
  },
  
  /**
   * 组件销毁时的处理
   */
  destroyed() {
    this.clearAllStorage()
  },
  
  // 方法定义
  methods: {
    // 引入Vuex的actions
    ...mapActions(["mLogin"]),
    
    // ========== 密码显示控制方法 ==========
    
    /**
     * 登录框输入时取消密码
     * 当用户重新输入账号时，清空密码
     */
    cancelPwd() {
      this.pwd_show = ''
      this.loginform.pwd = ''
    },
    
    // ========== 客服相关方法 ==========
    
    /**
     * 打开Telegram客服
     */
    openTelegram() {
		this.toService(this.appFeiJiUrl)
    },
    
    /**
     * 打开在线客服
     */
    openCustomerService() {
      this.toService(this.appKeFuUrl)
	  
    },
    
    // ========== 配置获取方法 ==========
    
    /**
     * 获取客服信息
     */
    getCustomerService() {
      api.getUserWhat({})
        .then(res => {
          if (res.data.code == 200) {
            this.appKeFuUrl = res.data.data.appKeFuUrl
			this.appFeiJiUrl = res.data.data.appFeiJiUrl
			
			uni.setStorageSync('appKeFuUrl',this.appKeFuUrl)
			uni.setStorageSync('appFeiJiUrl',this.appFeiJiUrl)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    // ========== 页面跳转方法 ==========
    
    /**
     * 跳转到注册页面
     */
    goToRegister() {
      uni.navigateTo({
        url: '/pages/login/register'
      })
    },
    
    // ========== 语言和地区选择方法 ==========
    
    /**
     * 显示/隐藏语言选择面板
     */
    showLocales() {
      this.openLocalesPanel = !this.openLocalesPanel
    },
    
    /**
     * 设置语言
     * @param {Object} item - 选择的语言对象
     */
    setLanguage(item) {
      uni.setStorageSync('language', item.type)
      this.selectedLocal = item
      this.loginLocales = this._i18n.messages[item.type].login
      this.openLocalesPanel = false
      Vue.prototype.$storageLan = item.type
    },
    
    // ========== 登录相关方法 ==========
    
    /**
     * 用户登录
     */
    loginFun() {
      this.loginform.pwd = this.pwd_send
      this.loginform.lang = this.selectedLocal.serviceValue
      
      this.mLogin(this.loginform)
        .then((res) => {
          if (res.data.code == 200) {
            this.$tip.success(this.loginLocales.success)
            this.languageUpdate()
          } else {
            this.$tip.alert(res.data.message)
          }
        })
        .catch((err) => {
          this.$tip.alert('请求出现错误，请稍后再试')
        })
        .finally(() => {
          // 请求完成后的处理
        })
    },
    
    /**
     * 游客试用登录
     */
    loginTest() {
      api.loginTest({ lang: this.selectedLocal.serviceValue })
        .then((res) => {
          if (res.data.code == 200) {
            uni.setStorageSync('login_user_info', res.data.data)
            uni.setStorageSync('Access-Token', res.data.data.token)
			uni.setStorageSync('user_id', res.data.data.id);
			uni.setStorageSync('token', res.data.data.token);
            this.languageUpdate()
          } else {
            this.$tip.alert(res.data)
          }
        })
    },
    
    /**
     * 登录成功后更新语言设置
     */
    languageUpdate() {
      api.languageUpdate({ lang: this.selectedLocal.serviceValue })
        .then(res => {
          uni.navigateTo({
            url: '/pages/index/index'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    // ========== 密码输入处理方法 ==========
    
    /**
     * 监听密码输入
     * 实现密码的星号显示功能
     * @param {Event} e - 输入事件
     */
    handleInput(e) {
      let miMa = e.target.value
      
      // 处理星号密码
      let starPwd = miMa.substr(0, this.pwd_before.length)
      this.pwd_before = miMa.replace(starPwd, this.pwd_before)
      this.pwd_send = this.pwd_before
      
      let pwd_number_now = miMa.length
      
      // 处理密码长度变化
      if (this.pwd_number > pwd_number_now) {
        // 密码长度减少了
        this.pwd_send = this.pwd_send.substr(0, pwd_number_now)
        this.pwd_before = this.pwd_send
      } else {
        // 密码长度增加了
        let pwd = this.pwd_before.substr(0, this.pwd_before.length)
        this.pwd_before = pwd
        this.pwd_send = this.pwd_before
      }
      
      // 生成星号显示
      let arrStr = this.pwd_before.split("")
      let replaceWord = ''
      for (let i = 0; i < arrStr.length; i++) {
        arrStr[i] = "*"
      }
      replaceWord = arrStr.join("").replace(',', '')
      
      // 根据是否显示明文密码来设置显示内容
      if (this.showPwd) {
        this.pwd_show = this.pwd_send
      } else {
        this.pwd_show = replaceWord
      }
      
      this.pwd_hide = replaceWord
      this.pwd_number = pwd_number_now
    },
    
    // ========== 系统相关方法 ==========
    
    /**
     * 获取整站通知/维护信息
     */
    getNoticeList() {
      this.$maintainState.getNoticeList()
        .then(res => {
          // 如果网站处于维护状态，跳转到维护页面
          if (res.web_maintain_status == this.$WEB_MAINTAIN_STATE) {
            uni.navigateTo({
              url: '/pages/maintain/maintain'
            })
          }
        })
    },
    
    /**
     * 清除所有本地存储
     * 保留标记存储项
     */
    clearAllStorage() {
      let storage = uni.getStorageInfoSync()
      storage.keys.forEach(key => {
        if (!key.includes('storage_flag')) {
          uni.removeStorageSync(key)
        }
      })
    },
    
    /**
     * 设置登录语言面板的点击监听（仅H5）
     * 点击面板外部时关闭语言选择面板
     */
setLoginLocales() {
  // 方法1：添加安全检查
  const dom = document.getElementById("login");
  
  // 检查元素是否存在
  if (!dom) {
    console.warn('Element with id "login" not found');
    return;
  }
  
  // 检查是否支持 addEventListener
  if (typeof dom.addEventListener !== 'function') {
    console.warn('Element does not support addEventListener');
    return;
  }
  
  dom.addEventListener('click', (e) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    
    let ev = e || window.event;
    let elem = ev.target || ev.srcElement;
    
    let b = false;
    while (elem) {
      if (elem.id && (elem.id === 'login-selected' || elem.id === 'login-locales')) {
        b = true;
        return;
      }
      elem = elem.parentNode;
      if (elem && elem.id && elem.id === 'login-locales') {
        b = true;
        return;
      }
    }
    
    if (!b) {
      this.openLocalesPanel = false;
    }
  });
},
    
    // ========== 工具方法 ==========
    
    // ========== 页面跳转相关方法 ==========
    
    /**
     * 打开外部链接（仅H5）
     * @param {string} url - 要打开的URL
     */
    toService(url) {
      //#ifdef H5
      window.open(url, '_blank')
      //#endif
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 全局页面样式 ========== */
page {
  height: 100%;
  overflow: hidden;
}

/* ========== 登录页面主体样式 ========== */
.login {
  height: 100%;
  position: relative;
  padding-top: var(--status-bar-height);
  
  /* 背景图片 */
  &::before {
    content: " ";
    width: 100%;
    height: 100%;
    top: 0;
    position: absolute;
    background: url('/static/img/login/bg1.jpg') no-repeat center center fixed;
    background-size: 100% 100%;
    opacity: 0.2;
    z-index: 0;
  }
}

/* ========== 语言选择区域样式 ========== */
.login-language {
  height: 66rpx;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 99;
}

.login-choice-flag {
  width: 230rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 44rpx;
  color: white;
}

/* 国旗图标样式 */
.login-flag {
  width: 32rpx;
  height: 22rpx;
  margin-right: 10rpx;
  background: url('/static/img/language/flags.png') no-repeat;
  
  /* 各国国旗背景位置 */
  &.login-flag-zh {
    background-position: -208px -22px;
  }
  
  &.login-flag-en {
    background-position: -144px -154px;
  }
  
  &.login-flag-jp {
    background-position: -15px -77px;
  }
  
  &.login-flag-kor {
    background-position: -144px -77px;
  }
  
  &.login-flag-tha {
    background-position: -224px -118px;
  }
  
  &.login-flag-vnm {
    background-position: -16px -165px;
  }
}

/* 语言选择下拉面板 */
.login-locales {
  position: absolute;
  border: 1px solid #c3ad86;
  padding-left: 10rpx;
  border-radius: 10rpx;
  right: 0;
  top: 68rpx;
  display: flex;
  flex-direction: column;
  z-index: 999;
}

/* ========== 主要内容区域样式 ========== */
.login-section {
  position: absolute;
  height: calc(100% - 66rpx - 60rpx);
  width: 100%;
  top: 45%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ========== Logo区域样式 ========== */
.login-log {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.login-sun {
  text-align: center;
  
  image {
    width: 320rpx;
    height: 176rpx;
  }
}

.login-text {
  overflow: hidden;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #bcaf95;
  
  image {
    width: 400rpx;
    height: 120rpx;
  }
}

.login-log-text {
  font-size: 37px;
  font-family: KaiTi;
}

/* ========== 表单面板样式 ========== */
.login-panel {
  width: 560rpx;
  margin: 0 auto;
  z-index: 99;
  max-height: calc(100% - 294rpx);
  overflow-y: auto;
}

/* 维护面板样式 */
.login-maintain-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #d3d4d3;
  border: 2rpx solid #72654d;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
}

/* ========== 输入框样式 ========== */
.login-in-box {
  display: flex;
  height: 80rpx;
  margin: 30rpx auto;
  border: 1px solid #c2c5d6;
  background-color: #283854;
  border-radius: 40rpx;
}

.login-in-img {
  width: 50rpx;
  height: auto;
  margin-left: 20rpx;
}

.login-box {
  height: 100%;
  padding-left: 20rpx;
  width: 446rpx;
  color: white;
}

/* ========== 表单行样式 ========== */
.login-row {
  margin-top: 60rpx;
}

/* ========== 按钮样式 ========== */
.login-btns {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.login-btn {
  flex: 1;
  height: 88rpx;
  text-align: center;
  line-height: 88rpx;
  border-radius: 44rpx;
  color: white;
  font-size: 30rpx;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  border: 2rpx solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 按钮内发光效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:active::before {
    left: 100%;
  }
  
  /* 主要按钮（登录）样式 */
  &.login-main-btn {
    width: 100%;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    box-shadow: 
      0 8rpx 32rpx rgba(99, 102, 241, 0.3),
      0 2rpx 8rpx rgba(99, 102, 241, 0.2);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    
    &:active {
      transform: translateY(4rpx);
      box-shadow: 
        0 4rpx 16rpx rgba(99, 102, 241, 0.4),
        0 1rpx 4rpx rgba(99, 102, 241, 0.3);
    }
  }
  
  /* 注册按钮样式 */
  &.login-register-btn {
    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
    box-shadow: 
      0 6rpx 24rpx rgba(236, 72, 153, 0.3),
      0 2rpx 8rpx rgba(236, 72, 153, 0.2);
    border: 2rpx solid rgba(255, 255, 255, 0.15);
    
    &:active {
      transform: translateY(3rpx);
      box-shadow: 
        0 3rpx 12rpx rgba(236, 72, 153, 0.4),
        0 1rpx 4rpx rgba(236, 72, 153, 0.3);
    }
  }
  
  /* 游客试用按钮样式 */
  &.login-trial-btn {
    background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
    box-shadow: 
      0 6rpx 24rpx rgba(6, 182, 212, 0.3),
      0 2rpx 8rpx rgba(6, 182, 212, 0.2);
    border: 2rpx solid rgba(255, 255, 255, 0.15);
    
    &:active {
      transform: translateY(3rpx);
      box-shadow: 
        0 3rpx 12rpx rgba(6, 182, 212, 0.4),
        0 1rpx 4rpx rgba(6, 182, 212, 0.3);
    }
  }
  
  /* 按钮宽度100% */
  &.login-btn-full {
    width: 100%;
  }
}

/* ========== 客服按钮组样式 ========== */
.login-service-btns-simple {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
  gap: 20rpx;
  
  .service-btn-simple {
    flex: 1;
    height: 76rpx;
    border-radius: 38rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10rpx);
    color: #ffffff;
    font-size: 26rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    /* 按钮微光效果 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s;
    }
    
    &:active {
      transform: scale(0.95);
      
      &::before {
        left: 100%;
      }
    }
    
    /* Telegram按钮样式 */
    &.telegram {
      border-color: rgba(0, 136, 204, 0.6);
      background: linear-gradient(135deg, rgba(0, 136, 204, 0.2) 0%, rgba(0, 136, 204, 0.1) 100%);
      color: #0ea5e9;
      
      &:active {
        background: linear-gradient(135deg, rgba(0, 136, 204, 0.3) 0%, rgba(0, 136, 204, 0.2) 100%);
        box-shadow: 0 0 20rpx rgba(0, 136, 204, 0.3);
      }
    }
    
    /* 客服按钮样式 */
    &.customer-service {
      border-color: rgba(34, 197, 94, 0.6);
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
      color: #22c55e;
      
      &:active {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%);
        box-shadow: 0 0 20rpx rgba(34, 197, 94, 0.3);
      }
    }
  }
}

/* ========== 版权信息样式 ========== */
.login-copyright {
  color: white;
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 10px;
}
</style>