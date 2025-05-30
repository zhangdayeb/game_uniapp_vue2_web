<template>
  <view class="deposit-page">
    
    <!-- 顶部导航栏 -->
    <view class="deposit-header">
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      <view class="header-title">
        <text>充值信息</text>
        <text class="title-en">DEPOSIT INFO</text>
      </view>
      <view class="header-placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在加载充值信息...</text>
    </view>

    <!-- 错误提示 -->
    <view v-else-if="errorMessage" class="error-container">
      <view class="error-icon">⚠️</view>
      <text class="error-text">{{ errorMessage }}</text>
      <view class="retry-btn" @click="loadData">
        <text>重新加载</text>
      </view>
    </view>

    <!-- 主要内容 -->
    <view v-else class="deposit-content">
      
      <!-- 充值说明 -->
      <view class="notice-card">
        <view class="notice-header">
          <text class="notice-icon">📋</text>
          <text class="notice-title">充值说明</text>
        </view>
        <view class="notice-content">
          <text class="notice-item">• 请选择下方任一方式进行充值</text>
          <text class="notice-item">• 充值后请联系客服确认到账</text>
          <text class="notice-item">• 如有疑问请及时联系在线客服</text>
        </view>
      </view>

      <!-- 充值方式列表 -->
      <view class="methods-list">
        <view 
          class="method-card" 
          v-for="method in depositMethods" 
          :key="method.id"
        >
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="method-icon-wrapper" :class="getMethodColorClass(method.method_code)">
              <text class="method-icon">{{ method.icon }}</text>
            </view>
            <view class="method-info">
              <text class="method-name">{{ method.method_name }}</text>
              <text class="method-desc">{{ method.method_desc }}</text>
            </view>
            <view class="copy-all-btn" @click="copyAllMethod(method)">
              <text class="copy-icon">📋</text>
              <text class="copy-text">全部复制</text>
            </view>
          </view>
          
          <!-- 账户列表 -->
          <view class="accounts-section">
            <view 
              class="account-item" 
              v-for="(account, index) in method.accounts" 
              :key="account.id"
            >
              
              <!-- ABA银行账户 -->
              <template v-if="method.method_code === 'aba'">
                <view class="info-row">
                  <text class="label">银行名称：</text>
                  <text class="value">{{ account.bank_name }}</text>
                  <text class="copy-btn" @click="copyText(account.bank_name)">复制</text>
                </view>
                <view class="info-row">
                  <text class="label">账户名称：</text>
                  <text class="value">{{ account.account_name }}</text>
                  <text class="copy-btn" @click="copyText(account.account_name)">复制</text>
                </view>
                <view class="info-row">
                  <text class="label">账号：</text>
                  <text class="value number">{{ account.account_number }}</text>
                  <text class="copy-btn" @click="copyText(account.account_number)">复制</text>
                </view>
              </template>

              <!-- 汇旺账户 -->
              <template v-else-if="method.method_code === 'huiwang'">
                <view class="info-row">
                  <text class="label">收款人：</text>
                  <text class="value">{{ account.account_name }}</text>
                  <text class="copy-btn" @click="copyText(account.account_name)">复制</text>
                </view>
                <view class="info-row">
                  <text class="label">手机号：</text>
                  <text class="value">{{ account.phone_number }}</text>
                  <text class="copy-btn" @click="copyText(account.phone_number)">复制</text>
                </view>
                <view class="info-row">
                  <text class="label">汇旺号：</text>
                  <text class="value number">{{ account.account_number }}</text>
                  <text class="copy-btn" @click="copyText(account.account_number)">复制</text>
                </view>
              </template>

              <!-- USDT钱包 -->
              <template v-else-if="method.method_code === 'usdt'">
                <view class="info-row">
                  <text class="label">网络类型：</text>
                  <text class="value">{{ account.network_type }}</text>
                  <text class="copy-btn" @click="copyText(account.network_type)">复制</text>
                </view>
                <view class="info-row">
                  <text class="label">钱包地址：</text>
                  <text class="value wallet-addr">{{ account.wallet_address }}</text>
                  <text class="copy-btn" @click="copyText(account.wallet_address)">复制</text>
                </view>
                <view class="warning-row">
                  <text class="warning-icon">⚠️</text>
                  <text class="warning-text">请确保使用正确的网络类型转账，否则资产将无法找回！</text>
                </view>
              </template>

              <!-- 账户备注信息 -->
              <view v-if="account.remark" class="remark-row">
                <text class="remark-icon">💡</text>
                <text class="remark-text">{{ account.remark }}</text>
              </view>

              <!-- 账户分隔线 -->
              <view v-if="method.accounts.length > 1 && index < method.accounts.length - 1" class="divider"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 充值流程 -->
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
    <view v-if="!loading && !errorMessage" class="footer-section">
      <view class="contact-btn" @click="contactService">
        <text class="btn-icon">💬</text>
        <text class="btn-text">联系客服确认充值</text>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/api/api"

export default {
  data() {
    return {
      loading: true,
      errorMessage: '',
      depositMethods: [],
      // 客服信息
      customerServiceInfo: {
        onlineServiceUrl: '',
        telegramUrl: ''
      }
    }
  },

  onLoad() {
    this.loadData()
    this.loadCustomerService()
  },

  methods: {
    async loadData() {
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await api.getUserDepositInfo({})
        let data = response
        
        // 处理响应数据格式
        if (response && response.data) {
          data = response.data
        }
        
        if (typeof data === 'string') {
          data = JSON.parse(data)
        }
        
        // 处理双层嵌套
        if (data && data.code === 200) {
          let actualData = data.data
          
          if (actualData && actualData.code === 200) {
            actualData = actualData.data
          }
          
          if (actualData && actualData.deposit_methods) {
            this.depositMethods = actualData.deposit_methods
            
            if (this.depositMethods.length === 0) {
              this.errorMessage = '暂无可用的充值方式'
            }
          } else {
            this.errorMessage = '数据格式错误'
          }
        } else {
          this.errorMessage = data?.message || '获取数据失败'
        }
        
      } catch (error) {
        this.errorMessage = '网络请求失败，请稍后重试'
        console.error('请求异常:', error)
      } finally {
        this.loading = false
      }
    },

    getMethodColorClass(methodCode) {
      const colorMap = {
        'aba': 'aba-color',
        'huiwang': 'huiwang-color', 
        'usdt': 'usdt-color'
      }
      return colorMap[methodCode] || 'default-color'
    },

    goBack() {
      uni.navigateBack()
    },

    copyText(text) {
      if (!text) return
      
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

    copyAllMethod(method) {
      if (!method.accounts || method.accounts.length === 0) {
        uni.showToast({ title: '暂无可复制内容', icon: 'none' })
        return
      }

      let text = `${method.method_name}充值信息：\n\n`
      
      method.accounts.forEach((account, index) => {
        if (index > 0) text += '\n'
        
        if (method.method_code === 'aba') {
          text += `银行名称：${account.bank_name}\n账户名称：${account.account_name}\n账号：${account.account_number}`
        } else if (method.method_code === 'huiwang') {
          text += `收款人：${account.account_name}\n手机号：${account.phone_number}\n汇旺号：${account.account_number}`
        } else if (method.method_code === 'usdt') {
          text += `网络类型：${account.network_type}\n钱包地址：${account.wallet_address}`
        }
        
        if (account.remark) {
          text += `\n备注：${account.remark}`
        }
      })
      
      this.copyText(text)
    },

    async loadCustomerService() {
      try {
        // 调用获取客服信息的接口
        const response = await api.getUserWhat({})
        
        if (response && response.data && response.data.code === 200) {
          const data = response.data.data
          this.customerServiceInfo = {
            onlineServiceUrl: data.appKeFuUrl || '',
            telegramUrl: data.appFeiJiUrl || ''
          }
          console.log('客服信息获取成功:', this.customerServiceInfo)
        }
      } catch (error) {
        console.error('获取客服信息失败:', error)
        // 使用默认值或者显示提示
        this.customerServiceInfo = {
          onlineServiceUrl: '',
          telegramUrl: ''
        }
      }
    },

    contactService() {
      const hasOnlineService = !!this.customerServiceInfo.onlineServiceUrl
      const hasTelegram = !!this.customerServiceInfo.telegramUrl
      
      if (!hasOnlineService && !hasTelegram) {
        uni.showToast({
          title: '客服信息加载中，请稍后重试',
          icon: 'none'
        })
        return
      }
      
      // 动态构建选项列表
      const itemList = []
      const actionMap = {}
      
      if (hasOnlineService) {
        itemList.push('在线客服')
        actionMap['在线客服'] = () => this.openOnlineService()
      }
      
      if (hasTelegram) {
        itemList.push('Telegram')
        actionMap['Telegram'] = () => this.openTelegram()
      }
      
      uni.showActionSheet({
        itemList: itemList,
        success: (res) => {
          const selectedItem = itemList[res.tapIndex]
          if (actionMap[selectedItem]) {
            actionMap[selectedItem]()
          }
        }
      })
    },

    openOnlineService() {
      const serviceUrl = this.customerServiceInfo.onlineServiceUrl
      
      if (!serviceUrl) {
        uni.showToast({
          title: '在线客服暂不可用',
          icon: 'none'
        })
        return
      }
      
      //#ifdef H5
      // H5平台直接打开新窗口
      window.open(serviceUrl, '_blank')
      //#endif
      
      //#ifndef H5
      // 非H5平台的处理
      uni.showModal({
        title: '打开客服',
        content: '即将打开在线客服，是否继续？',
        success: (res) => {
          if (res.confirm) {
            // App平台可以使用 plus.runtime.openURL
            //#ifdef APP-PLUS
            plus.runtime.openURL(serviceUrl)
            //#endif
            
            // 小程序平台复制链接到剪贴板
            //#ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
            uni.setClipboardData({
              data: serviceUrl,
              success: () => {
                uni.showToast({
                  title: '客服链接已复制',
                  icon: 'success'
                })
              }
            })
            //#endif
          }
        }
      })
      //#endif
    },

    openTelegram() {
      const telegramUrl = this.customerServiceInfo.telegramUrl
      
      if (!telegramUrl) {
        uni.showToast({
          title: 'Telegram客服暂不可用',
          icon: 'none'
        })
        return
      }
      
      //#ifdef H5
      // H5平台直接打开新窗口
      window.open(telegramUrl, '_blank')
      //#endif
      
      //#ifndef H5
      // 非H5平台的处理
      uni.showModal({
        title: '打开Telegram',
        content: '即将打开Telegram客服，是否继续？',
        success: (res) => {
          if (res.confirm) {
            // App平台可以使用 plus.runtime.openURL
            //#ifdef APP-PLUS
            plus.runtime.openURL(telegramUrl)
            //#endif
            
            // 小程序平台复制链接到剪贴板
            //#ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
            uni.setClipboardData({
              data: telegramUrl,
              success: () => {
                uni.showToast({
                  title: 'Telegram链接已复制',
                  icon: 'success'
                })
              }
            })
            //#endif
          }
        }
      })
      //#endif
    },
  }
}
</script>

<style lang="scss" scoped>
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

.header-back .back-text {
  color: #ffffff;
  font-size: 28rpx;
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0.95);
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

.header-placeholder { width: 60rpx; }

/* ========== 加载和错误状态 ========== */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top: 4rpx solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 30rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  padding: 40rpx;
}

.error-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.error-text {
  color: #ff6b6b;
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.retry-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 20rpx 40rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

/* ========== 主要内容 ========== */
.deposit-content {
  padding: 0 40rpx 200rpx;
}

/* ========== 充值说明卡片 ========== */
.notice-card {
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
}

.notice-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.notice-title {
  color: #3b82f6;
  font-size: 32rpx;
  font-weight: 600;
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.notice-item {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  line-height: 1.5;
}

/* ========== 充值方式卡片 ========== */
.methods-list {
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
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(-2rpx);
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  }
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
  
  &.default-color {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }
}

.method-info {
  flex: 1;
}

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

.copy-all-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 16rpx;
  padding: 12rpx 20rpx;
  transition: all 0.3s ease;
  
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

/* ========== 账户信息 ========== */
.accounts-section {
  padding: 40rpx;
}

.account-item {
  margin-bottom: 40rpx;
  &:last-child { margin-bottom: 0; }
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  &:last-child { margin-bottom: 0; }
}

.label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 24rpx;
  min-width: 160rpx;
}

.value {
  flex: 1;
  color: #ffffff;
  font-size: 26rpx;
  margin-right: 20rpx;
  word-break: break-all;
  
  &.number {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    letter-spacing: 1rpx;
  }
  
  &.wallet-addr {
    font-family: 'Courier New', monospace;
    font-size: 22rpx;
    font-weight: 600;
    letter-spacing: 1rpx;
    line-height: 1.4;
  }
}

.copy-btn {
  color: #ffd700;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12rpx;
  border: 1rpx solid rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    background: rgba(255, 215, 0, 0.2);
    transform: scale(0.95);
  }
}

.warning-row {
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(255, 107, 107, 0.3);
  margin-top: 20rpx;
  display: flex;
  align-items: center;
}

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

.remark-row {
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(255, 215, 0, 0.3);
  margin-top: 20rpx;
  display: flex;
  align-items: center;
}

.remark-icon {
  font-size: 24rpx;
  margin-right: 12rpx;
}

.remark-text {
  flex: 1;
  color: #ffd700;
  font-size: 22rpx;
  line-height: 1.4;
}

.divider {
  height: 2rpx;
  background: rgba(255, 255, 255, 0.1);
  margin: 30rpx 0;
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
}

.guide-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.guide-title {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
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
.footer-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx;
  background: linear-gradient(to top, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.8) 100%);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.contact-btn {
  height: 88rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 32rpx rgba(16, 185, 129, 0.3);
  
  .btn-icon {
    font-size: 28rpx;
    margin-right: 12rpx;
  }
  
  .btn-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
  }
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.4);
  }
}
</style>