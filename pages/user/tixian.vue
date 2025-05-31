/**
     * 处理提现请求
     */
    processWithdrawal() {
      uni.showLoading({
        title: '提交中...'
      })
      
      // ============================================
      // 🎯 申请提现发给后端的数据结构
      // ============================================
      const withdrawalData = {
        amount: this.withdrawAmount,              // 提现金额
        account_id: this.selectedAccountId,      // 选择的账户ID
        account_type: this.selectedAccount.account_type, // 账户类型: aba/huiwang/usdt
        fee_amount: this.feeAmount,              // 手续费金额
        actual_amount: this.actualAmount,        // 实际到账金额
        fee_rate: this.feeRate,                  // 手续费率
        // 可选字段
        remark: '用户申请提现',                   // 备注信息
        client_ip: '',                           // 客户端IP（可由后端获取）
        device_info: '',                         // 设备信息（可选）
        timestamp: Date.now()                    // 时间戳
      }
      
      console.log('提现申请数据:', withdrawalData)
      
      // TODO: 调用真实的提现申请接口
      // const response = await submitWithdrawalRequest(withdrawalData)
      
      // 模拟API请求
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '提现申请已提交',
          icon: 'success'
        })
        
        // 重置表单
        this.withdrawAmount = ''
        this.selectedAccountId = ''
        this.selectedAccount = null
        
        // 可以跳转到提现记录页面
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/withdrawal<template>
  <!-- 提现申请页面 -->
  <view class="withdrawal-page">
    
    <!-- 顶部导航栏 -->
    <view class="withdrawal-header">
      <!-- 返回按钮 -->
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      
      <!-- 标题 -->
      <view class="header-title">
        <text>提现申请</text>
        <text class="title-en">WITHDRAWAL</text>
      </view>
      
      <!-- 占位符 -->
      <view class="header-placeholder"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="withdrawal-content">
      
      <!-- 余额显示卡片 -->
      <view class="balance-card">
        <view class="balance-info">
          <view class="balance-label">可提现余额</view>
          <view class="balance-amount">
            <text class="currency">$</text>
            <text class="amount">{{ userBalance }}</text>
          </view>
        </view>
        <view class="balance-icon">💰</view>
      </view>

      <!-- 提现表单 -->
      <view class="withdrawal-form">
        
        <!-- 提现金额输入 -->
        <view class="form-section">
          <view class="section-title">
            <text class="title-icon">💸</text>
            <text>提现金额</text>
          </view>
          <view class="amount-input-box">
            <view class="input-wrapper">
              <text class="currency-symbol">$</text>
              <input 
                class="amount-input" 
                type="number" 
                v-model="withdrawAmount" 
                placeholder="请输入提现金额"
                @input="validateAmount"
              />
            </view>
            <view class="quick-amounts">
              <view 
                class="quick-btn" 
                v-for="amount in quickAmounts" 
                :key="amount"
                @click="setQuickAmount(amount)"
              >
                {{ amount }}
              </view>
              <view class="quick-btn all-btn" @click="setAllAmount">
                全部
              </view>
            </view>
          </view>
        </view>

        <!-- 选择提现账户 -->
        <view class="form-section">
          <view class="section-title">
            <text class="title-icon">🏦</text>
            <text>选择提现账户</text>
          </view>
          
          <!-- 加载状态 -->
          <view class="loading-accounts" v-if="accountsLoading">
            <text class="loading-text">加载账户中...</text>
          </view>
          
          <!-- 无账户提示 -->
          <view class="no-accounts" v-else-if="userAccounts.length === 0">
            <text class="no-accounts-icon">📝</text>
            <text class="no-accounts-text">您还没有绑定提现账户</text>
            <view class="bind-account-btn" @click="goToBindAccount">
              <text class="bind-text">立即绑定</text>
            </view>
          </view>
          
          <!-- 账户列表 -->
          <view class="payment-methods" v-else>
            <view 
              class="payment-item" 
              :class="{ active: selectedAccountId === account.id }"
              v-for="account in userAccounts"
              :key="account.id"
              @click="selectAccount(account)"
            >
              <view class="method-content">
                <view class="method-icon" :class="getAccountIconClass(account.account_type)">
                  <text>{{ account.icon }}</text>
                </view>
                <view class="method-info">
                  <view class="account-header">
                    <text class="method-name">{{ account.display_name }}</text>
                    <text class="default-badge" v-if="account.is_default">默认</text>
                  </view>
                  <text class="method-desc">{{ account.description }}</text>
                </view>
              </view>
              <view class="method-check">
                <text class="check-icon">{{ selectedAccountId === account.id ? '✓' : '○' }}</text>
              </view>
            </view>
          </view>
          
          <!-- 账户统计 -->
          <view class="account-stats" v-if="accountStats && !accountsLoading">
            <text class="stats-text">
              共{{ accountStats.total_count }}个账户
              <text v-if="accountStats.aba_count > 0">｜银行{{ accountStats.aba_count }}个</text>
              <text v-if="accountStats.huiwang_count > 0">｜汇旺{{ accountStats.huiwang_count }}个</text>
              <text v-if="accountStats.usdt_count > 0">｜USDT{{ accountStats.usdt_count }}个</text>
            </text>
          </view>
        </view>

        <!-- 手续费说明 -->
        <view class="fee-info">
          <view class="fee-item">
            <text class="fee-label">手续费：</text>
            <text class="fee-amount">${{ feeAmount }}</text>
          </view>
          <view class="fee-item">
            <text class="fee-label">实际到账：</text>
            <text class="actual-amount">${{ actualAmount }}</text>
          </view>
        </view>

        <!-- 提现须知 -->
        <view class="withdrawal-notice">
          <view class="notice-title">
            <text class="notice-icon">ℹ️</text>
            <text>提现须知</text>
          </view>
          <view class="notice-content">
            <text class="notice-item">• 最低提现金额：10$</text>
            <text class="notice-item">• 每日提现次数限制：3次</text>
            <text class="notice-item">• 提现处理时间：1-3个工作日</text>
            <text class="notice-item">• 请确保账户信息准确无误</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提交按钮 -->
    <view class="withdrawal-footer">
      <view 
        class="submit-btn" 
        :class="{ disabled: !canSubmit }"
        @click="submitWithdrawal"
      >
        <text class="btn-text">🚀 立即提现</text>
      </view>
    </view>
  </view>
</template>

<script>
// 导入API接口
import { getUserWithdrawalAccounts, submitWithdrawalRequest, getWithdrawalStats } from '@/api/withdrawalAccount.js'

export default {
  name: 'WithdrawalPage',
  
  data() {
    return {
      // 用户余额
      userBalance: '10001390.00',
      
      // 提现金额
      withdrawAmount: '',
      
      // 用户账户相关
      userAccounts: [],           // 用户绑定的账户列表
      selectedAccountId: '',      // 选择的账户ID
      selectedAccount: null,      // 选择的账户对象
      accountsLoading: false,     // 账户加载状态
      accountStats: null,         // 账户统计信息
      
      // 快速金额选项
      quickAmounts: [100, 500, 1000, 5000],
      
      // 手续费率
      feeRate: 0.02, // 2%
    }
  },
  
  computed: {
    // 手续费金额
    feeAmount() {
      if (!this.withdrawAmount) return '0.00'
      const fee = parseFloat(this.withdrawAmount) * this.feeRate
      return fee.toFixed(2)
    },
    
    // 实际到账金额
    actualAmount() {
      if (!this.withdrawAmount) return '0.00'
      const actual = parseFloat(this.withdrawAmount) - parseFloat(this.feeAmount)
      return Math.max(0, actual).toFixed(2)
    },
    
    // 是否可以提交
    canSubmit() {
      return this.withdrawAmount && 
             this.selectedAccountId && 
             parseFloat(this.withdrawAmount) >= 10 &&
             parseFloat(this.withdrawAmount) <= parseFloat(this.userBalance)
    }
  },
  
  mounted() {
    // 页面加载时获取用户账户列表和统计信息
    this.loadUserAccounts()
    this.loadWithdrawalStats()
  },
  
  methods: {
    /**
     * 加载用户提现账户
     */
    async loadUserAccounts() {
      try {
        this.accountsLoading = true
        
        const response = await getUserWithdrawalAccounts({})
        
        if (response.data.code === 200) {
          this.userAccounts = response.data.data.accounts || []
          this.accountStats = response.data.data.stats || null
          
          // 自动选择默认账户
          const defaultAccount = this.userAccounts.find(account => account.is_default === 1)
          if (defaultAccount) {
            this.selectAccount(defaultAccount)
          }
        } else {
          uni.showToast({
            title: response.data.message || '获取账户失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('获取用户账户失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      } finally {
        this.accountsLoading = false
      }
    },
    
    /**
     * 选择账户
     */
    selectAccount(account) {
      this.selectedAccountId = account.id
      this.selectedAccount = account
    },
    
    /**
     * 跳转到绑定账户页面
     */
    goToBindAccount() {
      uni.navigateTo({
        url: '/pages/user/bankbind'
      })
    },
    
    /**
     * 加载提现统计信息
     */
    async loadWithdrawalStats() {
      try {
        const response = await getWithdrawalStats({})
        
        if (response.data.code === 200) {
          const stats = response.data.data
          // 可以在这里更新页面显示的统计信息
          console.log('提现统计:', stats)
        }
      } catch (error) {
        console.error('获取提现统计失败:', error)
      }
    },
    
    /**
     * 获取账户图标样式
     */
    getAccountIconClass(accountType) {
      const classes = {
        'aba': 'aba-icon',
        'huiwang': 'huiwang-icon', 
        'usdt': 'usdt-icon'
      }
      return classes[accountType] || 'default-icon'
    },
    
    /**
     * 返回上一页
     */
    goBack() {
      uni.navigateBack()
    },
    
    /**
     * 验证提现金额
     */
    validateAmount() {
      // 限制最大金额不超过余额
      if (parseFloat(this.withdrawAmount) > parseFloat(this.userBalance)) {
        this.withdrawAmount = this.userBalance
      }
      
      // 限制最小金额
      if (parseFloat(this.withdrawAmount) < 0) {
        this.withdrawAmount = ''
      }
    },
    
    /**
     * 设置快速金额
     */
    setQuickAmount(amount) {
      this.withdrawAmount = amount.toString()
    },
    
    /**
     * 设置全部金额
     */
    setAllAmount() {
      this.withdrawAmount = this.userBalance
    },
    
    /**
     * 提交提现申请
     */
    submitWithdrawal() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请检查提现信息',
          icon: 'none'
        })
        return
      }
      
      if (!this.selectedAccount) {
        uni.showToast({
          title: '请选择提现账户',
          icon: 'none'
        })
        return
      }
      
      // 显示确认弹窗
      const accountInfo = `${this.selectedAccount.display_name} - ${this.selectedAccount.description}`
      uni.showModal({
        title: '确认提现',
        content: `提现金额：${this.withdrawAmount}$\n手续费：${this.feeAmount}$\n实际到账：${this.actualAmount}$\n提现账户：${accountInfo}`,
        confirmText: '确认提现',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.processWithdrawal()
          }
        }
      })
    },
    
    /**
     * 处理提现请求
     */
    async processWithdrawal() {
      try {
        uni.showLoading({
          title: '提交中...'
        })
        
        // 构建提现数据
        const withdrawalData = {
          amount: this.withdrawAmount,
          account_id: this.selectedAccountId,
          account_type: this.selectedAccount.account_type,
          fee_amount: this.feeAmount,
          actual_amount: this.actualAmount,
          remark: '用户申请提现'
        }
        
        console.log('提现申请数据:', withdrawalData)
        
        // 调用提现申请接口
        const response = await submitWithdrawalRequest(withdrawalData)
        
        uni.hideLoading()
        
        if (response.data.code === 200) {
          const result = response.data.data
          
          // 显示成功信息
          uni.showModal({
            title: '提现申请成功',
            content: `申请金额：${result.amount}\n手续费：${result.fee_amount}\n实际到账：${result.actual_amount}\n\n提现申请已提交，请等待审核`,
            confirmText: '查看记录',
            cancelText: '继续提现',
            success: (res) => {
              if (res.confirm) {
                // 跳转到提现记录页面
                uni.navigateTo({
                  url: '/pages/withdrawal/record'
                })
              } else {
                // 重置表单，继续提现
                this.resetForm()
                // 重新加载账户和统计信息
                this.loadUserAccounts()
                this.loadWithdrawalStats()
              }
            }
          })
          
        } else {
          uni.showToast({
            title: response.data.message || '提现申请失败',
            icon: 'none',
            duration: 3000
          })
        }
        
      } catch (error) {
        uni.hideLoading()
        console.error('提现申请失败:', error)
        
        // 解析错误信息
        let errorMessage = '网络错误，请重试'
        if (error.data && error.data.message) {
          errorMessage = error.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        uni.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        })
      }
    },
    
    /**
     * 重置表单
     */
    resetForm() {
      this.withdrawAmount = ''
      this.selectedAccountId = ''
      this.selectedAccount = null
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 页面主体样式 ========== */
.withdrawal-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

/* ========== 顶部导航栏 ========== */
.withdrawal-header {
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
.withdrawal-content {
  padding: 0 40rpx 200rpx;
}

/* ========== 余额卡片 ========== */
.balance-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance-info {
  flex: 1;
}

.balance-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 28rpx;
  margin-bottom: 16rpx;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  
  .currency {
    color: #ffd700;
    font-size: 32rpx;
    font-weight: 600;
    margin-right: 8rpx;
  }
  
  .amount {
    color: #ffffff;
    font-size: 48rpx;
    font-weight: 700;
    font-family: 'Arial', sans-serif;
  }
}

.balance-icon {
  font-size: 60rpx;
  opacity: 0.8;
}

/* ========== 表单区域 ========== */
.withdrawal-form {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
}

.form-section {
  margin-bottom: 60rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  .title-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }
  
  text:not(.title-icon) {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
  }
}

/* ========== 金额输入 ========== */
.amount-input-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 30rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 0 30rpx;
  height: 88rpx;
  margin-bottom: 30rpx;
}

.currency-symbol {
  color: #ffd700;
  font-size: 36rpx;
  font-weight: 600;
  margin-right: 16rpx;
}

.amount-input {
  flex: 1;
  color: #ffffff;
  font-size: 32rpx;
  background: transparent;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

.quick-amounts {
  display: flex;
  gap: 20rpx;
}

.quick-btn {
  flex: 1;
  height: 60rpx;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
  }
  
  &.all-btn {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #333333;
    font-weight: 600;
  }
}

/* ========== 账户加载和空状态 ========== */
.loading-accounts {
  padding: 60rpx 0;
  text-align: center;
  
  .loading-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 28rpx;
  }
}

.no-accounts {
  padding: 60rpx 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .no-accounts-icon {
    font-size: 60rpx;
    margin-bottom: 20rpx;
    opacity: 0.6;
  }
  
  .no-accounts-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 28rpx;
    margin-bottom: 30rpx;
  }
  
  .bind-account-btn {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-radius: 25rpx;
    padding: 20rpx 40rpx;
    
    .bind-text {
      color: #333333;
      font-size: 26rpx;
      font-weight: 600;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

/* ========== 支付方式选择 ========== */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.payment-item {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  padding: 30rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
    border-color: #ffd700;
    box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.method-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.method-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 24rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  
  &.aba-icon {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  }
  
  &.huiwang-icon {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  &.usdt-icon {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

.method-info {
  display: flex;
  flex-direction: column;
  
  .method-name {
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 6rpx;
  }
  
  .method-desc {
    color: rgba(255, 255, 255, 0.6);
    font-size: 22rpx;
  }
}

.method-check {
  .check-icon {
    font-size: 32rpx;
    color: #ffd700;
    font-weight: bold;
  }
}

/* ========== 账户信息样式 ========== */
.account-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 6rpx;
}

.default-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333333;
  font-size: 18rpx;
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
  font-weight: 600;
}

.account-stats {
  margin-top: 20rpx;
  padding: 16rpx 20rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  
  .stats-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 22rpx;
    line-height: 1.4;
  }
}

/* ========== 手续费信息 ========== */
.fee-info {
  background: rgba(255, 215, 0, 0.1);
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
  margin-bottom: 40rpx;
  border: 1rpx solid rgba(255, 215, 0, 0.3);
}

.fee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .fee-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 26rpx;
  }
  
  .fee-amount {
    color: #ff6b6b;
    font-size: 26rpx;
    font-weight: 600;
  }
  
  .actual-amount {
    color: #4ecdc4;
    font-size: 28rpx;
    font-weight: 600;
  }
}

/* ========== 提现须知 ========== */
.withdrawal-notice {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.3);
}

.notice-title {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  .notice-icon {
    font-size: 24rpx;
    margin-right: 12rpx;
  }
  
  text:not(.notice-icon) {
    color: #3b82f6;
    font-size: 26rpx;
    font-weight: 600;
  }
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.notice-item {
  color: rgba(255, 255, 255, 0.7);
  font-size: 22rpx;
  line-height: 1.5;
}

/* ========== 底部提交按钮 ========== */
.withdrawal-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx;
  background: linear-gradient(to top, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.8) 100%);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.submit-btn {
  height: 88rpx;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 32rpx rgba(255, 215, 0, 0.3);
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(255, 215, 0, 0.4);
  }
  
  &.disabled {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: none;
    
    .btn-text {
      opacity: 0.5;
    }
  }
  
  .btn-text {
    color: #333333;
    font-size: 32rpx;
    font-weight: 600;
  }
}
</style>