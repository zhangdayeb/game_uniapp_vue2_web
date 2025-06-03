<template>
  <!-- 绑定提现账号页面 -->
  <view class="binding-page">
    
    <!-- 顶部导航栏 -->
    <view class="binding-header">
      <!-- 返回按钮 -->
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      
      <!-- 标题 -->
      <view class="header-title">
        <text>绑定提现账号</text>
        <text class="title-en">BIND WITHDRAWAL ACCOUNT</text>
      </view>
      
      <!-- 占位符 -->
      <view class="header-placeholder"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="binding-content">
      
      <!-- 选择提现方式 -->
      <view class="method-selector">
        <view class="selector-title">
          <text class="title-icon">🔗</text>
          <text>选择绑定方式</text>
        </view>
        
        <view class="method-tabs">
          <view 
            class="tab-item"
            :class="{ active: selectedTab === 'aba' }"
            @click="switchTab('aba')"
          >
            <view class="tab-icon aba-tab">🏦</view>
            <text class="tab-text">ABA银行</text>
          </view>
          
          <view 
            class="tab-item"
            :class="{ active: selectedTab === 'huiwang' }"
            @click="switchTab('huiwang')"
          >
            <view class="tab-icon huiwang-tab">⚡</view>
            <text class="tab-text">汇旺</text>
          </view>
          
          <view 
            class="tab-item"
            :class="{ active: selectedTab === 'usdt' }"
            @click="switchTab('usdt')"
          >
            <view class="tab-icon usdt-tab">₿</view>
            <text class="tab-text">USDT</text>
          </view>
        </view>
      </view>

      <!-- 表单区域 -->
      <view class="binding-form">
        
        <!-- ABA银行表单 -->
        <view class="form-container" v-if="selectedTab === 'aba'">
          <view class="form-header">
            <view class="method-badge aba-badge">
              <text class="badge-icon">🏦</text>
              <text class="badge-text">ABA银行账户</text>
            </view>
          </view>
          
          <view class="form-fields">
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">👤</text>
                <text>账户姓名</text>
                <text class="required">*</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="abaForm.accountName"
                  placeholder="请输入银行账户姓名"
                  @input="validateForm"
                />
              </view>
            </view>
            
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">🔢</text>
                <text>银行账号</text>
                <text class="required">*</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="abaForm.accountNumber"
                  placeholder="请输入ABA银行账号"
                  type="number"
                  @input="validateForm"
                />
              </view>
            </view>
            
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">📱</text>
                <text>手机号码</text>
                <text class="required">*</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="abaForm.phoneNumber"
                  placeholder="请输入绑定手机号"
                  type="number"
                  @input="validateForm"
                />
              </view>
            </view>
            
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">🏢</text>
                <text>开户行</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="abaForm.bankBranch"
                  placeholder="请输入开户行信息（选填）"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 汇旺表单 -->
        <view class="form-container" v-if="selectedTab === 'huiwang'">
          <view class="form-header">
            <view class="method-badge huiwang-badge">
              <text class="badge-icon">⚡</text>
              <text class="badge-text">汇旺账户</text>
            </view>
          </view>
          
          <view class="form-fields">
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">👤</text>
                <text>账户姓名</text>
                <text class="required">*</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="huiwangForm.accountName"
                  placeholder="请输入汇旺账户姓名"
                  @input="validateForm"
                />
              </view>
            </view>
            
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">📱</text>
                <text>汇旺账号</text>
                <text class="required">*</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="huiwangForm.accountNumber"
                  placeholder="请输入汇旺账号（手机号）"
                  type="number"
                  @input="validateForm"
                />
              </view>
            </view>
            
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">🆔</text>
                <text>身份证号</text>
                <text class="required">*</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="huiwangForm.idNumber"
                  placeholder="请输入身份证号码"
                  @input="validateForm"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- USDT表单 -->
        <view class="form-container" v-if="selectedTab === 'usdt'">
          <view class="form-header">
            <view class="method-badge usdt-badge">
              <text class="badge-icon">₿</text>
              <text class="badge-text">USDT钱包</text>
            </view>
          </view>
          
          <view class="form-fields">
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">🔗</text>
                <text>网络类型</text>
                <text class="required">*</text>
              </view>
              <view class="network-selector">
                <view 
                  class="network-item"
                  :class="{ active: usdtForm.network === 'TRC20' }"
                  @click="selectNetwork('TRC20')"
                >
                  <text class="network-name">TRC20</text>
                  <text class="network-desc">波场网络</text>
                </view>
                <view 
                  class="network-item"
                  :class="{ active: usdtForm.network === 'ERC20' }"
                  @click="selectNetwork('ERC20')"
                >
                  <text class="network-name">ERC20</text>
                  <text class="network-desc">以太坊网络</text>
                </view>
              </view>
            </view>
            
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">📍</text>
                <text>钱包地址</text>
                <text class="required">*</text>
              </view>
              <view class="input-wrapper address-wrapper">
                <input 
                  class="field-input" 
                  v-model="usdtForm.walletAddress"
                  placeholder="请输入USDT钱包地址"
                  @input="validateForm"
                />
                <view class="scan-btn" @click="scanQRCode">
                  <text class="scan-icon">📷</text>
                </view>
              </view>
            </view>
            
            <view class="field-group">
              <view class="field-label">
                <text class="label-icon">👤</text>
                <text>备注名称</text>
              </view>
              <view class="input-wrapper">
                <input 
                  class="field-input" 
                  v-model="usdtForm.remarkName"
                  placeholder="请输入钱包备注名称（选填）"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 安全提示 -->
        <view class="security-notice">
          <view class="notice-header">
            <text class="notice-icon">🔒</text>
            <text class="notice-title">安全提示</text>
          </view>
          <view class="notice-content">
            <text class="notice-item">• 请确保账户信息准确无误，错误信息可能导致提现失败</text>
            <text class="notice-item">• 绑定后的账户信息将用于身份验证和资金安全保障</text>
            <text class="notice-item">• 如需修改账户信息，请联系客服进行身份验证</text>
            <text class="notice-item">• 平台将对您的账户信息进行加密保护</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提交按钮 -->
    <view class="binding-footer">
      <view class="agreement-check">
        <view class="checkbox" :class="{ checked: agreeTerms }" @click="toggleAgreement">
          <text class="check-icon">{{ agreeTerms ? '✓' : '' }}</text>
        </view>
        <text class="agreement-text">我已阅读并同意</text>
        <text class="agreement-link" @click="showTerms">《提现账户绑定协议》</text>
      </view>
      
      <view 
        class="submit-btn" 
        :class="{ disabled: !canSubmit }"
        @click="submitBinding"
      >
        <text class="btn-text">🔐 确认绑定</text>
      </view>
    </view>

    <!-- 协议弹窗 -->
    <view class="terms-modal" v-if="showTermsModal" @click="hideTerms">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">提现账户绑定协议</text>
          <text class="modal-close" @click="hideTerms">✕</text>
        </view>
        
        <scroll-view class="modal-body" scroll-y="true">
          <text class="terms-content">
            一、账户绑定说明
            1. 用户绑定的提现账户必须为本人实名账户
            2. 绑定信息一经确认，原则上不允许随意更改
            3. 如需修改账户信息，需要通过客服验证身份
            
            二、安全责任
            1. 用户应妥善保管账户信息，避免泄露
            2. 因用户信息错误导致的损失由用户承担
            3. 平台将采用加密技术保护用户信息安全
            
            三、提现规则
            1. 提现只能到绑定的账户
            2. 单笔提现金额有限制
            3. 提现需要通过风控审核
            
            四、其他条款
            1. 本协议最终解释权归平台所有
            2. 如有争议，以最新版本协议为准
          </text>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="modal-btn" @click="agreeAndClose">
            <text class="btn-text">同意并关闭</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入API接口
import {bindWithdrawalAccount} from '@/api/withdrawalAccount.js'

export default {
  name: 'BindingPage',
  
  data() {
    return {
      // 当前选择的标签页
      selectedTab: 'aba',
      
      // 是否同意协议
      agreeTerms: false,
      
      // 是否显示协议弹窗
      showTermsModal: false,
      
      // ABA银行表单数据
      abaForm: {
        accountName: '',
        accountNumber: '',
        phoneNumber: '',
        bankBranch: ''
      },
      
      // 汇旺表单数据
      huiwangForm: {
        accountName: '',
        accountNumber: '',
        idNumber: ''
      },
      
      // USDT表单数据
      usdtForm: {
        network: 'TRC20',
        walletAddress: '',
        remarkName: ''
      },
      
      // 已绑定的账户列表
      bindedAccounts: []
    }
  },
  
  computed: {
    // 是否可以提交
    canSubmit() {
      if (!this.agreeTerms) return false
      
      switch (this.selectedTab) {
        case 'aba':
          return this.abaForm.accountName && 
                 this.abaForm.accountNumber && 
                 this.abaForm.phoneNumber
        case 'huiwang':
          return this.huiwangForm.accountName && 
                 this.huiwangForm.accountNumber && 
                 this.huiwangForm.idNumber
        case 'usdt':
          return this.usdtForm.network && 
                 this.usdtForm.walletAddress
        default:
          return false
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
     * 切换标签页
     */
    switchTab(tab) {
      this.selectedTab = tab
    },
    
    /**
     * 选择USDT网络
     */
    selectNetwork(network) {
      this.usdtForm.network = network
      this.validateForm()
    },
    
    /**
     * 扫描二维码
     */
    scanQRCode() {
      uni.scanCode({
        success: (res) => {
          this.usdtForm.walletAddress = res.result
          this.validateForm()
        },
        fail: () => {
          uni.showToast({
            title: '扫描失败',
            icon: 'none'
          })
        }
      })
    },
    
    /**
     * 验证表单
     */
    validateForm() {
		return true
      switch (this.selectedTab) {
        case 'aba':
          // 验证银行卡号
          if (this.abaForm.accountNumber && !this.validateBankCard(this.abaForm.accountNumber)) {
            uni.showToast({
              title: '银行卡号格式不正确',
              icon: 'none'
            })
            return false
          }
          // 验证手机号
          if (this.abaForm.phoneNumber && !/^[0-9]{9,15}$/.test(this.abaForm.phoneNumber)) {
            uni.showToast({
              title: '手机号格式不正确',
              icon: 'none'
            })
            return false
          }
          break
          
        case 'huiwang':
          // 验证手机号
          if (this.huiwangForm.accountNumber && !/^[0-9]{9,15}$/.test(this.huiwangForm.accountNumber)) {
            uni.showToast({
              title: '汇旺账号格式不正确',
              icon: 'none'
            })
            return false
          }
          // 验证身份证号（简单验证）
          if (this.huiwangForm.idNumber && !/^[A-Za-z0-9]{6,20}$/.test(this.huiwangForm.idNumber)) {
            uni.showToast({
              title: '身份证号格式不正确',
              icon: 'none'
            })
            return false
          }
          break
          
        case 'usdt':
          // 验证USDT地址
          if (this.usdtForm.walletAddress && !this.validateUSDTAddress(this.usdtForm.walletAddress, this.usdtForm.network)) {
            uni.showToast({
              title: 'USDT地址格式不正确',
              icon: 'none'
            })
            return false
          }
          break
      }
      return true
    },
    
    /**
     * 切换协议同意状态
     */
    toggleAgreement() {
      this.agreeTerms = !this.agreeTerms
    },
    
    /**
     * 显示协议
     */
    showTerms() {
      this.showTermsModal = true
    },
    
    /**
     * 隐藏协议
     */
    hideTerms() {
      this.showTermsModal = false
    },
    
    /**
     * 同意协议并关闭
     */
    agreeAndClose() {
      this.agreeTerms = true
      this.hideTerms()
    },
    
    /**
     * 提交绑定
     */
    submitBinding() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请检查表单信息',
          icon: 'none'
        })
        return
      }
      
      // 先验证表单
      if (!this.validateForm()) {
        return
      }
      
      let accountInfo = ''
      let formData = {}
      
      switch (this.selectedTab) {
        case 'aba':
          accountInfo = `ABA银行账户：${this.abaForm.accountName}`
          formData = { ...this.abaForm, type: 'aba' }
          break
        case 'huiwang':
          accountInfo = `汇旺账户：${this.huiwangForm.accountName}`
          formData = { ...this.huiwangForm, type: 'huiwang' }
          break
        case 'usdt':
          accountInfo = `USDT钱包：${this.usdtForm.network}`
          formData = { ...this.usdtForm, type: 'usdt' }
          break
      }
      
      // 显示确认弹窗
      uni.showModal({
        title: '确认绑定',
        content: `${accountInfo}\n\n确认绑定此账户？绑定后将用于提现操作。`,
        confirmText: '确认绑定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.processBinding(formData)
          }
        }
      })
    },
    
    /**
     * 处理绑定请求
     */
    async processBinding(formData) {
      try {
        uni.showLoading({
          title: '绑定中...'
        })
        
        // 构建发送到后端的数据
        const requestData = this.buildRequestData(formData)
        
        // 调用绑定接口
        const response = await bindWithdrawalAccount(requestData)
        
        uni.hideLoading()
        
        if (response.data.code === 200) {
          uni.showToast({
            title: '绑定成功',
            icon: 'success'
          })
          
          // 绑定成功后返回
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({
            title: response.data.message || '绑定失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error('绑定失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      }
    },
    
    /**
     * 构建请求数据
     */
    buildRequestData(formData) {
      const baseData = {
        account_type: formData.type // 账户类型: aba, huiwang, usdt
      }
      
      switch (formData.type) {
        case 'aba':
          return {
            ...baseData,
            account_name: formData.accountName,
            account_number: formData.accountNumber,
            phone_number: formData.phoneNumber,
            bank_branch: formData.bankBranch || ''
          }
          
        case 'huiwang':
          return {
            ...baseData,
            account_name: formData.accountName,
            account_number: formData.accountNumber,
            id_number: formData.idNumber
          }
          
        case 'usdt':
          return {
            ...baseData,
            wallet_address: formData.walletAddress,
            network_type: formData.network, // TRC20 或 ERC20
            remark_name: formData.remarkName || ''
          }
          
        default:
          throw new Error('未知的账户类型')
      }
    },
    
    /**
     * 获取已绑定的账户列表
     */
    async getBindedAccounts() {
      try {
        const response = await this.$api.getWithdrawalAccounts({
          page: 1,
          limit: 10
        })
        
        if (response.code === 200) {
          this.bindedAccounts = response.data.list || []
        }
      } catch (error) {
        console.error('获取绑定账户失败:', error)
      }
    },
    
    /**
     * 验证银行卡号
     */
    validateBankCard(cardNumber) {
      // 简单的银行卡号验证
      const cleanNumber = cardNumber.replace(/\s+/g, '')
      return cleanNumber.length >= 10 && cleanNumber.length <= 25 && /^\d+$/.test(cleanNumber)
    },
    
    /**
     * 验证USDT地址
     */
    validateUSDTAddress(address, network) {
      if (network === 'TRC20') {
        // TRC20地址验证（波场地址以T开头，长度34位）
        return /^T[A-Za-z1-9]{33}$/.test(address)
      } else if (network === 'ERC20') {
        // ERC20地址验证（以太坊地址以0x开头，长度42位）
        return /^0x[a-fA-F0-9]{40}$/.test(address)
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 页面主体样式 ========== */
.binding-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

/* ========== 顶部导航栏 ========== */
.binding-header {
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
.binding-content {
  padding: 0 40rpx 300rpx;
}

/* ========== 方式选择器 ========== */
.method-selector {
  margin-bottom: 40rpx;
}

.selector-title {
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

.method-tabs {
  display: flex;
  gap: 20rpx;
}

.tab-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.2) 100%);
    border-color: #ffd700;
    box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.tab-icon {
  width: 50rpx;
  height: 50rpx;
  margin: 0 auto 16rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  
  &.aba-tab {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  }
  
  &.huiwang-tab {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  &.usdt-tab {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

.tab-text {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 500;
}

/* ========== 表单容器 ========== */
.binding-form {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
}

.form-container {
  margin-bottom: 40rpx;
}

.form-header {
  margin-bottom: 40rpx;
}

.method-badge {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  
  .badge-icon {
    font-size: 28rpx;
    margin-right: 16rpx;
  }
  
  .badge-text {
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
  }
  
  &.aba-badge {
    border-color: #3b82f6;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
  }
  
  &.huiwang-badge {
    border-color: #ef4444;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
  }
  
  &.usdt-badge {
    border-color: #10b981;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
  }
}

/* ========== 表单字段 ========== */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.field-group {
  .field-label {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    .label-icon {
      font-size: 24rpx;
      margin-right: 12rpx;
    }
    
    text:not(.label-icon):not(.required) {
      color: #ffffff;
      font-size: 26rpx;
      font-weight: 500;
    }
    
    .required {
      color: #ff6b6b;
      font-size: 24rpx;
      margin-left: 8rpx;
    }
  }
}

.input-wrapper {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 0 30rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  
  &.address-wrapper {
    padding-right: 20rpx;
  }
  
  .field-input {
    flex: 1;
    color: #ffffff;
    font-size: 28rpx;
    background: transparent;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.scan-btn {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  
  .scan-icon {
    font-size: 24rpx;
    color: #333333;
  }
  
  &:active {
    transform: scale(0.9);
  }
}

/* ========== 网络选择器 ========== */
.network-selector {
  display: flex;
  gap: 20rpx;
}

.network-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.2) 100%);
    border-color: #10b981;
  }
  
  .network-name {
    display: block;
    color: #ffffff;
    font-size: 26rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
  }
  
  .network-desc {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 20rpx;
  }
}

/* ========== 安全提示 ========== */
.security-notice {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.3);
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  .notice-icon {
    font-size: 24rpx;
    margin-right: 12rpx;
  }
  
  .notice-title {
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

/* ========== 底部区域 ========== */
.binding-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx;
  background: linear-gradient(to top, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.8) 100%);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.agreement-check {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  .checkbox {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.5);
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    
    &.checked {
      background: #ffd700;
      border-color: #ffd700;
    }
    
    .check-icon {
      color: #333333;
      font-size: 20rpx;
      font-weight: bold;
    }
  }
  
  .agreement-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 24rpx;
    margin-right: 8rpx;
  }
  
  .agreement-link {
    color: #ffd700;
    font-size: 24rpx;
    text-decoration: underline;
  }
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

/* ========== 协议弹窗 ========== */
.terms-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.modal-content {
  width: 100%;
  max-height: 80vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
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

.modal-body {
  flex: 1;
  padding: 40rpx;
  max-height: 500rpx;
}

.terms-content {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  line-height: 1.6;
  white-space: pre-line;
}

.modal-footer {
  padding: 30rpx 40rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.modal-btn {
  height: 80rpx;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn-text {
    color: #333333;
    font-size: 28rpx;
    font-weight: 600;
  }
}
</style>