<template>
  <view class="password-change">
    <!-- 修改密码按钮 -->
    <view class="settings-item" @click="showPasswordModal = true">
      <view class="settings-item-left">
        <u-icon name="lock" size="20" color="#666" />
        <text class="settings-item-text">修改密码</text>
      </view>
      <view class="settings-item-right">
        <u-icon name="arrow-right" size="16" color="#ccc" />
      </view>
    </view>

    <!-- 修改密码弹窗 -->
    <u-popup 
      v-model="showPasswordModal" 
      mode="center" 
      width="85%" 
      height="auto"
      border-radius="10"
    >
      <view class="password-modal">
        <view class="modal-header">
          <text class="modal-title">修改密码</text>
          <u-icon 
            name="close" 
            size="20" 
            color="#666" 
            @click="closePasswordModal"
          />
        </view>
        
        <view class="modal-content">
          <!-- 当前密码 -->
          <view class="input-group">
            <text class="input-label">当前密码</text>
            <u-input 
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入当前密码"
              :border="true"
              :clearable="true"
              maxlength="20"
            />
          </view>
          
          <!-- 新密码 -->
          <view class="input-group">
            <text class="input-label">新密码</text>
            <u-input 
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码(6-20位)"
              :border="true"
              :clearable="true"
              maxlength="20"
            />
          </view>
          
          <!-- 确认新密码 -->
          <view class="input-group">
            <text class="input-label">确认新密码</text>
            <u-input 
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              :border="true"
              :clearable="true"
              maxlength="20"
            />
          </view>
          
          <!-- 密码强度提示 -->
          <view class="password-tips">
            <text class="tips-text">密码要求：6-20位，建议包含字母和数字</text>
          </view>
        </view>
        
        <view class="modal-footer">
          <u-button 
            @click="closePasswordModal"
            type="default"
            size="medium"
            :custom-style="cancelButtonStyle"
          >
            取消
          </u-button>
          <u-button 
            @click="submitPasswordChange"
            type="primary"
            size="medium"
            :loading="submitLoading"
            :custom-style="confirmButtonStyle"
          >
            确认修改
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import api from '@/api/api.js'

export default {
  data() {
    return {
      // 弹窗显示状态
      showPasswordModal: false,
      
      // 提交加载状态
      submitLoading: false,
      
      // 密码表单数据
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      // 按钮样式
      cancelButtonStyle: {
        width: '45%',
        marginRight: '10rpx'
      },
      confirmButtonStyle: {
        width: '45%',
        marginLeft: '10rpx'
      }
    }
  },
  
  methods: {
    /**
     * 显示密码修改弹窗
     */
    showPasswordChangeModal() {
      this.showPasswordModal = true
    },
    
    /**
     * 关闭密码修改弹窗
     */
    closePasswordModal() {
      this.showPasswordModal = false
      this.resetPasswordForm()
    },
    
    /**
     * 重置密码表单
     */
    resetPasswordForm() {
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.submitLoading = false
    },
    
    /**
     * 验证密码表单
     */
    validatePasswordForm() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm
      
      // 检查必填项
      if (!oldPassword.trim()) {
        this.showToast('请输入当前密码')
        return false
      }
      
      if (!newPassword.trim()) {
        this.showToast('请输入新密码')
        return false
      }
      
      if (!confirmPassword.trim()) {
        this.showToast('请确认新密码')
        return false
      }
      
      // 检查新密码长度
      if (newPassword.length < 6 || newPassword.length > 20) {
        this.showToast('新密码长度必须在6-20位之间')
        return false
      }
      
      // 检查密码一致性
      if (newPassword !== confirmPassword) {
        this.showToast('两次输入的新密码不一致')
        return false
      }
      
      // 检查新旧密码是否相同
      if (oldPassword === newPassword) {
        this.showToast('新密码不能与当前密码相同')
        return false
      }
      
      // 简单的密码强度检查
      const hasLetter = /[a-zA-Z]/.test(newPassword)
      const hasNumber = /\d/.test(newPassword)
      
      if (!hasLetter && !hasNumber) {
        this.showToast('密码建议包含字母和数字，以提高安全性')
        // 这里可以选择是否阻止提交，或者只是警告
      }
      
      return true
    },
    
    /**
     * 提交密码修改
     */
    async submitPasswordChange() {
      // 表单验证
      if (!this.validatePasswordForm()) {
        return
      }
      
      this.submitLoading = true
      
      try {
        const params = {
          old_password: this.passwordForm.oldPassword,
          new_password: this.passwordForm.newPassword,
          confirm_password: this.passwordForm.confirmPassword
        }
        
        const response = await api.updatePwd(params)
        
        if (response.data.code === 200) {
          this.showToast('密码修改成功')
          this.closePasswordModal()
          
          // 可选：修改密码成功后退出登录，要求用户重新登录
          setTimeout(() => {
            this.logoutAfterPasswordChange()
          }, 1500)
          
        } else {
          this.showToast(response.data.message || '密码修改失败')
        }
        
      } catch (error) {
        console.error('修改密码失败:', error)
        this.showToast('网络错误，请稍后重试')
      } finally {
        this.submitLoading = false
      }
    },
    
    /**
     * 密码修改成功后退出登录
     */
    logoutAfterPasswordChange() {
      uni.showModal({
        title: '提示',
        content: '密码修改成功，为了安全起见，请重新登录',
        showCancel: false,
        success: () => {
          // 清除登录信息
          uni.removeStorageSync('Access-Token')
          uni.removeStorageSync('login_user_info')
          uni.removeStorageSync('account')
          uni.removeStorageSync('password')
          
          // 跳转到登录页
          uni.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    },
    
    /**
     * 显示提示消息
     */
    showToast(message) {
      if (this.$tip && this.$tip.toast) {
        this.$tip.toast(message)
      } else {
        uni.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.password-change {
  width: 100%;
}

/* 设置项样式 */
.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
  
  &:active {
    background: #f8f8f8;
  }
}

.settings-item-left {
  display: flex;
  align-items: center;
}

.settings-item-text {
  margin-left: 10px;
  font-size: 16px;
  color: #333;
}

.settings-item-right {
  display: flex;
  align-items: center;
}

/* 弹窗样式 */
.password-modal {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-content {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.password-tips {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.tips-text {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 响应式适配 */
@media screen and (max-width: 750px) {
  .password-modal {
    padding: 15px;
  }
  
  .modal-title {
    font-size: 16px;
  }
  
  .settings-item {
    padding: 12px 15px;
  }
  
  .settings-item-text {
    font-size: 15px;
  }
}
</style>