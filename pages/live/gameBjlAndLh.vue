<template>
  <view class="live-page" id="live-page">
    <!-- 连接状态指示器 -->
    <view class="socket-status" v-if="!socketStatus.isConnected && show_websocket_tips">
      <view class="status-indicator">
        <u-icon name="wifi-off" color="#ff4444" size="20" />
        <text>连接中...</text>
        <text v-if="socketStatus.reconnectAttempts > 0">
          重连次数: {{ socketStatus.reconnectAttempts }}
        </text>
      </view>
    </view>
    
    <!-- 加载组件 -->
    <Loading 
      ref="loading" 
      :custom="false" 
      :shadeClick="false" 
      :type="3"
    />
    
    <!-- 主要内容区域 -->
    <view class="live-container" v-if="this.loadingState_tableDataInfo == 1">
      
      <!-- 头部组件 开始 -->
      <headbar 
        ref="headBar" 
        :tableType="tableType" 
        :tableDataInfo="initTableInfo" 
        :tableRunInfo="tableRunInfo"
        @headerBack="handleHeaderBack"
      />
      
      <!-- APP端头部位置占位 -->
      <!-- #ifdef APP-PLUS -->
      <view class="for_header_postion"></view>
      <!-- #endif -->
      <!-- 头部组件 结束 -->
      
      <!-- 视频显示区域 开始 -->
      <view class="live-box">
        <!-- 默认加载背景 -->
        <view class="live-loading" v-if="!videoFar && !videoNear">
          <view class="live-loading-panel">
            <image 
              class="live-loading-img" 
              src="/static/img/live/loading.svg" 
              mode=""
            />
            <view class="">
              {{ liveLocales.selectNetwork }}
            </view>
          </view>
        </view>
        
        <!-- 优化后的视频容器 - 支持整体缩放效果 -->
        <view class="video-container" :class="zoomEffectClass">
          
          <!-- 远景视频层 - 始终加载 -->
          <view 
            class="video-layer" 
            :class="{
              'layer-active': !videoEnlarge,
              'layer-hidden': videoEnlarge
            }"
          >
            <iframe 
              v-if="videoFar"
              class="live-details"
              frameborder="0" 
              scrolling="no" 
              :src="videoFar"
              @load="onVideoLoaded('far')"
            ></iframe>
          </view>
          
        </view>
        
        <!-- 倒计时圈圈 -->
        <view class="live-count-down" v-if="endTime > 0">
          <circleProgress 
            :percent="percent" 
            :size="50" 
            :circleWidth="2" 
            :circleColor="activeColor" 
            :innerbgColor="innerbgColor" 
            :defaultColor="defaultColor"
          >
            <text 
              class="live-count-second" 
              :class="{'live-active-color': endTime < 6}"
            >
              {{ endTime }}
            </text>
          </circleProgress>
        </view>
        
        <!-- 洗牌状态标记 -->
        <view 
          class="live-shuffle" 
          v-if="tableRunInfo.wash_status == 1"
        >
          {{ $locales.index.shuffle }}
        </view>
        
        <!-- 消息状态通知栏 -->
        <view class="live-notice" v-if="showMsgOpen">
          {{ activityDescribeText }}
        </view>
        <view class="live-notice" v-if="showWinMsgOpen">
          {{ showWinMsgText }}
        </view>
        
      </view>
      <!-- 视频显示区域 结束 -->
      
      <!-- 统计数据 - 百家乐 -->
      <view class="live-result-detail" v-if="game_type_id == 3">
        <text class="live-online-users">在线:{{ onlineUsers }}</text>
        <text class="live-bet-amount">投注:{{ formatBetAmount(betAmount) }}</text>
        <text class="live-de-zhuang">{{ indexLocales.itemZhuang }}:{{ betCountDetails.zhuang || 0 }}</text>
        <text class="live-de-xian">{{ indexLocales.itemXian }}:{{ betCountDetails.xian || 0 }}</text>
        <text class="live-de-he">{{ indexLocales.itemHe }}:{{ betCountDetails.he || 0 }}</text>
        <text class="live-de-zhuang">{{ indexLocales.itemZhuangDui }}:{{ betCountDetails.zhuang_dui || 0 }}</text>
        <text class="live-de-xian">{{ indexLocales.itemXianDui }}:{{ betCountDetails.xian_dui || 0 }}</text>
        <text>{{ liveLocales.totalGames }}:{{ betCountDetails.count || 0 }}</text>
      </view>

      <!-- 统计数据 - 龙虎 -->
      <view class="live-result-detail" v-if="game_type_id == 2">
        <text class="live-online-users">在线:{{ onlineUsers }}</text>
        <text class="live-bet-amount">投注:{{ formatBetAmount(betAmount) }}</text>
        <text class="live-de-zhuang">{{ liveLocales.dragon }}:{{ betCountDetails.zhuang || 0 }}</text>
        <text class="live-de-xian">{{ liveLocales.tiger }}:{{ betCountDetails.xian || 0 }}</text>
        <text class="live-de-he">{{ liveLocales.peace }}:{{ betCountDetails.he || 0 }}</text>
        <text>{{ liveLocales.totalGames }}:{{ betCountDetails.count || 0 }}</text>
      </view>
      
      <!-- 投注区域 -->
      <view class="live-bet-box">
        <!-- 投注区域加载背景 -->
        <view class="live-loading">
          <view class="live-loading-panel">
            <image 
              class="live-loading-img" 
              src="/static/img/live/loading.svg" 
              mode=""
            />
            <view class="">
              {{ liveLocales.selectNetwork }}
            </view>
          </view>
        </view>
        
        <!-- 投注iframe -->
        <iframe 
          class="live-bet" 
          id="betIframe" 
          frameborder="0" 
          scrolling="no" 
          :src="`${configService.betUrl}/bjlLh?table_id=${tableId}&game_type=${game_type_id}&user_id=${userInformation.id}&token=${userToken}`"
        ></iframe>
      </view>
      
      <!-- 露珠显示区域 -->
      <view class="lz_details" :style="{ height: luzhuHeight+ 'px' }">
        <!-- 露珠加载背景 -->
        <view 
          class="live-loading" 
          @click="reloadLuzhu()"
        >
          <view class="live-loading-panel">
            <view class="">
              {{ liveLocales.selectNetwork }}, 点击刷新露珠
            </view>
          </view>
        </view>
        
        <!-- 露珠iframe -->
        <iframe 
          class="live-details-lz" 
          id="live_details_lz" 
          name="liveDetailsLz" 
          :src="luzhuSrc"
          :key="luzhuKey"
        ></iframe>
      </view>
    </view>
  </view>
</template>

<script>
// 组件导入
import headbar from './head.vue'
import circleProgress from '@/components/circle-progress/progress.vue'
import fProgress from '@/components/f-progress/f-progress.vue'
import welcomeMsg from '@/components/live/welcome.vue'
import Loading from '@/components/loading/loading.vue'

// 导入业务逻辑
import gameLogic from './gameBjlAndLh.js'

export default {
  components: {
    Loading,
    headbar,
    circleProgress,
    welcomeMsg,
    fProgress
  },
  
  // 合并业务逻辑
  data() {
    return gameLogic.data.call(this)
  },
  
  onLoad(option) {
    gameLogic.onLoad.call(this, option)
  },
  
  onShow() {
    gameLogic.onShow.call(this)
  },
  
  onHide() {
    gameLogic.onHide.call(this)
  },
  
  onUnload() {
    gameLogic.onUnload.call(this)
  },
  
  mounted() {
    gameLogic.mounted.call(this)
  },
  
  beforeDestroy() {
    gameLogic.beforeDestroy.call(this)
  },
  
  methods: {
    ...gameLogic.methods,
    
    // 添加缺失的方法
    handleZoom() {
      this.videoEnlarge = !this.videoEnlarge
    },
    
    refreshIframe() {
      this.startAnimation = true
      setTimeout(() => {
        this.startAnimation = false
      }, 1000)
      
      // 刷新视频
      this.getTableInfoVideo()
    },
    
    onVideoLoaded(type) {
      console.log('视频加载完成:', type)
    },
    
    handleHeaderBack() {
      // 处理头部返回事件
      console.log('头部返回事件')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './gameBjlAndLh.css';
</style>