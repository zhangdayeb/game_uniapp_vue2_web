<template>
  <!-- 充值信息查看页面 -->
  <view class="deposit-page">
    
    <!-- 顶部导航栏 -->
    <view class="deposit-header">
      <!-- 返回按钮 -->
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      
      <!-- 标题 -->
      <view class="header-title">
        <text>充值信息</text>
        <text class="title-en">DEPOSIT INFO</text>
      </view>
      
      <!-- 占位符 -->
      <view class="header-placeholder"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="deposit-content">
      
      <!-- 充值说明卡片 -->
      <view class="deposit-notice-card">
        <view class="notice-header">
          <text class="notice-icon">📋</text>
          <text class="notice-title">充值说明</text>
        </view>
        <view class="notice-content">
          <text class="notice-item">• 请选择下方任一方式进行充值</text>
          <text class="notice-item">• 充值后请联系客服确认到账</text>
          <text class="notice-item">• 充值金额将在1-3个工作日内到账</text>
          <text class="notice-item">• 如有疑问请及时联系在线客服</text>
        </view>
        <view class="contact-service" @click="contactService">
          <text class="service-icon">💬</text>
          <text class="service-text">联系客服</text>
        </view>
      </view>

      <!-- 充值方式列表 -->
      <view class="deposit-methods">
        
        <!-- ABA银行充值 -->
        <view class="method-card">
          <view class="card-header">
            <view class="method-icon-wrapper aba-color">
              <text class="method-icon">🏦</text>
            </view>
            <view class="method-title">
              <text class="method-name">ABA银行转账</text>
              <text class="method-desc">柬埔寨亚洲银行</text>
            </view>
            <view class="copy-all-btn" @click="copyAllInfo('aba')">
              <text class="copy-icon">📋</text>
              <text class="copy-text">全部复制</text>
            </view>
          </view>
          
          <view class="card-content">
            <view class="info-item">
              <text class="info-label">银行名称：</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ abaInfo.bankName }}</text>
                <text class="copy-btn" @click="copyText(abaInfo.bankName)">复制</text>
              </view>
            </view>
            
            <view class="info-item">
              <text class="info-label">账户名称：</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ abaInfo.accountName }}</text>
                <text class="copy-btn" @click="copyText(abaInfo.accountName)">复制</text>
              </view>
            </view>
            
            <view class="info-item">
              <text class="info-label">账号：</text>
              <view class="info-value-wrapper">
                <text class="info-value account-number">{{ abaInfo.accountNumber }}</text>
                <text class="copy-btn" @click="copyText(abaInfo.accountNumber)">复制</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 汇旺充值 -->
        <view class="method-card">
          <view class="card-header">
            <view class="method-icon-wrapper huiwang-color">
              <text class="method-icon">⚡</text>
            </view>
            <view class="method-title">
              <text class="method-name">汇旺转账</text>
              <text class="method-desc">快速到账</text>
            </view>
            <view class="copy-all-btn" @click="copyAllInfo('huiwang')">
              <text class="copy-icon">📋</text>
              <text class="copy-text">全部复制</text>
            </view>
          </view>
          
          <view class="card-content">
            <view class="info-item">
              <text class="info-label">收款人：</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ huiwangInfo.receiverName }}</text>
                <text class="copy-btn" @click="copyText(huiwangInfo.receiverName)">复制</text>
              </view>
            </view>
            
            <view class="info-item">
              <text class="info-label">手机号：</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ huiwangInfo.phoneNumber }}</text>
                <text class="copy-btn" @click="copyText(huiwangInfo.phoneNumber)">复制</text>
              </view>
            </view>
            
            <view class="info-item">
              <text class="info-label">汇旺号：</text>
              <view class="info-value-wrapper">
                <text class="info-value account-number">{{ huiwangInfo.huiwangNumber }}</text>
                <text class="copy-btn" @click="copyText(huiwangInfo.huiwangNumber)">复制</text>
              </view>
            </view>
          </view>
        </view>

        <!-- USDT充值 -->
        <view class="method-card">
          <view class="card-header">
            <view class="method-icon-wrapper usdt-color">
              <text class="method-icon">₿</text>
            </view>
            <view class="method-title">
              <text class="method-name">USDT转账</text>
              <text class="method-desc">数字货币钱包</text>
            </view>
            <view class="copy-all-btn" @click="copyAllInfo('usdt')">
              <text class="copy-icon">📋</text>
              <text class="copy-text">全部复制</text>
            </view>
          </view>
          
          <view class="card-content">
            <view class="info-item">
              <text class="info-label">网络类型：</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ usdtInfo.network }}</text>
                <text class="copy-btn" @click="copyText(usdtInfo.network)">复制</text>
              </view>
            </view>
            
            <view class="info-item">
              <text class="info-label">钱包地址：</text>
              <view class="info-value-wrapper">
                <text class="info-value wallet-address">{{ usdtInfo.walletAddress }}</text>
                <text class="copy-btn" @click="copyText(usdtInfo.walletAddress)">复制</text>
              </view>
            </view>
            
            <view class="info-item warning-item">
              <text class="warning-icon">⚠️</text>
              <text class="warning-text">请确保使用正确的网络类型转账，否则资产将无法找回！</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 充值流程说明 -->
      <view class="process-guide">
        <view class="guide-header">
          <text class="guide-icon">📝</text>
          <text class="guide-title">充值流程</text>
        </view>
        <view class="guide-steps">
          <view class="step-item">
            <view class="step-number">1</view>
            <text class="step-text">选择上方任一充值方式</text>
          </view>
          <view class="step-item">
            <view class="step-number">2</view>
            <text class="step-text">复制对应的账户信息</text>
          </view>
          <view class="step-item">
            <view class="step-number">3</view>
            <text class="step-text">通过相应平台完成转账</text>
          </view>
          <view class="step-item">
            <view class="step-number">4</view>
            <text class="step-text">联系客服确认到账</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部客服按钮 -->
    <view class="deposit-footer">
      <view class="service-btn" @click="contactService">
        <text class="btn-text">💬 联系客服确认充值</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DepositInfoPage',
  
  data() {
    return {
      // ABA银行信息
      abaInfo: {
        bankName: '柬埔寨亚洲银行 (ABA)',
        accountName: 'GOLDEN HORSE CASINO',
        accountNumber: '001234567890'
      },
      
      // 汇旺信息
      huiwangInfo: {
        receiverName: 'GOLDEN HORSE',
        phoneNumber: '+855 12 345 678',
        huiwangNumber: 'HW88888888'
      },
      
      // USDT信息
      usdtInfo: {
        network: 'TRC20 (TRON)',
        walletAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
      }
    }
  },
  
  methods: {
    /**
     * 返回上一页
     */
    goBack() {
      uni.navigateBack()
    },
    
    /**
     * 复制文本到剪贴板
     */
    copyText(text) {
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1500
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'error'
          })
        }
      })
    },
    
    /**
     * 复制所有信息
     */
    copyAllInfo(type) {
      let copyText = ''
      
      switch(type) {
        case 'aba':
          copyText = `ABA银行充值信息：
银行名称：${this.abaInfo.bankName}
账户名称：${this.abaInfo.accountName}
账号：${this.abaInfo.accountNumber}`
          break
          
        case 'huiwang':
          copyText = `汇旺充值信息：
收款人：${this.huiwangInfo.receiverName}
手机号：${this.huiwangInfo.phoneNumber}
汇旺号：${this.huiwangInfo.huiwangNumber}`
          break
          
        case 'usdt':
          copyText = `USDT充值信息：
网络类型：${this.usdtInfo.network}
钱包地址：${this.usdtInfo.walletAddress}`
          break
      }
      
      this.copyText(copyText)
    },
    
    /**
     * 联系客服
     */
    contactService() {
      uni.showActionSheet({
        itemList: ['在线客服', 'Telegram', '取消'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 跳转到在线客服
            uni.navigateTo({
              url: '/pages/service/online'
            })
          } else if (res.tapIndex === 1) {
            // 打开Telegram
            uni.showToast({
              title: '正在打开Telegram...',
              icon: 'none'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 页面主体样式 ========== */
.deposit-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

/* ========== 顶部导航栏 ========== */
.deposit-header {
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
.deposit-content {
  padding: 0 40rpx 200rpx;
}

/* ========== 充值说明卡片 ========== */
.deposit-notice-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(59, 130, 246, 0.2);
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  
  .notice-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }
  
  .notice-title {
    color: #3b82f6;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 30rpx;
}

.notice-item {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  line-height: 1.5;
}

.contact-service {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 16rpx;
  padding: 20rpx;
  
  .service-icon {
    font-size: 24rpx;
    margin-right: 12rpx;
  }
  
  .service-text {
    color: #ffffff;
    font-size: 26rpx;
    font-weight: 600;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

/* ========== 充值方式卡片 ========== */
.deposit-methods {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.method-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.method-icon-wrapper {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  
  .method-icon {
    font-size: 32rpx;
  }
  
  &.aba-color {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  }
  
  &.huiwang-color {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  &.usdt-color {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

.method-title {
  flex: 1;
  
  .method-name {
    display: block;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 6rpx;
  }
  
  .method-desc {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 22rpx;
  }
}

.copy-all-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 16rpx;
  padding: 12rpx 20rpx;
  
  .copy-icon {
    font-size: 20rpx;
    margin-right: 8rpx;
  }
  
  .copy-text {
    color: #333333;
    font-size: 22rpx;
    font-weight: 600;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.card-content {
  padding: 40rpx;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &.warning-item {
    background: rgba(255, 107, 107, 0.1);
    border-radius: 12rpx;
    padding: 20rpx;
    border: 1rpx solid rgba(255, 107, 107, 0.3);
    
    .warning-icon {
      font-size: 24rpx;
      margin-right: 12rpx;
    }
    
    .warning-text {
      flex: 1;
      color: #ff6b6b;
      font-size: 22rpx;
      line-height: 1.4;
    }
  }
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 24rpx;
  min-width: 160rpx;
}

.info-value-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-value {
  color: #ffffff;
  font-size: 26rpx;
  flex: 1;
  margin-right: 20rpx;
  
  &.account-number, &.wallet-address {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    letter-spacing: 1rpx;
  }
}

.copy-btn {
  color: #ffd700;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12rpx;
  border: 1rpx solid rgba(255, 215, 0, 0.3);
  
  &:active {
    background: rgba(255, 215, 0, 0.2);
  }
}

/* ========== 充值流程指南 ========== */
.process-guide {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
}

.guide-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  .guide-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }
  
  .guide-title {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.step-item {
  display: flex;
  align-items: center;
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 24rpx;
  font-weight: 600;
  margin-right: 24rpx;
}

.step-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  flex: 1;
}

/* ========== 底部客服按钮 ========== */
.deposit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx;
  background: linear-gradient(to top, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.8) 100%);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.service-btn {
  height: 88rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 32rpx rgba(16, 185, 129, 0.3);
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.4);
  }
  
  .btn-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
  }
}
</style>