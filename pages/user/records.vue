<template>
  <!-- 交易记录页面 -->
  <view class="records-page">
    
    <!-- 顶部导航栏 -->
    <view class="records-header">
      <!-- 返回按钮 -->
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      
      <!-- 标题 -->
      <view class="header-title">
        <text>交易记录</text>
        <text class="title-en">TRANSACTION RECORDS</text>
      </view>
      
      <!-- 占位符 -->
      <view class="header-placeholder"></view>
    </view>

    <!-- 记录类型选择 -->
    <view class="record-types">
      <view 
        class="type-item"
        :class="{ active: activeType === type.value }"
        v-for="type in recordTypes"
        :key="type.value"
        @click="switchType(type.value)"
      >
        <text class="type-icon">{{ type.icon }}</text>
        <text class="type-text">{{ type.label }}</text>
      </view>
    </view>

    <!-- 日期筛选 -->
    <view class="date-filters">
      <scroll-view scroll-x="true" class="date-scroll">
        <view class="date-wrapper">
          <view 
            class="date-item"
            :class="{ active: activeDate === date.value }"
            v-for="date in dateFilters"
            :key="date.value"
            @click="switchDate(date.value)"
          >
            <text class="date-text">{{ date.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 记录内容区域 -->
    <view class="records-content">
      
      <!-- 投注记录 -->
      <view class="records-section" v-if="activeType === 'bet'">
        <view class="section-header">
          <text class="section-icon">📝</text>
          <text class="section-title">投注记录</text>
          <text class="section-count">({{ betRecords.length }}条)</text>
        </view>
        
        <view class="records-list" v-if="betRecords.length > 0">
          <view 
            class="record-item bet-item"
            v-for="record in betRecords"
            :key="record.id"
          >
            <view class="item-header">
              <text class="game-name">{{ record.gameName }}</text>
              <text class="bet-time">{{ record.time }}</text>
            </view>
            <view class="item-body">
              <view class="bet-info">
                <text class="bet-label">投注金额：</text>
                <text class="bet-amount">${{ record.betAmount }}</text>
              </view>
              <view class="result-info">
                <text class="result-label">结果：</text>
                <text class="result-value" :class="getResultClass(record.result)">
                  {{ getResultText(record.result) }}
                </text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="empty-state" v-else>
          <text class="empty-icon">📝</text>
          <text class="empty-text">暂无投注记录</text>
        </view>
      </view>

      <!-- 输赢记录 -->
      <view class="records-section" v-if="activeType === 'winlose'">
        <view class="section-header">
          <text class="section-icon">🎯</text>
          <text class="section-title">输赢记录</text>
          <text class="section-count">({{ winloseRecords.length }}条)</text>
        </view>
        
        <view class="summary-cards">
          <view class="summary-card win-card">
            <text class="card-label">总赢利</text>
            <text class="card-value">+${{ totalWin }}</text>
          </view>
          <view class="summary-card lose-card">
            <text class="card-label">总亏损</text>
            <text class="card-value">-${{ totalLose }}</text>
          </view>
        </view>
        
        <view class="records-list" v-if="winloseRecords.length > 0">
          <view 
            class="record-item winlose-item"
            v-for="record in winloseRecords"
            :key="record.id"
          >
            <view class="item-header">
              <text class="game-name">{{ record.gameName }}</text>
              <text class="record-time">{{ record.time }}</text>
            </view>
            <view class="item-body">
              <view class="amount-info">
                <text class="amount-value" :class="record.amount > 0 ? 'win-amount' : 'lose-amount'">
                  {{ record.amount > 0 ? '+' : '' }}${{ record.amount }}
                </text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="empty-state" v-else>
          <text class="empty-icon">🎯</text>
          <text class="empty-text">暂无输赢记录</text>
        </view>
      </view>

      <!-- 钱包流水 -->
      <view class="records-section" v-if="activeType === 'wallet'">
        <view class="section-header">
          <text class="section-icon">💳</text>
          <text class="section-title">钱包流水</text>
          <text class="section-count">({{ walletRecords.length }}条)</text>
        </view>
        
        <view class="records-list" v-if="walletRecords.length > 0">
          <view 
            class="record-item wallet-item"
            v-for="record in walletRecords"
            :key="record.id"
          >
            <view class="item-left">
              <view class="transaction-icon" :class="getTransactionClass(record.type)">
                <text>{{ getTransactionIcon(record.type) }}</text>
              </view>
              <view class="transaction-info">
                <text class="transaction-title">{{ getTransactionTitle(record.type) }}</text>
                <text class="transaction-time">{{ record.time }}</text>
              </view>
            </view>
            <view class="item-right">
              <text class="transaction-amount" :class="record.amount > 0 ? 'income' : 'expense'">
                {{ record.amount > 0 ? '+' : '' }}${{ Math.abs(record.amount) }}
              </text>
            </view>
          </view>
        </view>
        
        <view class="empty-state" v-else>
          <text class="empty-icon">💳</text>
          <text class="empty-text">暂无钱包流水</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserRecordsPage',
  
  data() {
    return {
      activeType: 'bet',
      activeDate: 'today',
      
      // 记录类型
      recordTypes: [
        { value: 'bet', label: '投注记录', icon: '📝' },
        { value: 'winlose', label: '输赢记录', icon: '🎯' },
        { value: 'wallet', label: '钱包流水', icon: '💳' }
      ],
      
      // 日期筛选
      dateFilters: [
        { value: 'today', label: '今天' },
        { value: 'yesterday', label: '昨天' },
        { value: 'week', label: '本周' },
        { value: 'month', label: '本月' },
        { value: 'earlier', label: '更早' }
      ],
      
      // 模拟数据
      betRecords: [
        {
          id: '1',
          gameName: '百家乐',
          betAmount: '500.00',
          result: 'win',
          time: '2024-01-15 14:30:25'
        },
        {
          id: '2',
          gameName: '龙虎斗',
          betAmount: '200.00',
          result: 'lose',
          time: '2024-01-15 13:45:12'
        },
        {
          id: '3',
          gameName: '骰宝',
          betAmount: '100.00',
          result: 'win',
          time: '2024-01-15 12:20:48'
        }
      ],
      
      winloseRecords: [
        {
          id: '1',
          gameName: '百家乐',
          amount: 450.00,
          time: '2024-01-15 14:30:25'
        },
        {
          id: '2',
          gameName: '龙虎斗',
          amount: -200.00,
          time: '2024-01-15 13:45:12'
        },
        {
          id: '3',
          gameName: '骰宝',
          amount: 90.00,
          time: '2024-01-15 12:20:48'
        }
      ],
      
      walletRecords: [
        {
          id: '1',
          type: 'deposit',
          amount: 1000.00,
          time: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          type: 'bet',
          amount: -500.00,
          time: '2024-01-15 14:30:25'
        },
        {
          id: '3',
          type: 'win',
          amount: 450.00,
          time: '2024-01-15 14:31:00'
        },
        {
          id: '4',
          type: 'withdraw',
          amount: -800.00,
          time: '2024-01-14 16:45:30'
        }
      ]
    }
  },
  
  computed: {
    totalWin() {
      return this.winloseRecords
        .filter(record => record.amount > 0)
        .reduce((sum, record) => sum + record.amount, 0)
        .toFixed(2)
    },
    
    totalLose() {
      return Math.abs(this.winloseRecords
        .filter(record => record.amount < 0)
        .reduce((sum, record) => sum + record.amount, 0))
        .toFixed(2)
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
     * 切换记录类型
     */
    switchType(type) {
      this.activeType = type
    },
    
    /**
     * 切换日期筛选
     */
    switchDate(date) {
      this.activeDate = date
      // 这里可以根据日期重新获取数据
    },
    
    /**
     * 获取结果样式类
     */
    getResultClass(result) {
      return result === 'win' ? 'win-result' : 'lose-result'
    },
    
    /**
     * 获取结果文本
     */
    getResultText(result) {
      return result === 'win' ? '赢' : '输'
    },
    
    /**
     * 获取交易类型样式
     */
    getTransactionClass(type) {
      const classes = {
        deposit: 'deposit-icon',
        withdraw: 'withdraw-icon',
        bet: 'bet-icon',
        win: 'win-icon'
      }
      return classes[type] || ''
    },
    
    /**
     * 获取交易图标
     */
    getTransactionIcon(type) {
      const icons = {
        deposit: '💰',
        withdraw: '💸',
        bet: '🎲',
        win: '🎉'
      }
      return icons[type] || '💳'
    },
    
    /**
     * 获取交易标题
     */
    getTransactionTitle(type) {
      const titles = {
        deposit: '充值',
        withdraw: '提现',
        bet: '投注',
        win: '中奖'
      }
      return titles[type] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 页面主体样式 ========== */
.records-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

/* ========== 顶部导航栏 ========== */
.records-header {
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

/* ========== 记录类型选择 ========== */
.record-types {
  display: flex;
  padding: 0 40rpx 30rpx;
  gap: 20rpx;
}

.type-item {
  flex: 1;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%);
    border-color: #3b82f6;
    box-shadow: 0 0 20rpx rgba(59, 130, 246, 0.3);
  }
  
  .type-icon {
    font-size: 20rpx;
    margin-bottom: 4rpx;
  }
  
  .type-text {
    color: #ffffff;
    font-size: 22rpx;
    font-weight: 500;
  }
}

/* ========== 日期筛选 ========== */
.date-filters {
  padding: 0 40rpx 30rpx;
}

.date-scroll {
  white-space: nowrap;
}

.date-wrapper {
  display: flex;
  gap: 16rpx;
}

.date-item {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  
  &.active {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.2) 100%);
    border-color: #ffd700;
  }
  
  .date-text {
    color: #ffffff;
    font-size: 24rpx;
  }
}

/* ========== 记录内容区域 ========== */
.records-content {
  padding: 0 40rpx 40rpx;
}

.records-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  
  .section-icon {
    font-size: 24rpx;
    margin-right: 16rpx;
  }
  
  .section-title {
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
  }
  
  .section-count {
    color: rgba(255, 255, 255, 0.6);
    font-size: 22rpx;
    margin-left: 12rpx;
  }
}

/* ========== 输赢记录汇总卡片 ========== */
.summary-cards {
  display: flex;
  gap: 20rpx;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.summary-card {
  flex: 1;
  padding: 24rpx;
  border-radius: 16rpx;
  text-align: center;
  
  .card-label {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 22rpx;
    margin-bottom: 8rpx;
  }
  
  .card-value {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
  }
  
  &.win-card {
    background: rgba(16, 185, 129, 0.2);
    border: 1rpx solid rgba(16, 185, 129, 0.3);
    
    .card-value {
      color: #10b981;
    }
  }
  
  &.lose-card {
    background: rgba(239, 68, 68, 0.2);
    border: 1rpx solid rgba(239, 68, 68, 0.3);
    
    .card-value {
      color: #ef4444;
    }
  }
}

/* ========== 记录列表 ========== */
.records-list {
  padding: 20rpx 0;
}

.record-item {
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
}

/* 投注记录项 */
.bet-item {
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    
    .game-name {
      color: #ffffff;
      font-size: 26rpx;
      font-weight: 600;
    }
    
    .bet-time {
      color: rgba(255, 255, 255, 0.6);
      font-size: 20rpx;
    }
  }
  
  .item-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .bet-info, .result-info {
      display: flex;
      align-items: center;
      
      .bet-label, .result-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 22rpx;
        margin-right: 8rpx;
      }
      
      .bet-amount {
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 600;
      }
      
      .result-value {
        font-size: 22rpx;
        font-weight: 600;
        
        &.win-result {
          color: #10b981;
        }
        
        &.lose-result {
          color: #ef4444;
        }
      }
    }
  }
}

/* 输赢记录项 */
.winlose-item {
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
    
    .game-name {
      color: #ffffff;
      font-size: 26rpx;
      font-weight: 600;
    }
    
    .record-time {
      color: rgba(255, 255, 255, 0.6);
      font-size: 20rpx;
    }
  }
  
  .item-body {
    .amount-info {
      text-align: right;
      
      .amount-value {
        font-size: 28rpx;
        font-weight: 600;
        
        &.win-amount {
          color: #10b981;
        }
        
        &.lose-amount {
          color: #ef4444;
        }
      }
    }
  }
}

/* 钱包流水项 */
.wallet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.transaction-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  font-size: 20rpx;
  
  &.deposit-icon {
    background: rgba(16, 185, 129, 0.2);
    border: 1rpx solid rgba(16, 185, 129, 0.3);
  }
  
  &.withdraw-icon {
    background: rgba(245, 158, 11, 0.2);
    border: 1rpx solid rgba(245, 158, 11, 0.3);
  }
  
  &.bet-icon {
    background: rgba(59, 130, 246, 0.2);
    border: 1rpx solid rgba(59, 130, 246, 0.3);
  }
  
  &.win-icon {
    background: rgba(16, 185, 129, 0.2);
    border: 1rpx solid rgba(16, 185, 129, 0.3);
  }
}

.transaction-info {
  flex: 1;
  
  .transaction-title {
    display: block;
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 600;
    margin-bottom: 4rpx;
  }
  
  .transaction-time {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 20rpx;
  }
}

.item-right {
  .transaction-amount {
    font-size: 26rpx;
    font-weight: 600;
    
    &.income {
      color: #10b981;
    }
    
    &.expense {
      color: #ef4444;
    }
  }
}

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
  
  .empty-icon {
    font-size: 60rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }
  
  .empty-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 24rpx;
  }
}
</style>