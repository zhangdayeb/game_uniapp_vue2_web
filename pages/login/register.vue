<template>
  <!-- 注册页面主容器 -->
  <view class="register" id="register" ref="registerRef">
    
    <!-- 语言选择区域 -->
    <view class="register-language">
      <view class="" v-if="needLanguage">
        <!-- 当前选择的语言显示 -->
        <view class="register-choice-flag" id="register-selected" @click="showLocales()">
          <view class="register-flag" :class="selectedLocal.className"></view>
          <text>{{ selectedLocal.title }}</text>
        </view>
        
        <!-- 语言选择下拉面板 -->
        <view class="register-locales" id="register-locales" v-if="openLocalesPanel">
          <view 
            class="register-choice-flag" 
            @click="setLanguage(item)" 
            v-for="(item, index) in languageData" 
            :key="index"
          >
            <view class="register-flag" :class="item.className"></view>
            <text>{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 主要内容区域 -->
    <view class="register-section">
      
      <!-- 顶部logo区域 -->
      <view class="register-log">
        <!-- 主logo -->
        <view class="register-sun">
          <image 
            style="width: 200rpx; height: 200rpx;" 
            src="/static/img/login/logo.png"
          ></image>
        </view>
        
        <!-- 注册标题 -->
        <view class="register-title">
          <text>{{ loginLocales.register || '用户注册' }}</text>
        </view>
      </view>
      
      <!-- 注册表单面板 -->
      <view class="register-panel">
        
        <!-- 注册表单 -->
        <view class="register-form">
          <!-- 用户名输入 -->
          <view class="register-row">
            <view class="register-input-box">
              <image 
                class="register-input-icon" 
                src="../../static/img/login/user.svg"
              ></image>
              <input 
                class="register-input" 
                v-model="registerData.userName" 
                type="text" 
                value="" 
                :placeholder="loginLocales.userAccount || '请输入用户名'" 
              />
            </view>
          </view>
          
          <!-- 密码输入 -->
          <view class="register-row">
            <view class="register-input-box">
              <image 
                class="register-input-icon" 
                src="../../static/img/login/mima.svg"
              ></image>
              <input 
                class="register-input" 
                :password="!registerPwsswordShow.firstPasswordShow" 
                type="text" 
                v-model="registerData.password" 
                value="" 
                :placeholder="loginLocales.inputPassword || '请输入密码'" 
              />
              <!-- 显示/隐藏密码按钮 -->
              <image 
                class="register-pwd-toggle" 
                src="../../static/img/login/eye.svg" 
                @click="handleRegisterPwsswordShwo('firstPasswordShow', true)" 
                v-if="!registerPwsswordShow.firstPasswordShow"
              ></image>
              <image 
                class="register-pwd-toggle" 
                src="../../static/img/login/shutEye.svg" 
                @click="handleRegisterPwsswordShwo('firstPasswordShow', false)" 
                v-if="registerPwsswordShow.firstPasswordShow"
              ></image>
            </view>
          </view>
          
          <!-- 确认密码输入 -->
          <view class="register-row">
            <view class="register-input-box">
              <image 
                class="register-input-icon" 
                src="../../static/img/login/mima.svg"
              ></image>
              <input 
                class="register-input" 
                :password="!registerPwsswordShow.confirmPasswordShow" 
                type="text" 
                v-model="registerData.confirmPassword" 
                value="" 
                :placeholder="loginLocales.confirmPassword || '请确认密码'" 
              />
              <!-- 显示/隐藏确认密码按钮 -->
              <image 
                class="register-pwd-toggle" 
                src="../../static/img/login/eye.svg" 
                @click="handleRegisterPwsswordShwo('confirmPasswordShow', true)" 
                v-if="!registerPwsswordShow.confirmPasswordShow"
              ></image>
              <image 
                class="register-pwd-toggle" 
                src="../../static/img/login/shutEye.svg" 
                @click="handleRegisterPwsswordShwo('confirmPasswordShow', false)" 
                v-if="registerPwsswordShow.confirmPasswordShow"
              ></image>
            </view>
          </view>
          
          <!-- 手机号输入 -->
          <view class="register-row">
            <view class="register-input-box">
              <image 
                class="register-input-icon" 
                src="../../static/img/login/mobile.svg"
              ></image>
              <input 
                class="register-input register-mobile-input" 
                v-model="registerData.mobile" 
                type="text" 
                value="" 
                :placeholder="loginLocales.mobile || '请输入手机号'" 
              />
              <!-- 国家代码选择 -->
              <text class="register-country-code" @click="showMobileLocales=!showMobileLocales">
                {{ selectedMobile.country }}
              </text>
              <!-- 国家代码下拉列表 -->
              <view class="register-country-list" v-if="showMobileLocales">
                <view 
                  class="register-country-item" 
                  v-for="item in mobileLocales" 
                  :key="item.num" 
                  @click="handleLocalesMobile(item)"
                >
                  {{ item.country }}
                </view>
              </view>
            </view>
          </view>
          
          <!-- 验证码输入 -->
          <view class="register-row">
            <view class="register-input-box">
              <image 
                class="register-input-icon" 
                src="../../static/img/login/security.svg"
              ></image>
              <input 
                class="register-input register-code-input" 
                v-model="registerData.code" 
                type="text" 
                value="" 
                :placeholder="loginLocales.verificationCode || '请输入验证码'" 
              />
              <!-- 发送验证码按钮 -->
              <text 
                class="register-send-code" 
                @click="getLoginCaptcha()" 
                v-if="sendCodeTime < 1"
              >
                {{ loginLocales.sendCode || '发送验证码' }}
              </text>
              <!-- 验证码倒计时 -->
              <text class="register-send-code disabled" v-if="sendCodeTime > 0">
                {{ sendCodeTime }}s
              </text>
            </view>
          </view>
          
          <!-- 推荐人ID输入 -->
          <view class="register-row">
            <view class="register-input-box">
              <image 
                class="register-input-icon" 
                src="../../static/img/login/recommend.svg"
              ></image>
              <input 
                class="register-input" 
                v-model="registerData.recommendId" 
                type="text" 
                value="" 
                :placeholder="loginLocales.referenceId || '推荐人ID（可选）'" 
              />
            </view>
          </view>
          
          <!-- 注册按钮 -->
          <view class="register-row">
            <view class="register-btn register-submit-btn" @click="handleRegister()">
              {{ loginLocales.register || '立即注册' }}
            </view>
          </view>
          
          <!-- 返回登录链接 -->
          <view class="register-row register-login-link">
            <text @click="goToLogin()">
              {{ loginLocales.goLogin || '已有账号？返回登录' }}
            </text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 添加到桌面指导组件 -->
    <guidance :show="showGuidance" @close="showGuidance = false"></guidance>
  </view>
</template>

<script>
import { mapActions } from "vuex"
import Vue from 'vue'
import api from "@/api/api"
import gameApi from '@/api/game'
import guidance from './guidance.vue'
import md5 from "@/common/util/md5.js"

export default {
  // 组件名称
  name: 'RegisterPage',
  
  // 注册子组件
  components: {
    guidance
  },
  
  // 组件数据
  data() {
    return {
      // ========== 系统配置 ==========
      openLocalesPanel: false,        // 是否打开语言选择面板
      needLanguage: true,             // 是否需要多语言功能
      
      // ========== 国际化相关 ==========
      // 当前页面语言包
      loginLocales: this._i18n.messages[this.$storageLan].login,
      
      // 支持的语言列表
      languageData: [
        {
          className: 'register-flag-zh',
          title: '简体中文',
          type: 'zh',
          serviceValue: 'zh-cn'
        },
        {
          className: 'register-flag-en',
          title: 'English',
          type: 'en',
          serviceValue: 'en-us'
        },
        {
          className: 'register-flag-jp',
          title: '日本語',
          type: 'jpn',
          serviceValue: 'jpn'
        },
        {
          className: 'register-flag-kor',
          title: '한글',
          type: 'kor',
          serviceValue: 'kor'
        },
        {
          className: 'register-flag-tha',
          title: 'ภาษาไทย',
          type: 'tha',
          serviceValue: 'tha'
        },
        {
          className: 'register-flag-vnm',
          title: 'ViệtName',
          type: 'vnm',
          serviceValue: 'vnm'
        }
      ],
      
      // 当前选择的语言
      selectedLocal: {},
      
      // ========== 手机区号相关 ==========
      // 支持的国家电话区号
      mobileLocales: [
        {
          country: this._i18n.messages[this.$storageLan].login.China,
          num: '86'
        },
        {
          country: this._i18n.messages[this.$storageLan].login.Thailand,
          num: '66'
        },
        {
          country: this._i18n.messages[this.$storageLan].login.Vietnam,
          num: '84'
        },
        {
          country: this._i18n.messages[this.$storageLan].login.Korea,
          num: '82'
        },
        {
          country: this._i18n.messages[this.$storageLan].login.Japan,
          num: '81'
        },
        {
          country: this._i18n.messages[this.$storageLan].login.Philippines,
          num: '63'
        },
        {
          country: this._i18n.messages[this.$storageLan].login.Cambodia,
          num: '855'
        }
      ],
      
      // 当前选择的国家电话区号
      selectedMobile: {
        country: this._i18n.messages[this.$storageLan].login.Cambodia,
        num: '855'
      },
      
      // 是否显示手机区号选择面板
      showMobileLocales: false,
      
      // ========== 注册相关数据 ==========
      // 注册表单数据
      registerData: {
        userName: '',        // 用户名
        password: '',        // 密码
        confirmPassword: '', // 确认密码
        mobile: '',          // 手机号
        code: '123456',      // 验证码
        recommendId: '',     // 推荐人ID
      },
      
      // 注册密码显示/隐藏控制
      registerPwsswordShow: {
        firstPasswordShow: false,    // 是否显示第一个密码
        confirmPasswordShow: false,  // 是否显示确认密码
      },
      
      // 验证码发送倒计时
      sendCodeTime: 0,
      
      // ========== 页面状态控制 ==========
      showGuidance: false,         // 是否显示添加到桌面指导
    }
  },
  
  /**
   * 页面加载时的处理
   * @param {Object} option - 页面参数
   */
  onLoad(option) {
    // 如果传入了推荐人参数，设置推荐人ID
    if (option.recommender) {
      this.registerData.recommendId = option.recommender
    }
    
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
    this.setRegisterLocales()      // 设置语言面板事件监听
    //#endif
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
    // ========== 密码显示控制方法 ==========
    
    /**
     * 设置注册密码的显示/隐藏状态
     * @param {string} key - 要设置的字段名
     * @param {boolean} b - 是否显示密码
     */
    handleRegisterPwsswordShwo(key, b) {
      this.registerPwsswordShow[key] = b
    },
    
    // ========== 验证码相关方法 ==========
    
    /**
     * 获取登录验证码
     */
    getLoginCaptcha() {
      // 验证手机号
      if (!this.registerData.mobile) {
        this.$tip.alert('请输入手机号')
        return
      }
      
      // 生成时间戳和签名
      let time = new Date().getTime().toString()
      let str = 'tyh' + time
      str = (md5.hex_md5(str))
      
      // 发送验证码请求
      gameApi.getLoginCaptcha({
        phone: this.registerData.mobile,
        area_code: this.selectedMobile.num,
        lang: this.selectedLocal.serviceValue,
        sign: str,
        timestamp: time
      }).then(res => {
        if (res.data.code == 200) {
          // 开始60秒倒计时
          this.sendCodeTime = 60
          this.handleCodeTime()
        }
        this.$tip.alert(res.data.message)
      }).catch(err => {
        console.log(err)
        this.$tip.alert('验证码发送失败，请稍后重试')
      })
    },
    
    /**
     * 处理验证码发送倒计时
     */
    handleCodeTime() {
      if (this.sendCodeTime <= 0) {
        return
      }
      this.sendCodeTime--
      setTimeout(() => {
        this.handleCodeTime()
      }, 1000)
    },
    
    // ========== 注册相关方法 ==========
    
    /**
     * 用户注册
     */
    handleRegister() {
      // 表单验证
      if (!this.registerData.userName) {
        this.$tip.alert('请输入用户名')
        return
      }
      
      if (!this.registerData.password) {
        this.$tip.alert('请输入密码')
        return
      }
      
      if (!this.registerData.confirmPassword) {
        this.$tip.alert('请确认密码')
        return
      }
      
      if (this.registerData.password !== this.registerData.confirmPassword) {
        this.$tip.alert('两次输入的密码不一致')
        return
      }
      
      // if (!this.registerData.mobile) {
      //   this.$tip.alert('请输入手机号')
      //   return
      // }
      
      // if (!this.registerData.code) {
      //   this.$tip.alert('请输入验证码')
      //   return
      // }
      
      let data = {
        user_name: this.registerData.userName,
        phone: this.registerData.mobile,
        pwd: this.registerData.password,
        password: this.registerData.confirmPassword,
        captcha: this.registerData.code,
        codes: this.registerData.recommendId,
        area_code: this.selectedMobile.num,
        lang: this.selectedLocal.serviceValue
      }
      
      gameApi.loginRegister(data)
        .then(res => {
          if (res.data.code == 200) {
            this.$tip.success(this.loginLocales.successRegister || '注册成功')
            // 注册成功后跳转到登录页面
            setTimeout(() => {
              this.goToLogin()
            }, 1500)
          } else {
            this.$tip.alert(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$tip.alert('注册失败，请稍后重试')
        })
    },
    
    // ========== 页面跳转方法 ==========
    
    /**
     * 跳转到登录页面
     */
    goToLogin() {
      uni.redirectTo({ url: '/pages/login/login' })
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
    
    /**
     * 选择国家电话区号
     * @param {Object} item - 国家信息对象
     */
    handleLocalesMobile(item) {
      this.selectedMobile = item
      this.showMobileLocales = false
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
     * 设置注册语言面板的点击监听（仅H5）
     * 点击面板外部时关闭语言选择面板
     */
    setRegisterLocales() {
      let dom = document.getElementById("register")
      dom.addEventListener('click', (e) => {
        if (e.stopPropagation) {
          e.stopPropagation()
        }
        
        let ev = e || window.event
        let elem = ev.target || ev.srcElement
        
        let b = false
        while (elem) {
          if (elem.id && (elem.id === 'register-selected' || elem.id === 'register-locales')) {
            b = true
            return
          }
          elem = elem.parentNode
          if (elem && elem.id && elem.id === 'register-locales') {
            b = true
            return
          }
        }
        
        if (!b) {
          this.openLocalesPanel = false
        }
      })
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

/* ========== 注册页面主体样式 ========== */
.register {
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
.register-language {
  height: 66rpx;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 99;
}

.register-choice-flag {
  width: 230rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 44rpx;
  color: white;
}

/* 国旗图标样式 */
.register-flag {
  width: 32rpx;
  height: 22rpx;
  margin-right: 10rpx;
  background: url('/static/img/language/flags.png') no-repeat;
  
  /* 各国国旗背景位置 */
  &.register-flag-zh {
    background-position: -208px -22px;
  }
  
  &.register-flag-en {
    background-position: -144px -154px;
  }
  
  &.register-flag-jp {
    background-position: -15px -77px;
  }
  
  &.register-flag-kor {
    background-position: -144px -77px;
  }
  
  &.register-flag-tha {
    background-position: -224px -118px;
  }
  
  &.register-flag-vnm {
    background-position: -16px -165px;
  }
}

/* 语言选择下拉面板 */
.register-locales {
  position: absolute;
  border: 1px solid #c3ad86;
  padding-left: 10rpx;
  border-radius: 10rpx;
  right: 0;
  top: 68rpx;
  display: flex;
  flex-direction: column;
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
}

/* ========== 主要内容区域样式 ========== */
.register-section {
  position: absolute;
  height: calc(100% - 66rpx);
  width: 100%;
  top: 66rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  overflow-y: auto;
}

/* ========== Logo区域样式 ========== */
.register-log {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.register-sun {
  text-align: center;
  margin-bottom: 30rpx;
}

.register-title {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

/* ========== 表单面板样式 ========== */
.register-panel {
  width: 600rpx;
  z-index: 99;
}

.register-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  border-radius: 20rpx;
  padding: 40rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* ========== 输入框样式 ========== */
.register-row {
  margin-bottom: 30rpx;
}

.register-input-box {
  display: flex;
  align-items: center;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 44rpx;
  padding: 0 20rpx;
  position: relative;
}

.register-input-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
  opacity: 0.8;
}

.register-input {
  flex: 1;
  height: 100%;
  color: white;
  font-size: 28rpx;
  background: transparent;
  border: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}

.register-mobile-input {
  width: calc(100% - 120rpx);
}

.register-code-input {
  width: calc(100% - 140rpx);
}

/* ========== 密码显示/隐藏按钮 ========== */
.register-pwd-toggle {
  width: 40rpx;
  height: 40rpx;
  opacity: 0.7;
  
  &:active {
    opacity: 1;
  }
}

/* ========== 国家代码选择 ========== */
.register-country-code {
  position: absolute;
  right: 20rpx;
  color: #ffffff;
  font-size: 24rpx;
  padding: 8rpx 12rpx;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.1);
  min-width: 80rpx;
  text-align: center;
}

.register-country-list {
  position: absolute;
  top: 100%;
  right: 20rpx;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 10rpx;
  max-height: 200rpx;
  overflow-y: auto;
  z-index: 1000;
  min-width: 120rpx;
}

.register-country-item {
  padding: 16rpx 20rpx;
  color: white;
  font-size: 24rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* ========== 验证码发送按钮 ========== */
.register-send-code {
  position: absolute;
  right: 20rpx;
  color: #ffffff;
  font-size: 24rpx;
  padding: 8rpx 12rpx;
  border: 1px solid #00c851;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #00c851 0%, #00a843 100%);
  min-width: 120rpx;
  text-align: center;
  
  &.disabled {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.6);
  }
}

/* ========== 注册按钮 ========== */
.register-btn {
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
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
  
  &:active {
    transform: translateY(4rpx);
    
    &::before {
      left: 100%;
    }
  }
}

.register-submit-btn {
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  box-shadow: 
    0 8rpx 32rpx rgba(236, 72, 153, 0.3),
    0 2rpx 8rpx rgba(236, 72, 153, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  
  &:active {
    box-shadow: 
      0 4rpx 16rpx rgba(236, 72, 153, 0.4),
      0 1rpx 4rpx rgba(236, 72, 153, 0.3);
  }
}

/* ========== 登录链接 ========== */
.register-login-link {
  text-align: center;
  margin-top: 20rpx;
  
  text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 26rpx;
    text-decoration: underline;
    
    &:active {
      color: #ffffff;
    }
  }
}
</style>