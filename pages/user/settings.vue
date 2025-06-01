<template>
  <!-- 账户管理页面 -->
  <view class="settings-page">
    
    <!-- 顶部导航栏 -->
    <view class="settings-header">
      <!-- 返回按钮 -->
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      
      <!-- 标题 -->
      <view class="header-title">
        <text>账户管理</text>
        <text class="title-en">ACCOUNT SETTINGS</text>
      </view>
      
      <!-- 占位符 -->
      <view class="header-placeholder"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="settings-content">
      
      <!-- 用户信息概览 -->
      <view class="user-summary">
        <view class="summary-info">
          <text class="summary-label">当前账户</text>
          <text class="summary-value">{{ user_name }}</text>
        </view>
        <view class="summary-icon">👤</view>
      </view>

      <!-- 设置选项列表 -->
      <view class="settings-list">
        
        <!-- 个人账号设定 -->
<!--        <view class="setting-item" @click="goToAccountSettings">
          <view class="item-left">
            <view class="item-icon account-icon">👤</view>
            <view class="item-info">
              <text class="item-title">个人账号设定</text>
              <text class="item-desc">修改个人信息、密码等</text>
            </view>
          </view>
          <view class="item-right">
            <text class="arrow-icon">›</text>
          </view>
        </view> -->

        <!-- 安全设定 -->
<!--        <view class="setting-item" @click="goToSecuritySettings">
          <view class="item-left">
            <view class="item-icon security-icon">🔒</view>
            <view class="item-info">
              <text class="item-title">安全设定</text>
              <text class="item-desc">密码保护、登录验证等</text>
            </view>
          </view>
          <view class="item-right">
            <text class="arrow-icon">›</text>
          </view>
        </view> -->

        <!-- APP信任设置 -->
        <view class="setting-item" @click="showAppTrustGuide">
          <view class="item-left">
            <view class="item-icon app-icon">📱</view>
            <view class="item-info">
              <text class="item-title">APP信任设置</text>
              <text class="item-desc">解决iOS设备信任问题</text>
            </view>
          </view>
          <view class="item-right">
            <text class="arrow-icon">›</text>
          </view>
        </view>

        <!-- 退出登录 -->
        <view class="setting-item logout-item" @click="confirmLogout">
          <view class="item-left">
            <view class="item-icon logout-icon">🚪</view>
            <view class="item-info">
              <text class="item-title">退出登录</text>
              <text class="item-desc">安全退出当前账户</text>
            </view>
          </view>
          <view class="item-right">
            <text class="arrow-icon">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- APP信任设置指南弹窗 -->
    <view class="trust-modal" v-if="showTrustModal" @click="hideTrustModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">📱 APP信任设置指南</text>
          <text class="modal-close" @click="hideTrustModal">✕</text>
        </view>
        
        <view class="guide-content">
         <view class="guide-step">
            <view class="step-number">1</view>
            <text class="step-text">打开 iOS 设置 → 通用</text>
          </view>
          
          <view class="guide-step">
            <view class="step-number">2</view>
            <text class="step-text">找到"VPN与设备管理"或"描述文件与设备管理"</text>
          </view>
          
          <view class="guide-step">
            <view class="step-number">3</view>
            <text class="step-text">在"企业级应用"中找到开发者证书</text>
          </view>
          
          <view class="guide-step">
            <view class="step-number">4</view>
            <text class="step-text">点击"信任"按钮完成设置</text>
          </view>
          
          <view class="guide-note">
            <text class="note-icon">⚠️</text>
            <text class="note-text">如果没有找到相关选项，请重新下载安装APP后再次尝试</text>
          </view>
        </view>
        
        <view class="modal-footer">
          <view class="footer-btn" @click="hideTrustModal">
            <text class="btn-text">我知道了</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import user from "@/api/api"

export default {
  name: 'UserSettingsPage',
  
  data() {
    return {
      user_name: '',
      showTrustModal: false,
      //用户登录信息
      loginUserInfo: uni.getStorageSync('login_user_info'),
    }
  },
  
  mounted() {
    this.getUserinfo()
  },
  
  methods: {
    /**
     * 返回上一页
     */
    goBack() {
      uni.navigateBack()
    },
    
    /**
     * 获取用户信息
     */
    getUserinfo() {
      user.getUserInfo().then((res) => {
        if (res.data.code == 200) {
          this.user_name = res.data.data.user_name
        }
      })
    },
    
    /**
     * 跳转到个人账号设定
     */
    goToAccountSettings() {
      // 这里可以展开为子页面或者直接在当前页面展示表单
      uni.showToast({
        title: '个人账号设定功能开发中',
        icon: 'none'
      })
    },
    
    /**
     * 跳转到安全设定
     */
    goToSecuritySettings() {
      // 这里可以展开为子页面或者直接在当前页面展示表单
      uni.showToast({
        title: '安全设定功能开发中',
        icon: 'none'
      })
    },
    
    /**
     * 显示APP信任设置指南
     */
    showAppTrustGuide() {
      this.showTrustModal = true
    },
    
    /**
     * 隐藏APP信任设置指南
     */
    hideTrustModal() {
      this.showTrustModal = false
    },
    
    /**
     * 确认退出登录
     */
    confirmLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出当前账户吗？',
        confirmText: '确认退出',
        cancelText: '取消',
        confirmColor: '#ef4444',
        success: (res) => {
          if (res.confirm) {
            this.logout()
          }
        }
      })
    },
    
    /**
     * 退出登录
     */
    logout() {
      uni.removeStorageSync('login_user_info')
      uni.removeStorageSync('Access-Token')
      uni.showToast({
        title: '已安全退出',
        icon: 'success'
      })
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 页面主体样式 ========== */
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

/* ========== 顶部导航栏 ========== */
.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 120rpx;
  padding: 0 40rpx;
  padding-top: var(--status-bar-height);
  position: relative;
  z-index: 10;
}

.header-back {
  .back-text {
    color: #ffffff;
    font-size: 28rpx;
    padding: 16rpx 24rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    
    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.header-title {
  flex: 1;
  text-align: center;
  
  text {
    display: block;
    color: #ffffff;
    
    &:first-child {
      font-size: 36rpx;
      font-weight: 600;
      margin-bottom: 4rpx;
    }
    
    &.title-en {
      font-size: 20rpx;
      opacity: 0.7;
      letter-spacing: 2rpx;
    }
  }
}

.header-placeholder {
  width: 60rpx;
}

/* ========== 主要内容区域 ========== */
.settings-content {
  padding: 0 40rpx 40rpx;
}

/* ========== 用户信息概览 ========== */
.user-summary {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(139, 92, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-info {
  flex: 1;
  
  .summary-label {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
    margin-bottom: 12rpx;
  }
  
  .summary-value {
    display: block;
    color: #ffffff;
    font-size: 36rpx;
    font-weight: 600;
  }
}

.summary-icon {
  font-size: 60rpx;
  opacity: 0.8;
}

/* ========== 设置选项列表 ========== */
.settings-list {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &.logout-item {
    &:active {
      background: rgba(239, 68, 68, 0.1);
    }
  }
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-right: 24rpx;
  
  &.account-icon {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  }
  
  &.security-icon {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  &.app-icon {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  &.logout-icon {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
}

.item-info {
  flex: 1;
  
  .item-title {
    display: block;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
  }
  
  .item-desc {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 22rpx;
  }
}

.item-right {
  .arrow-icon {
    color: rgba(255, 255, 255, 0.4);
    font-size: 32rpx;
    font-weight: 300;
  }
}

/* ========== APP信任设置指南弹窗 ========== */
.trust-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.modal-content {
  width: 100%;
  max-width: 600rpx;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24rpx;
  overflow: hidden;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  
  .modal-title {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
  }
  
  .modal-close {
    color: rgba(255, 255, 255, 0.6);
    font-size: 32rpx;
    padding: 10rpx;
  }
}

.guide-content {
  padding: 40rpx;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.step-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  line-height: 1.5;
  flex: 1;
  margin-top: 8rpx;
}

.guide-note {
  display: flex;
  align-items: flex-start;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 30rpx;
  border: 1rpx solid rgba(245, 158, 11, 0.3);
  
  .note-icon {
    font-size: 24rpx;
    margin-right: 12rpx;
    margin-top: 2rpx;
  }
  
  .note-text {
    color: #f59e0b;
    font-size: 22rpx;
    line-height: 1.4;
    flex: 1;
  }
}

.modal-footer {
  padding: 40rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.footer-btn {
  height: 80rpx;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn-text {
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
  }
  
  &:active {
    transform: scale(0.98);
  }
}
</style>