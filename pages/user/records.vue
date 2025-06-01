<template>
  <!-- 交易记录页面 - 真实接口版本 -->
  <view class="records-page">
    
    <!-- 顶部导航栏 -->
    <view class="records-header">
      <view class="header-back" @click="goBack">
        <text class="back-text">← 返回</text>
      </view>
      <view class="header-title">
        <text>交易记录</text>
        <text class="title-en">TRANSACTION RECORDS</text>
      </view>
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

    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 记录内容区域 -->
    <view class="records-content" v-else>
      
      <!-- 投注记录 -->
      <view class="records-section" v-if="activeType === 'bet'">
        <view class="section-header">
          <text class="section-icon">📝</text>
          <text class="section-title">投注记录</text>
          <text class="section-count">({{ betRecords.length }}条)</text>
        </view>
        
        <scroll-view 
          class="records-scroll" 
          scroll-y="true" 
          @scrolltolower="loadMoreBetRecords"
          v-if="betRecords.length > 0"
        >
          <view class="records-list">
            <view 
              class="record-item bet-item"
              v-for="record in betRecords"
              :key="record.id"
              @click="viewBetDetail(record)"
            >
              <view class="item-header">
                <text class="game-name">{{ record.type_name }}</text>
                <text class="bet-time">{{ record.created_at }}</text>
              </view>
              <view class="item-body">
                <view class="bet-info">
                  <text class="bet-label">投注金额：</text>
                  <text class="bet-amount">${{ record.bet_amt }}</text>
                </view>
                <view class="result-info">
                  <text class="result-label">输赢：</text>
                  <text class="result-value" :class="getResultClass(record.win_amt)">
                    {{ getResultText(record.win_amt) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 加载更多提示 -->
          <view class="load-more" v-if="hasMoreBet">
            <text class="load-more-text">加载更多...</text>
          </view>
          <view class="no-more" v-else-if="betRecords.length > 0">
            <text class="no-more-text">没有更多数据</text>
          </view>
        </scroll-view>
        
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
        
        <!-- 统计汇总 -->
        <view class="summary-cards" v-if="summaryData">
          <view class="summary-card win-card">
            <text class="card-label">总赢利</text>
            <text class="card-value">+${{ summaryData.count_win_amt || 0 }}</text>
          </view>
          <view class="summary-card lose-card">
            <text class="card-label">总下注</text>
            <text class="card-value">${{ summaryData.count_bet_amt || 0 }}</text>
          </view>
        </view>
        
        <scroll-view 
          class="records-scroll" 
          scroll-y="true" 
          @scrolltolower="loadMoreWinloseRecords"
          v-if="winloseRecords.length > 0"
        >
          <view class="records-list">
            <view 
              class="record-item winlose-item"
              v-for="record in winloseRecords"
              :key="record.id || record.dates"
            >
              <view class="item-header">
                <text class="game-name">{{ record.dates }}</text>
                <text class="record-time">{{ record.dates }}</text>
              </view>
              <view class="item-body">
                <view class="amount-info">
                  <text class="amount-value" :class="record.game_win_count > 0 ? 'win-amount' : 'lose-amount'">
                    {{ record.game_win_count > 0 ? '+' : '' }}${{ record.game_win_count }}
                  </text>
                </view>
              </view>
            </view>
          </view>
          
          <view class="load-more" v-if="hasMoreWinlose">
            <text class="load-more-text">加载更多...</text>
          </view>
          <view class="no-more" v-else-if="winloseRecords.length > 0">
            <text class="no-more-text">没有更多数据</text>
          </view>
        </scroll-view>
        
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
        
        <scroll-view 
          class="records-scroll" 
          scroll-y="true" 
          @scrolltolower="loadMoreWalletRecords"
          v-if="walletRecords.length > 0"
        >
          <view class="records-list">
            <view 
              class="record-item wallet-item"
              v-for="record in walletRecords"
              :key="record.id"
            >
              <view class="item-left">
                <view class="transaction-icon" :class="getTransactionClass(record.status)">
                  <text>{{ getTransactionIcon(record.status) }}</text>
                </view>
                <view class="transaction-info">
                  <text class="transaction-title">{{ getTransactionTitle(record.status) }}</text>
                  <text class="transaction-time">{{ record.create_time }}</text>
                </view>
              </view>
              <view class="item-right">
                <text class="transaction-amount" :class="record.money > 0 ? 'income' : 'expense'">
                  {{ record.money > 0 ? '+' : '' }}${{ Math.abs(record.money) }}
                </text>
              </view>
            </view>
          </view>
          
          <view class="load-more" v-if="hasMoreWallet">
            <text class="load-more-text">加载更多...</text>
          </view>
          <view class="no-more" v-else-if="walletRecords.length > 0">
            <text class="no-more-text">没有更多数据</text>
          </view>
        </scroll-view>
        
        <view class="empty-state" v-else>
          <text class="empty-icon">💳</text>
          <text class="empty-text">暂无钱包流水</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/api/log"

export default {
  name: 'UserRecordsPage',
  
  data() {
    return {
      activeType: 'bet',
      activeDate: 'today',
      loading: false,
      
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
      
      // 真实数据
      betRecords: [],
      winloseRecords: [],
      walletRecords: [],
      summaryData: null,
      
      // 分页参数
      betPage: { page: 1, limit: 20 },
      winlosePage: { page: 1, limit: 20 },
      walletPage: { page: 1, limit: 20 },
      
      // 分页状态
      hasMoreBet: true,
      hasMoreWinlose: true,
      hasMoreWallet: true
    }
  },
  
  onLoad() {
    this.loadData()
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
      this.loadData()
    },
    
    /**
     * 切换日期筛选
     */
    switchDate(date) {
      this.activeDate = date
      this.resetPagination()
      this.loadData()
    },
    
    /**
     * 重置分页
     */
    resetPagination() {
      this.betPage.page = 1
      this.winlosePage.page = 1
      this.walletPage.page = 1
      this.betRecords = []
      this.winloseRecords = []
      this.walletRecords = []
      this.hasMoreBet = true
      this.hasMoreWinlose = true
      this.hasMoreWallet = true
    },
    
    /**
     * 获取日期类型
     */
    getDateType() {
      const typeMap = {
        'today': 1,
        'yesterday': 2,
        'week': 3,
        'month': 4,
        'earlier': 0
      }
      return typeMap[this.activeDate] || 1
    },
    
    /**
     * 加载数据
     */
    loadData() {
      if (this.activeType === 'bet') {
        this.loadBetRecords()
      } else if (this.activeType === 'winlose') {
        this.loadWinloseRecords()
      } else if (this.activeType === 'wallet') {
        this.loadWalletRecords()
      }
    },
    
    /**
     * 加载投注记录
     */
    async loadBetRecords() {
      if (this.loading || !this.hasMoreBet) return
      
      this.loading = true
      try {
        const params = {
          type: this.getDateType(),
          page: this.betPage.page,
          limit: this.betPage.limit
        }
        
        const response = await api.bet_list_log(params)
        
        if (response.data.code === 200) {
          const newRecords = response.data.data.data || []
          
          if (this.betPage.page === 1) {
            this.betRecords = newRecords
          } else {
            this.betRecords.push(...newRecords)
          }
          
          // 处理详情数组
          this.betRecords.forEach(record => {
            if (record.detail) {
              record.detailArr = record.detail.split('：')
            }
          })
          
          this.hasMoreBet = newRecords.length >= this.betPage.limit
        }
      } catch (error) {
        console.error('加载投注记录失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    /**
     * 加载输赢记录
     */
    async loadWinloseRecords() {
      if (this.loading || !this.hasMoreWinlose) return
      
      this.loading = true
      try {
        const params = {
          type: this.getDateType(),
          page: this.winlosePage.page,
          limit: this.winlosePage.limit
        }
        
        const response = await api.betlog(params)
        
        if (response.data.code === 200) {
          const data = response.data.data
          
          // 统计数据
          if (this.winlosePage.page === 1) {
            this.summaryData = data.count
          }
          
          const newRecords = data.data?.data || []
          
          if (this.winlosePage.page === 1) {
            this.winloseRecords = newRecords
          } else {
            this.winloseRecords.push(...newRecords)
          }
          
          this.hasMoreWinlose = newRecords.length >= this.winlosePage.limit
        }
      } catch (error) {
        console.error('加载输赢记录失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    /**
     * 加载钱包流水
     */
    async loadWalletRecords() {
      if (this.loading || !this.hasMoreWallet) return
      
      this.loading = true
      try {
        const params = {
          type: this.getDateType(),
          page: this.walletPage.page,
          limit: this.walletPage.limit
        }
        
        const response = await api.money_out_log(params)
        
        if (response.data.code === 200) {
          const newRecords = response.data.data.data || []
          
          if (this.walletPage.page === 1) {
            this.walletRecords = newRecords
          } else {
            this.walletRecords.push(...newRecords)
          }
          
          this.hasMoreWallet = newRecords.length >= this.walletPage.limit
        }
      } catch (error) {
        console.error('加载钱包流水失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    /**
     * 加载更多投注记录
     */
    loadMoreBetRecords() {
      if (this.hasMoreBet && !this.loading) {
        this.betPage.page++
        this.loadBetRecords()
      }
    },
    
    /**
     * 加载更多输赢记录
     */
    loadMoreWinloseRecords() {
      if (this.hasMoreWinlose && !this.loading) {
        this.winlosePage.page++
        this.loadWinloseRecords()
      }
    },
    
    /**
     * 加载更多钱包流水
     */
    loadMoreWalletRecords() {
      if (this.hasMoreWallet && !this.loading) {
        this.walletPage.page++
        this.loadWalletRecords()
      }
    },
    
    /**
     * 查看投注详情
     */
    async viewBetDetail(record) {
      try {
        const response = await api.getResultGamePoker({ id: record.lu_zhu_id })
        
        if (response.data.code === 200) {
          // 显示开牌结果
          const resultInfo = response.data.data
          // 这里可以显示详细的开牌结果
          console.log('开牌结果:', resultInfo)
        }
      } catch (error) {
        console.error('获取开牌结果失败:', error)
      }
    },
    
    /**
     * 获取结果样式类
     */
    getResultClass(amount) {
      return amount > 0 ? 'win-result' : 'lose-result'
    },
    
    /**
     * 获取结果文本
     */
    getResultText(amount) {
      return amount > 0 ? `+$${amount}` : amount < 0 ? `-$${Math.abs(amount)}` : '$0'
    },
    
    /**
     * 获取交易类型样式
     */
    getTransactionClass(status) {
      const classes = {
        '充值': 'deposit-icon',
        '提现': 'withdraw-icon',
        '投注': 'bet-icon',
        '中奖': 'win-icon'
      }
      return classes[status] || 'default-icon'
    },
    
    /**
     * 获取交易图标
     */
    getTransactionIcon(status) {
      const icons = {
        '充值': '💰',
        '提现': '💸',
        '投注': '🎲',
        '中奖': '🎉'
      }
      return icons[status] || '💳'
    },
    
    /**
     * 获取交易标题
     */
    getTransactionTitle(status) {
      return status || '未知交易'
    }
  }
}
</script>


<style lang="scss" scoped>
	/* 继承原有样式，添加新增样式 */
	
	.loading-state {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  padding: 80rpx;
	  
	  .loading-text {
	    color: rgba(255, 255, 255, 0.6);
	    font-size: 24rpx;
	  }
	}
	
	.records-scroll {
	  max-height: 600rpx;
	}
	
	.load-more, .no-more {
	  display: flex;
	  justify-content: center;
	  padding: 30rpx;
	  
	  .load-more-text, .no-more-text {
	    color: rgba(255, 255, 255, 0.5);
	    font-size: 22rpx;
	  }
	}
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