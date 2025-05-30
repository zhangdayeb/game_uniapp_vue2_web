<template>
  <!-- 提现记录页面 -->
  <view class="withdrawal-record-page">
    
    <!-- 顶部导航栏 -->
    <view class="record-header">
      <!-- 返回按钮 -->
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      
      <!-- 标题 -->
      <view class="header-title">
        <text>提现记录</text>
        <text class="title-en">WITHDRAWAL RECORDS</text>
      </view>
      
      <!-- 筛选按钮 -->
      <view class="header-filter" @click="showFilterModal">
        <text class="filter-text">筛选</text>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-label">累计提现</text>
          <text class="stat-value">${{ totalWithdrawal }}</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-label">待审核</text>
          <text class="stat-value pending">{{ pendingCount }}笔</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-label">本月提现</text>
          <text class="stat-value">${{ monthlyWithdrawal }}</text>
        </view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs" v-if="filterTabs.length > 0">
      <scroll-view scroll-x="true" class="tabs-scroll">
        <view class="tabs-wrapper">
          <view 
            class="tab-item"
            :class="{ active: activeTab === tab.value }"
            v-for="tab in filterTabs"
            :key="tab.value"
            @click="switchTab(tab.value)"
          >
            <text class="tab-icon">{{ tab.icon }}</text>
            <text class="tab-text">{{ tab.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 记录列表 -->
    <view class="records-content">
      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredRecords.length === 0">
        <text class="empty-icon">📝</text>
        <text class="empty-text">暂无提现记录</text>
        <view class="empty-action" @click="goToWithdrawal">
          <text class="action-text">立即提现</text>
        </view>
      </view>

      <!-- 记录列表 -->
      <view class="records-list" v-else>
        <view 
          class="record-item"
          v-for="record in filteredRecords"
          :key="record.id"
          @click="viewDetail(record)"
        >
          <!-- 左侧图标和基本信息 -->
          <view class="record-left">
            <view class="record-icon-wrapper" :class="getStatusClass(record.status)">
              <text class="record-icon">{{ getMethodIcon(record.method) }}</text>
            </view>
            <view class="record-info">
              <text class="record-method">{{ getMethodName(record.method) }}</text>
              <text class="record-time">{{ formatTime(record.createTime) }}</text>
            </view>
          </view>

          <!-- 右侧金额和状态 -->
          <view class="record-right">
            <text class="record-amount">-${{ record.amount }}</text>
            <view class="record-status" :class="getStatusClass(record.status)">
              <text class="status-text">{{ getStatusText(record.status) }}</text>
            </view>
          </view>

          <!-- 进度指示器 -->
          <view class="record-progress" v-if="record.status === 'processing'">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: record.progress + '%' }"></view>
            </view>
            <text class="progress-text">处理中 {{ record.progress }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore && filteredRecords.length > 0">
      <text class="load-text" @click="loadMore">加载更多</text>
    </view>

    <!-- 筛选弹窗 -->
    <view class="filter-modal" v-if="showFilter" @click="hideFilterModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">筛选条件</text>
          <text class="modal-close" @click="hideFilterModal">✕</text>
        </view>
        
        <view class="filter-section">
          <text class="section-title">提现状态</text>
          <view class="filter-options">
            <view 
              class="filter-option"
              :class="{ active: selectedStatus === status.value }"
              v-for="status in statusOptions"
              :key="status.value"
              @click="selectStatus(status.value)"
            >
              <text class="option-icon">{{ status.icon }}</text>
              <text class="option-text">{{ status.label }}</text>
            </view>
          </view>
        </view>

        <view class="filter-section">
          <text class="section-title">提现方式</text>
          <view class="filter-options">
            <view 
              class="filter-option"
              :class="{ active: selectedMethod === method.value }"
              v-for="method in methodOptions"
              :key="method.value"
              @click="selectMethod(method.value)"
            >
              <text class="option-icon">{{ method.icon }}</text>
              <text class="option-text">{{ method.label }}</text>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <view class="footer-btn reset-btn" @click="resetFilter">
            <text class="btn-text">重置</text>
          </view>
          <view class="footer-btn confirm-btn" @click="applyFilter">
            <text class="btn-text">确认</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'WithdrawalRecordPage',
  
  data() {
    return {
      // 统计数据
      totalWithdrawal: '125,680.50',
      pendingCount: 2,
      monthlyWithdrawal: '8,500.00',
      
      // 筛选相关
      showFilter: false,
      activeTab: 'all',
      selectedStatus: 'all',
      selectedMethod: 'all',
      
      // 分页
      hasMore: true,
      
      // 筛选标签
      filterTabs: [
        { value: 'all', label: '全部', icon: '📄' },
        { value: 'pending', label: '待审核', icon: '⏳' },
        { value: 'processing', label: '处理中', icon: '🔄' },
        { value: 'completed', label: '已完成', icon: '✅' },
        { value: 'rejected', label: '已拒绝', icon: '❌' }
      ],
      
      // 状态选项
      statusOptions: [
        { value: 'all', label: '全部状态', icon: '📄' },
        { value: 'pending', label: '待审核', icon: '⏳' },
        { value: 'processing', label: '处理中', icon: '🔄' },
        { value: 'completed', label: '已完成', icon: '✅' },
        { value: 'rejected', label: '已拒绝', icon: '❌' }
      ],
      
      // 方式选项
      methodOptions: [
        { value: 'all', label: '全部方式', icon: '💳' },
        { value: 'aba', label: 'ABA银行', icon: '🏦' },
        { value: 'huiwang', label: '汇旺', icon: '⚡' },
        { value: 'usdt', label: 'USDT', icon: '₿' }
      ],
      
      // 提现记录数据
      withdrawalRecords: [
        {
          id: '1',
          amount: '5000.00',
          method: 'aba',
          status: 'processing',
          progress: 65,
          createTime: '2024-01-15 14:30:00',
          remark: '正在银行处理中'
        },
        {
          id: '2',
          amount: '1200.00',
          method: 'usdt',
          status: 'completed',
          createTime: '2024-01-14 09:15:00',
          remark: '提现成功'
        },
        {
          id: '3',
          amount: '800.00',
          method: 'huiwang',
          status: 'pending',
          createTime: '2024-01-13 16:45:00',
          remark: '等待审核中'
        },
        {
          id: '4',
          amount: '3000.00',
          method: 'aba',
          status: 'rejected',
          createTime: '2024-01-12 11:20:00',
          remark: '银行账户信息有误'
        },
        {
          id: '5',
          amount: '2500.00',
          method: 'usdt',
          status: 'completed',
          createTime: '2024-01-11 08:30:00',
          remark: '提现成功'
        },
        {
          id: '6',
          amount: '600.00',
          method: 'huiwang',
          status: 'pending',
          createTime: '2024-01-10 13:15:00',
          remark: '等待审核中'
        }
      ]
    }
  },
  
  computed: {
    // 筛选后的记录
    filteredRecords() {
      let records = this.withdrawalRecords
      
      // 按状态筛选
      if (this.activeTab !== 'all') {
        records = records.filter(record => record.status === this.activeTab)
      }
      
      return records
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
     * 显示筛选弹窗
     */
    showFilterModal() {
      this.showFilter = true
    },
    
    /**
     * 隐藏筛选弹窗
     */
    hideFilterModal() {
      this.showFilter = false
    },
    
    /**
     * 切换标签
     */
    switchTab(tab) {
      this.activeTab = tab
    },
    
    /**
     * 选择状态
     */
    selectStatus(status) {
      this.selectedStatus = status
    },
    
    /**
     * 选择方式
     */
    selectMethod(method) {
      this.selectedMethod = method
    },
    
    /**
     * 重置筛选
     */
    resetFilter() {
      this.selectedStatus = 'all'
      this.selectedMethod = 'all'
    },
    
    /**
     * 应用筛选
     */
    applyFilter() {
      this.activeTab = this.selectedStatus
      this.hideFilterModal()
    },
    
    /**
     * 获取状态样式类
     */
    getStatusClass(status) {
      return `status-${status}`
    },
    
    /**
     * 获取方式图标
     */
    getMethodIcon(method) {
      const icons = {
        aba: '🏦',
        huiwang: '⚡',
        usdt: '₿'
      }
      return icons[method] || '💳'
    },
    
    /**
     * 获取方式名称
     */
    getMethodName(method) {
      const names = {
        aba: 'ABA银行',
        huiwang: '汇旺',
        usdt: 'USDT'
      }
      return names[method] || '未知方式'
    },
    
    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const texts = {
        pending: '待审核',
        processing: '处理中',
        completed: '已完成',
        rejected: '已拒绝'
      }
      return texts[status] || '未知状态'
    },
    
    /**
     * 格式化时间
     */
    formatTime(timeStr) {
      const date = new Date(timeStr)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) { // 1分钟内
        return '刚刚'
      } else if (diff < 3600000) { // 1小时内
        return Math.floor(diff / 60000) + '分钟前'
      } else if (diff < 86400000) { // 1天内
        return Math.floor(diff / 3600000) + '小时前'
      } else {
        return timeStr.split(' ')[0] // 返回日期部分
      }
    },
    
    /**
     * 查看详情
     */
    viewDetail(record) {
      uni.navigateTo({
        url: `/pages/withdrawal/detail?id=${record.id}`
      })
    },
    
    /**
     * 跳转到提现页面
     */
    goToWithdrawal() {
      uni.navigateTo({
        url: '/pages/withdrawal/apply'
      })
    },
    
    /**
     * 加载更多
     */
    loadMore() {
      uni.showLoading({
        title: '加载中...'
      })
      
      // 模拟加载
      setTimeout(() => {
        uni.hideLoading()
        this.hasMore = false
        uni.showToast({
          title: '已加载全部数据',
          icon: 'none'
        })
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 页面主体样式 ========== */
.withdrawal-record-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

/* ========== 顶部导航栏 ========== */
.record-header {
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

.header-filter {
  .filter-text {
    color: #ffffff;
    font-size: 28rpx;
    padding: 16rpx 24rpx;
    background: rgba(255, 215, 0, 0.2);
    border-radius: 20rpx;
    border: 1rpx solid rgba(255, 215, 0, 0.3);
    
    &:active {
      background: rgba(255, 215, 0, 0.3);
    }
  }
}

/* ========== 统计卡片 ========== */
.stats-section {
  padding: 0 40rpx 30rpx;
}

.stats-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.stat-item {
  flex: 1;
  text-align: center;
  
  .stat-label {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
    margin-bottom: 12rpx;
  }
  
  .stat-value {
    display: block;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    
    &.pending {
      color: #ffd700;
    }
  }
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 30rpx;
}

/* ========== 筛选标签 ========== */
.filter-tabs {
  padding: 0 40rpx 30rpx;
}

.tabs-scroll {
  white-space: nowrap;
}

.tabs-wrapper {
  display: flex;
  gap: 20rpx;
}

.tab-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  
  &.active {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.2) 100%);
    border-color: #ffd700;
  }
  
  .tab-icon {
    font-size: 20rpx;
    margin-right: 8rpx;
  }
  
  .tab-text {
    color: #ffffff;
    font-size: 24rpx;
  }
}

/* ========== 记录内容 ========== */
.records-content {
  padding: 0 40rpx 120rpx;
}

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  
  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 30rpx;
    opacity: 0.5;
  }
  
  .empty-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 28rpx;
    margin-bottom: 40rpx;
  }
  
  .empty-action {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-radius: 25rpx;
    padding: 20rpx 40rpx;
    
    .action-text {
      color: #333333;
      font-size: 26rpx;
      font-weight: 600;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

/* ========== 记录列表 ========== */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  padding: 30rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &:active {
    transform: scale(0.98);
  }
}

.record-left {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.record-icon-wrapper {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  
  .record-icon {
    font-size: 28rpx;
  }
  
  &.status-pending {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  &.status-processing {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  }
  
  &.status-completed {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  &.status-rejected {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
}

.record-info {
  flex: 1;
  
  .record-method {
    display: block;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 6rpx;
  }
  
  .record-time {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 22rpx;
  }
}

.record-right {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  text-align: right;
  
  .record-amount {
    display: block;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
  }
  
  .record-status {
    border-radius: 12rpx;
    padding: 6rpx 12rpx;
    
    .status-text {
      font-size: 20rpx;
      font-weight: 500;
    }
    
    &.status-pending {
      background: rgba(245, 158, 11, 0.2);
      border: 1rpx solid rgba(245, 158, 11, 0.4);
      
      .status-text {
        color: #f59e0b;
      }
    }
    
    &.status-processing {
      background: rgba(59, 130, 246, 0.2);
      border: 1rpx solid rgba(59, 130, 246, 0.4);
      
      .status-text {
        color: #3b82f6;
      }
    }
    
    &.status-completed {
      background: rgba(16, 185, 129, 0.2);
      border: 1rpx solid rgba(16, 185, 129, 0.4);
      
      .status-text {
        color: #10b981;
      }
    }
    
    &.status-rejected {
      background: rgba(239, 68, 68, 0.2);
      border: 1rpx solid rgba(239, 68, 68, 0.4);
      
      .status-text {
        color: #ef4444;
      }
    }
  }
}

/* ========== 进度条 ========== */
.record-progress {
  margin-top: 20rpx;
  
  .progress-bar {
    height: 6rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3rpx;
    overflow: hidden;
    margin-bottom: 8rpx;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
      transition: width 0.3s ease;
    }
  }
  
  .progress-text {
    color: #3b82f6;
    font-size: 20rpx;
    text-align: center;
  }
}

/* ========== 加载更多 ========== */
.load-more {
  padding: 40rpx 0;
  text-align: center;
  
  .load-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 26rpx;
    padding: 20rpx 40rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 20rpx;
    background: rgba(255, 255, 255, 0.05);
    
    &:active {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

/* ========== 筛选弹窗 ========== */
.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
  
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

.filter-section {
  margin-bottom: 40rpx;
  
  .section-title {
    color: rgba(255, 255, 255, 0.8);
    font-size: 26rpx;
    margin-bottom: 20rpx;
  }
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.filter-option {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  
  &.active {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.2) 100%);
    border-color: #ffd700;
  }
  
  .option-icon {
    font-size: 20rpx;
    margin-right: 8rpx;
  }
  
  .option-text {
    color: #ffffff;
    font-size: 24rpx;
  }
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.footer-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn-text {
    font-size: 28rpx;
    font-weight: 600;
  }
  
  &.reset-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
    
    .btn-text {
      color: #ffffff;
    }
  }
  
  &.confirm-btn {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    
    .btn-text {
      color: #333333;
    }
  }
}
</style>