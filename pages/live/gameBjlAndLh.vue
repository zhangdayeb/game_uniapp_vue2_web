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
          
          <!-- 近景视频层 - 始终加载 -->
<!--          <view 
            class="video-layer" 
            :class="{
              'layer-active': videoEnlarge,
              'layer-hidden': !videoEnlarge
            }"
          >
            <iframe 
              v-if="videoNear"
              class="live-details"
              frameborder="0" 
              scrolling="no" 
              :src="videoNear"
              @load="onVideoLoaded('near')"
            ></iframe>
          </view> -->
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
        
        <!-- 视频控制按钮 - 保持原有功能 -->
        <view class="video-controls">
          <!-- 放大缩小按钮 - 保持远景/近景切换功能 -->
<!--          <view class="control-btn" @click="handleZoom()">
            <image 
              src="/static/img/live/enlarge.svg" 
              mode="" 
              v-if="!videoEnlarge" 
              class="control-icon"
            />
            <image 
              src="/static/img/live/reduce.svg" 
              mode="" 
              v-if="videoEnlarge" 
              class="control-icon"
            />
          </view> -->
          
          <!-- 刷新按钮 - 优化为仅在必要时使用 -->
<!--          <view class="control-btn" @tap="refreshIframe()">
            <u-icon 
              :class="{'video-animation': startAnimation}" 
              name="reload" 
              color="#ffffbc" 
              size="24"
            />
          </view> -->
        </view>
      </view>
      <!-- 视频显示区域 结束 -->
      
	<!-- 统计数据 - 百家乐 -->
	<view class="live-result-detail" v-if="game_type_id == 3">
	  <text class="live-online-users">{{ liveLocales.onlineUsers || '在线' }}:{{ onlineUsers }}</text>
	  <text class="live-de-zhuang">{{ indexLocales.itemZhuang }}:{{ betCountDetails.zhuang || 0 }}</text>
	  <text class="live-de-xian">{{ indexLocales.itemXian }}:{{ betCountDetails.xian || 0 }}</text>
	  <text class="live-de-he">{{ indexLocales.itemHe }}:{{ betCountDetails.he || 0 }}</text>
	  <text class="live-de-zhuang">{{ indexLocales.itemZhuangDui }}:{{ betCountDetails.zhuang_dui || 0 }}</text>
	  <text class="live-de-xian">{{ indexLocales.itemXianDui }}:{{ betCountDetails.xian_dui || 0 }}</text>
	  <text>{{ liveLocales.totalGames }}:{{ betCountDetails.count || 0 }}</text>
	</view>

	<!-- 统计数据 - 龙虎 -->
	<view class="live-result-detail" v-if="game_type_id == 2">
	  <text class="live-online-users">{{ liveLocales.onlineUsers || '在线' }}:{{ onlineUsers }}</text>
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
import user from "@/api/api"
import api from "@/api/table"
import circleProgress from '@/components/circle-progress/progress.vue'
import fProgress from '@/components/f-progress/f-progress.vue'
import welcomeMsg from '@/components/live/welcome.vue'
import Bus from "@/common/util/bus.js"
import tools from '@/common/util/tools.js'
import Loading from '@/components/loading/loading.vue'

// 导入JS服务
import apiService from '@/api/game.js'
// 导入优化后的Socket管理器
import { GameSocketManager } from '@/utils/socket-manager.js'
// 导入配置文件
import configService from '@/common/service/config.service.js'

// 音乐类型常量 - 背景音乐和音效
const MUSIC_TYPE = {
  backgroundMusicState: 'backgroundMusicState',
  musicEffectSate: 'musicEffectSate'
}

export default {
  components: {
    Loading,
    headbar,
    circleProgress,
    welcomeMsg,
    fProgress
  },
  
  data() {
    return {
      // 国际化相关
      indexLocales: this._i18n.messages[this.$storageLan].index,
      liveLocales: this._i18n.messages[this.$storageLan].live,
      
      // 基本配置
      tableType: 'dianji', // 传递给组件的类型
      game_type_id: 3, // 游戏类型设定 1=牛牛 2=龙虎 3=百家乐 (onload会重载)
      lzUrl: '', // 露珠URL
      welcomeMsg: '欢迎光临XXX游戏', // 欢迎光临信息
      tableId: -1, // table_id 当前桌子的ID
      
      // 消息提示相关
      startShowWelcomeTime: 35, // 当秒数为这个时，提示已开局，请下注
      showMsgOpen: false, // 显示提示信息 默认关闭
      showMsgOpenTime: 3500, // 提示消息时间长短
      stopMusicHasPlayed: false, // 防止无限播放停止音效
      
      // 用户信息
      userInformation: {}, // 用户基本信息 用来检测用户是否登录
      userToken: uni.getStorageSync('Access-Token'),
      
      // 游戏数据
      betCountDetails: {}, // 当前台桌所有用户下注的真实统计信息
      bureauNumber: '', // 靴号铺号 用来判断数据是否是新的数据
      resultInfo: {}, // 开牌信息
      initTableInfo: {}, // 初始化台桌信息仓库
      tableRunInfo: {}, // 牌桌运行信息
            
      // 倒计时和进度相关
      percent: 100, // 进度圆圈的倒计时
      getInfotimerHandle: null, // 定时句柄 后台获取游戏状态的句柄
      activeColor: '#78E07A', // 激活倒计时颜色
      innerbgColor: 'RGB(0,0,0,.6)', // 圈内颜色
      defaultColor: 'rgb(135,135,135,.1)', // 圆环底部颜色
      endTime: -99, // tableRunInfo.end_time
      
      // 消息和状态
      activityDescribeText: '', // 活动描述
      showBeginning: false, // 展示开局中
      played: 'init', // 是否投注过
      pageVisibility: false, // 页面可视状态
      welcomePlayed: false, // 是否播放过欢迎光临
      showWelcomeMsg: false, // 所有浏览器进入
      showWinMsgOpen: false, // 输赢展示
      showWinMsgText: '', // 输赢展示文本
      
      // 视频相关 - 优化后的状态管理
      videoLoadState: true, // 视频加载状态
      videoEnlarge: false, // 视频远近景切换按钮 - 保持原有功能
      videoFar: '', // 远景地址 后台获取
      videoNear: '', // 近景地址 后台获取
      startAnimation: false, // 刷新动画
      zoomEffectClass: 'normal', // 新增：控制缩放效果
      videoLoadStatus: { // 新增：跟踪视频加载状态
        far: false,
        near: false
      },
      
      // 页面状态相关
      visibilityChangeEvent: '', // 可视页面事件
      hiddenProperty: '', // 兼容各种页面隐藏
      pageHiddenTimer: null,
      maintainData: {}, // 维护状态数据
      
      // 龙虎输赢状态常量
      winState: {
        dragon: 1, // 龙赢
        tiger: 2, // 虎赢
        peace: 3 // 和
      },
      
      // 状态标记
      receiveResultState: false, // 接收结果状态
      audioState: {}, // 音频播放状态
      
      // 各种加载状态
      loadingState_tableDataInfo: 0, // 台桌静态信息状态 -> 影响投注状态
      
      // Socket相关
      configService: configService, // 初始化服务配置项目
	  show_websocket_tips:false, // 是否展示 websocket 链接状态 默认关闭
      
      // Socket相关状态
      gameSocket: null,
      socketStatus: {
        isConnected: false,
        reconnectAttempts: 0,
        latency: 0,
        lastMessageTime: 0
      },
      connectionRetryTimer: null,
      isManualDisconnect: false, // 标记是否为手动断开
	  
      // 记录已刷新露珠的局号
      lastRefreshedBureau: null,
      isRefreshingLuzhu: false,
      // 露珠刷新 动态
      luzhuSrc: '',
      luzhuKey: 1,
      luzhuTimestamp: Date.now(),
	  
	  // 露珠宽高
	  aspectRatio:2.7,
	  luzhuHeight:0,
	  screenWidth:0,
	  
	   onlineUsers: 0, // 在线人数
	   onlineTimer: null, // 在线人数更新定时器
	   lastOnlineUpdate: 0, // 上次更新时间
    }
  },
  
  /**
   * 页面初始化
   * @param {Object} option - 路由参数
   */
  onLoad(option) {
    // 初始化基本参数
    this.tableId = option.table_id
    this.tablePre = option.game_type_id + '_' + option.table_id + '_storage_flag_'
    this.userInformation = uni.getStorageSync('login_user_info')
    
    // 存储路由参数
    uni.setStorageSync('routerParams', {
      table_id: option.table_id,
      game_type_id: option.game_type_id
    })
    
    this.showWelcomeMsg = true
    this.game_type_id = option.game_type_id
    
    // 根据游戏类型设置露珠URL
    if (option.game_type_id == 3) {
      // 百家乐
      this.lzUrl = configService.lzBjlUrlMain + this.liveLocales.lzurl + '/bjl_xc_big_678.html'
    }
    if (option.game_type_id == 2) {
      // 龙虎
      this.lzUrl = configService.lzLhUrlMain + this.liveLocales.lzurl + '/lh_bet_xc.html'
    }
    
    // 初始化Socket
    this.initSocket()
  },
  
  /**
   * 页面前台展示
   */
  onShow() {
    // 获取通知列表
    this.getNoticeList()
    // 设置页面状态
    uni.setStorageSync('LivePageState', 'show')
    // 启动音频
    this.switchAudioByBrowerStart()
    // 是否主动断开
    this.isManualDisconnect = false
    // 连接Socket
    this.connectGameSocket()
	// 动态露珠高度 让问路可以显示全
	// 使用 uni.getSystemInfo() 获取屏幕信息
	uni.getSystemInfo({
	  success: (res) => {
	    this.screenWidth = res.windowWidth // 屏幕宽度（px）
		this.luzhuHeight =  Math.floor(this.screenWidth / this.aspectRatio)
	  }
	})
	this.startOnlineTimer() // 页面显示时启动
  },
  
  /**
   * 组件挂载
   */
  mounted() {
    this.luzhuTimestamp = Date.now()
    this.luzhuSrc = `${this.lzUrl}?tableId=${this.tableId}&user_id=${this.userInformation.id}&t=${this.luzhuTimestamp}`
    // 显示加载动画
    this.$refs.loading.open()
    
    // H5端设置页面隐藏属性
    //#ifdef H5
    this.setHiddenProperty()
    //#endif
    
    // 页面滚动到顶部
    setTimeout(() => {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }, 600)
    
    // 设置页面状态
    uni.setStorageSync('LivePageState', 'show')
    
    // 一次性初始化操作
    this.getTableInfoVideo() // 获取台桌视频
    this.getGameTableInfoInit() // 获取台桌初始化信息
    this.getGameBetCount() // 获取游戏下注信息
    this.addEventSettingMusic() // 添加音效设置监听
    
    // 关闭加载动画
    setTimeout(() => {
      this.$refs.loading.close()
    }, 4000)
    
    // Socket状态监控
    setInterval(() => {
      const status = {
        isConnected: this.socketStatus.isConnected,
        gameSocket: !!this.gameSocket,
        endTime: this.endTime,
        percent: this.percent
      }
      console.log('Socket状态详情:', status)
    }, 10000)
	
	this.initOnlineUsers() // 初始化在线人数
  },
  
  /**
   * 页面后台运行
   */
  onHide() {
    this.clearTimersAndConnections()
    uni.setStorageSync('LivePageState', 'hidden')
    this.switchAudioByBrowerStop()
    this.isManualDisconnect = true
    this.disconnectSocket()
	this.stopOnlineTimer() // 页面隐藏时停止
  },
  
  /**
   * 页面退出
   */
  onUnload() {
    this.clearTimersAndConnections()
    uni.setStorageSync('LivePageState', 'hidden')
    this.switchAudioByBrowerStop()
    this.isManualDisconnect = true
    this.disconnectSocket()
  },
  
  /**
   * 组件销毁
   */
  beforeDestroy() {
    this.clearTimersAndConnections()
    uni.setStorageSync('LivePageState', 'hidden')
    this.switchAudioByBrowerStop()
    this.isManualDisconnect = true
    this.disconnectSocket()
    Bus.$off('setMusicType', this.addEventSettingMusic())
	this.stopOnlineTimer() // 页面隐藏时停止
  },
  
  methods: {
	/**
	   * 初始化在线人数
	   */
	  initOnlineUsers() {
	    // 设置初始值（200-9000范围）
	    this.onlineUsers = Math.floor(Math.random() * (9000 - 200 + 1)) + 200
	    this.startOnlineTimer()
	  },
	  
	  /**
	   * 启动在线人数定时器
	   */
	  startOnlineTimer() {
	    this.stopOnlineTimer() // 先清除现有定时器
	    
	    this.onlineTimer = setInterval(() => {
	      this.updateOnlineUsers()
	    }, this.getRandomInterval())
	  },
	  
	  /**
	   * 停止在线人数定时器
	   */
	  stopOnlineTimer() {
	    if (this.onlineTimer) {
	      clearInterval(this.onlineTimer)
	      this.onlineTimer = null
	    }
	  },
	  
	  /**
	   * 更新在线人数
	   */
	  updateOnlineUsers() {
	    const currentTime = Date.now()
	    
	    // 防止更新过于频繁
	    if (currentTime - this.lastOnlineUpdate < 25000) {
	      return
	    }
	    
	    // 计算新的在线人数（小幅度变化）
	    const changeRange = Math.floor(this.onlineUsers * 0.05) // 变化幅度为当前值的5%
	    const change = Math.floor(Math.random() * (changeRange * 2 + 1)) - changeRange
	    
	    let newUsers = this.onlineUsers + change
	    
	    // 确保在合理范围内
	    newUsers = Math.max(200, Math.min(9000, newUsers))
	    
	    this.onlineUsers = newUsers
	    this.lastOnlineUpdate = currentTime
	    
	    // 重新设置定时器（随机间隔）
	    this.startOnlineTimer()
	  },
	  
	  /**
	   * 获取随机更新间隔（30-60秒）
	   */
	  getRandomInterval() {
	    return Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000
	  },
    /**
     * 备用提示方法
     */
    showToast(message) {
	  if(this.show_websocket_tips){
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
    },

    showAlert(message) {
      if (this.$tip && this.$tip.alert) {
        this.$tip.alert(message)
      } else {
        uni.showModal({
          title: '提示',
          content: message,
          showCancel: false
        })
      }
    },

    /**
     * 检查JSON有效性
     */
    isValidJSON(str) {
      try {
        JSON.parse(str)
        return true
      } catch (e) {
        return false
      }
    },
    
    /**
     * 初始化Socket管理器
     */
    initSocket() {
      this.gameSocket = new GameSocketManager()
      
      // 监听连接打开
      this.gameSocket.on('open', () => {
        console.log('Game socket connected successfully')
        this.socketStatus.isConnected = true
        this.socketStatus.reconnectAttempts = 0
        this.$forceUpdate()
        
        // 连接成功后的处理
        this.onSocketConnected()
      })

      // 监听消息接收
      this.gameSocket.on('message', (data) => {
        this.socketStatus.lastMessageTime = Date.now()
        this.handleSocketMessage(data)
      })

      // 监听连接关闭
      this.gameSocket.on('close', (event) => {
        console.log('Game socket disconnected', event)
        this.socketStatus.isConnected = false
        this.$forceUpdate()
        
        if (!this.isManualDisconnect) {
          this.showToast('连接已断开，正在重连...')
        }
      })

      // 监听重连尝试
      this.gameSocket.on('reconnecting', (attempts) => {
        console.log(`Socket reconnecting... attempt ${attempts}`)
        this.socketStatus.reconnectAttempts = attempts
        this.$forceUpdate()
        
        if (attempts <= 3) {
          this.showToast(`重连中... (${attempts}/5)`)
        }
      })

      // 监听心跳响应
      this.gameSocket.on('pong', ({ latency }) => {
        this.socketStatus.latency = latency
        console.log(`Socket latency: ${latency}ms`)
      })

      // 监听错误
      this.gameSocket.on('error', (error) => {
        console.error('Socket error:', error)
        if (!this.isManualDisconnect) {
          this.showToast('网络连接异常')
        }
      })

      // 监听达到最大重连次数
      this.gameSocket.on('maxReconnectAttemptsReached', () => {
        console.log('Max reconnect attempts reached')
		this.showToast('网络连接失败，请检查网络后重新进入')
      })
    },

    /**
     * 连接游戏Socket
     */
    async connectGameSocket() {
      if (!this.gameSocket || this.isManualDisconnect) {
        return
      }

      try {
        // 更新音效状态
        this.updateAudioState()
        
        // 连接游戏Socket
        await this.gameSocket.connectGame(
          this.game_type_id,
          this.tableId,
          this.userInformation.id
        )
        
        console.log('Game socket connection established')
        
      } catch (error) {
        console.error('Connect game socket failed:', error)
        
        if (!this.isManualDisconnect) {
          // 3秒后重试
          this.connectionRetryTimer = setTimeout(() => {
            this.connectGameSocket()
          }, 3000)
        }
      }
    },

    /**
     * Socket连接成功后的处理
     */
    onSocketConnected() {
      // 清除重试定时器
      if (this.connectionRetryTimer) {
        clearTimeout(this.connectionRetryTimer)
        this.connectionRetryTimer = null
      }
      
      // 发送初始化数据
      this.sendInitialData()
    },

    /**
     * 发送初始化数据
     */
    sendInitialData() {
      // 发送音效状态
      this.updateAudioState()
      
      // 可以在这里发送其他初始化数据
    },

    /**
     * 断开Socket连接
     */
    disconnectSocket() {
      if (this.connectionRetryTimer) {
        clearTimeout(this.connectionRetryTimer)
        this.connectionRetryTimer = null
      }
      
      if (this.gameSocket) {
        this.gameSocket.close()
        this.socketStatus.isConnected = false
      }
    },

    /**
     * 处理Socket消息 - 完整版本（包含倒计时逻辑）
     */
    handleSocketMessage(data) {
      console.log('收到Socket消息:', data)
      
      // 处理失败数据
      if (data === 'fail') {
        this.sendSocketMessage({
          code: 205,
          user_id: this.userInformation.id,
          msg: this.audioState
        })
        return
      }

      // 验证JSON格式
      if (typeof data === 'string' && !this.isValidJSON(data.trim())) {
        this.tableRunInfo.end_time = 0
        return
      }

      let result = typeof data === 'string' ? JSON.parse(data) : data

      // 特别关注table_run_info消息
      if (result.data && result.data.table_run_info) {
        console.log('🎯 收到倒计时信息:', result.data.table_run_info)
      }

      // 处理失败消息
      if (result.code == 404) {
        this.showAlert(result.msg)
        return
      }

      // 处理成功下注消息(客户端推服务推客户端)
      if (result.code == 204) {
        return
      }

      // 处理下注成功消息(服务推客户端)
      if (result.code == 203) {
        this.handleSuccessMsg(result)
        return
      }

      // ===== 关键：倒计时开牌状态信息处理 =====
      if (result.data && result.data.table_run_info) {
        this.dao_ji_shi(result.data.table_run_info)
        return
      }

      // 处理开牌结果
      if (!result.data || !result.data.result_info) {
        return
      }

      // 显示输赢信息
      if (result.data.result_info.money != false) {
		console.log('🎯 收到输赢消息:', result.data.result_info)
        this.showWinMsgOpen = true
        this.showWinMsgText = `${this.liveLocales.win}：${result.data.result_info.money}`
        setTimeout(() => {
          this.showWinMsgOpen = false
        }, 2000)
      }

      // 验证是否是当前桌子的游戏结果
      if (result.data.result_info.table_info.game_type != this.game_type_id ||
        result.data.result_info.table_info.table_id != this.tableId ||
        this.tableRunInfo.end_time > 0) {
        return
      }

      console.log("result.code:", result.code, "this.receiveResultState:", this.receiveResultState)

      // 处理开牌结果
      if (result.code == 200 && !this.receiveResultState) {
        this.resultInfo = result.data.result_info
        this.receiveResultState = true
        this.$forceUpdate()

        // 播放开牌音乐
        this.runOpenMusicEffect(result.data.bureau_number)

        // 5秒后刷新相关数据
        setTimeout(() => {
          this.receiveResultState = false
          this.getGameTableInfo()
          this.getGameBetCount()
          this.handleRefresh()
          // 🎯 关键：使用智能缩放替代原来的视频刷新
          this.smartRefreshLuzhu(this.bureauNumber, '开牌结果确认')
        }, 5000)
      }
    },

    /**
     * 发送Socket消息 - 替换原有的socketTask.sendMsg
     */
    sendSocketMessage(data) {
      if (this.gameSocket && this.socketStatus.isConnected) {
        this.gameSocket.send(data)
      } else {
        console.warn('Socket not connected, message queued:', data)
      }
    },

    /**
     * 更新音效状态 - 重构原有的音效处理
     */
    updateAudioState() {
      this.audioState = {
        backgroundMusicState: uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) === 'off' ? 'off' : 'on',
        musicEffectSate: uni.getStorageSync(MUSIC_TYPE.musicEffectSate) === 'off' ? 'off' : 'on'
      }

      if (this.gameSocket) {
        this.gameSocket.updateAudioState(this.audioState)
      }
    },

    /**
     * 清理定时器和连接 - 更新原有方法
     */
    clearTimersAndConnections() {
      clearTimeout(this.pageHiddenTimer)
      clearInterval(this.getInfotimerHandle)
      
      if (this.connectionRetryTimer) {
        clearTimeout(this.connectionRetryTimer)
        this.connectionRetryTimer = null
      }
    },

    /**
     * 监听设置音效和背景音乐 - 更新原有方法
     */
    addEventSettingMusic() {
      Bus.$on('setMusicType', (data) => {
        this.updateAudioState()
        
        switch (data) {
          case MUSIC_TYPE.backgroundMusicState:
            break
          case MUSIC_TYPE.musicEffectSate:
            break
        }
      })
    },

    /**
     * 手动重连Socket
     */
    manualReconnect() {
      this.isManualDisconnect = false
      this.disconnectSocket()
      setTimeout(() => {
        this.connectGameSocket()
      }, 1000)
    },

    /**
     * 获取Socket连接状态
     */
    getSocketStatus() {
      return this.gameSocket ? this.gameSocket.getStatus() : null
    },

    /**
     * 处理成功消息
     */
    handleSuccessMsg(result) {
      this.showMsgOpen = true
      this.activityDescribeText = `${result.msg}:${result.data.money_spend}`
      this.handleRefresh()
      setTimeout(() => {
        this.showMsgOpen = false
      }, 2500)
    },

    /**
     * 🎯 优化后的视频切换 - 保持原有切换功能
     */
    handleZoom() {
      // 保持原有的切换逻辑
      this.videoEnlarge = !this.videoEnlarge
      
      console.log(`切换到${this.videoEnlarge ? '近景' : '远景'}`)
      
      // 移除原有的浏览器兼容刷新逻辑
      // 现在通过CSS层级切换，无需刷新
    },

    /**
     * 🎯 视频加载完成回调
     */
    onVideoLoaded(type) {
      this.videoLoadStatus[type] = true
      console.log(`${type}景视频加载完成`)
    },

    /**
     * 🎯 开牌时的智能缩放效果 - 不影响切换功能
     */
    smartVideoZoom(reason = '') {
	  setTimeout(() => {
	    console.log('开牌缩放效果:', reason)	    
	    // 添加临时缩放效果
	    this.zoomEffectClass = 'opening-zoom'	    
	    // 15秒后恢复正常，不影响用户的切换状态  视频缩放
	    setTimeout(() => {
	      this.zoomEffectClass = 'normal'
	    }, 15000)
	  }, 3000)
    },

    /**
     * 🎯 优化后的刷新 - 仅在必要时使用
     */
    refreshIframe() {
      // 检查当前显示的视频
      const currentVideo = this.videoEnlarge ? 'near' : 'far'
      
      if (!this.videoLoadStatus[currentVideo]) {
        // 只有在视频未正常加载时才刷新
        this.startAnimation = true
        
        // 重新加载当前显示的视频
        this.reloadCurrentVideo()
        
        setTimeout(() => {
          this.startAnimation = false
        }, 1000)
      } else {
        console.log('视频正常，无需刷新')
      }
    },

    /**
     * 🎯 重新加载当前视频
     */
    reloadCurrentVideo() {
      const timestamp = Date.now()
      
      if (this.videoEnlarge && this.videoNear) {
        // 重新加载近景
        this.videoNear = this.videoNear.split('?')[0] + `?t=${timestamp}`
        this.videoLoadStatus.near = false
      } else if (!this.videoEnlarge && this.videoFar) {
        // 重新加载远景
        this.videoFar = this.videoFar.split('?')[0] + `?t=${timestamp}`
        this.videoLoadStatus.far = false
      }
    },

    /**
     * 重新加载露珠 - 手动点击刷新
     */
    reloadLuzhu() {
      try {
        let lzIframe = document.getElementById('live_details_lz')
        if (lzIframe) {
          const timestamp = Date.now()
          lzIframe.src = `${this.lzUrl}?tableId=${this.tableId}&user_id=${this.userInformation.id}&t=${timestamp}`
        }
      } catch (error) {
        console.error('重载露珠失败:', error)
      }
    },

    /**
     * 智能刷新露珠 - 防止重复刷新
     */
    smartRefreshLuzhu(bureauNumber = null, reason = '') {
      console.log('露珠刷新中.......................')
      // 如果正在刷新中，跳过
      if (this.isRefreshingLuzhu) {
        console.log('🔄 露珠刷新中，跳过本次请求:', reason)
        return
      }
         
      this.isRefreshingLuzhu = true
      
      try {
        const lzIframe = document.getElementById('live_details_lz')
        if (lzIframe) {
          const timestamp = Date.now()
          const newSrc = `${this.lzUrl}?tableId=${this.tableId}&user_id=${this.userInformation.id}&t=${timestamp}`
          lzIframe.src = newSrc
          
          // 更新已刷新的局号
          if (bureauNumber) {
            this.lastRefreshedBureau = bureauNumber
          }
          
          console.log('🔄 露珠刷新成功:', reason, '局号:', bureauNumber)
        }
      } catch (error) {
        console.error('❌ 露珠刷新失败:', error)
      } finally {
        // 25秒后解锁
        setTimeout(() => {
          this.isRefreshingLuzhu = false
        }, 25000)
      }
    },

    /**
     * 获取整站维护通知
     */
    getNoticeList() {
      try {
        this.$maintainState.getNoticeList().then(res => {
          this.maintainData = res
          if (this.maintainData.web_maintain_status == this.$WEB_MAINTAIN_STATE) {
            uni.navigateTo({
              url: '/pages/maintain/maintain'
            })
          }
        }).catch(error => {
          console.error('获取维护通知失败:', error)
        })
      } catch (error) {
        console.error('维护通知服务不可用:', error)
      }
    },
    
    /**
     * 获取浏览器信息
     * @returns {Object} 浏览器信息对象
     */
    getBrowser() {
      var UserAgent = navigator.userAgent.toLowerCase()
      var browserInfo = {}
      var browserArray = {
        IE: window.ActiveXObject || "ActiveXObject" in window,
        Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1,
        Firefox: UserAgent.indexOf('firefox') > -1,
        Opera: UserAgent.indexOf('opera') > -1,
        Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1,
        Edge: UserAgent.indexOf('edge') > -1,
        QQBrowser: /qqbrowser/.test(UserAgent),
        WeixinBrowser: /MicroMessenger/i.test(UserAgent)
      }
      
      for (var i in browserArray) {
        if (browserArray[i]) {
          var versions = ''
          if (i == 'IE') {
            versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2]
          } else if (i == 'Chrome') {
            for (var mt in navigator.mimeTypes) {
              // 检测是否是360浏览器(测试只有pc端的360才起作用)
              if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin') {
                i = '360'
              }
            }
            versions = UserAgent.match(/chrome\/([\d.]+)/)[1]
          } else if (i == 'Firefox') {
            versions = UserAgent.match(/firefox\/([\d.]+)/)[1]
          } else if (i == 'Opera') {
            versions = UserAgent.match(/opera\/([\d.]+)/)[1]
          } else if (i == 'Safari') {
            versions = UserAgent.match(/version\/([\d.]+)/)[1]
          } else if (i == 'Edge') {
            versions = UserAgent.match(/edge\/([\d.]+)/)[1]
          } else if (i == 'QQBrowser') {
            versions = UserAgent.match(/qqbrowser\/([\d.]+)/)[1]
          }
          browserInfo.type = i
          browserInfo.versions = parseInt(versions)
        }
      }
      return browserInfo
    },
    
    /**
     * 停止滚动事件
     * @param {Object} touchEvent - 触摸事件
     */
    stopScrolling(touchEvent) {
      touchEvent.preventDefault()
    },
     
    /**
     * 获取台桌视频信息
     */
    getTableInfoVideo() {
      this.videoLoadState = true
      let system = this.getSystemType()
      
      apiService.getTableInfoVideo({ id: this.tableId }).then(res => {
        if (res.data.code == 200) {
          this.videoFar = res.data.data.video_far
          // iOS系统使用flv格式
          this.videoFar = system == 'ios' ? this.videoFar.replace("/index.html", '/flv/index.html') : this.videoFar
          
          this.videoNear = res.data.data.video_near
          // iOS系统使用flv格式
          this.videoNear = system == 'ios' ? this.videoNear.replace("/index.html", '/flv/index.html') : this.videoNear
          
          console.log('视频URL加载完成:', { videoFar: this.videoFar, videoNear: this.videoNear })
        }
      }).catch(err => {
        console.error('获取视频信息失败:', err)
      })
    },
    
    /**
     * 判断系统类型
     * @returns {String} 系统类型
     */
    getSystemType() {
      let system = ''
      
      //#ifdef H5
      system = 'h5'
      //#endif
      
      // #ifdef APP-PLUS
      switch (uni.getSystemInfoSync().platform) {
        case 'android':
          system = 'android'
          break
        case 'ios':
          system = 'ios'
          break
      }
      //#endif
      
      return system
    },
    
    /**
     * 设置游戏桌倒计时信息
     * @param {Object} tableRunInfo - 后台返回的台桌运行信息
     */
    dao_ji_shi(tableRunInfo) {
      console.log('🎯 dao_ji_shi被调用:', tableRunInfo)
      console.log('之前的endTime:', this.endTime)
      
      // 设置倒计时颜色 - 低于6秒显示红色
      if (tableRunInfo.end_time < 6) {
        this.activeColor = 'red'
      } else {
        this.activeColor = '#78E07A'
      }

      // 计算进度比率
      this.percent = tableRunInfo.end_time / tableRunInfo.countdown_time * 100
      this.endTime = tableRunInfo.end_time

      // 同步局号信息到头部组件
      if (tableRunInfo.end_time == 45 || tableRunInfo.end_time == 0) {
        this.tableRunInfo = tableRunInfo
      }

      // ===== 重要：重置stopMusicHasPlayed标记 =====
      if (tableRunInfo.end_time > 0 && tableRunInfo.run_status != 2) {
        this.stopMusicHasPlayed = false
      }

      // 处理开牌中状态
      if (tableRunInfo.end_time == 0 && tableRunInfo.run_status == 2 && this.stopMusicHasPlayed == false) {
        this.stopMusicHasPlayed = true
        this.showMsgOpen = true
        this.activityDescribeText = this.liveLocales.openingCard
      }

      // 处理开始下注提示
      if (tableRunInfo.end_time == this.startShowWelcomeTime) {
        this.showMsgOpen = true
        this.activityDescribeText = this.liveLocales.begunBet
      }
	  
	  // 倒计时28秒时执行缩放效果  视频缩放
	  if (tableRunInfo.end_time == 1) {
	    this.smartVideoZoom('倒计时1秒缩放')
	  }

      // 3.5秒后关闭消息提示
      setTimeout(() => {
        this.showMsgOpen = false
      }, this.showMsgOpenTime)

      console.log('更新后的endTime:', this.endTime)
      console.log('更新后的percent:', this.percent)
      
      this.$forceUpdate()
    },
    
    /**
     * 播放开牌音效
     * @param {String} bureau_number - 局号
     */
    runOpenMusicEffect(bureau_number) {
      let tempLivePageState = uni.getStorageSync('LivePageState')
      if (tempLivePageState == 'hidden') {
        return
      }
      
      // 如果是新的一局(铺号不同)
      if (this.bureauNumber != bureau_number) {
        this.bureauNumber = bureau_number
        console.log('🎯 新局开始，局号:', bureau_number)
		
        let time = 2000        
        // 延时播放不同的音效
        setTimeout(() => {
          // 可在此添加音效播放逻辑
        }, time)
        
        setTimeout(() => {
          // 可在此添加音效播放逻辑
        }, time + 2500)
        
        setTimeout((win = 0) => {
          // 根据开牌结果播放对应音效
          // win: 1=庄赢 2=闲赢 3=和牌
          switch (win) {
            case 1:
              // this.audioHandle.startSoundEffect(`BANKER.mp3`)
              break
            case 2:
              // this.audioHandle.startSoundEffect(`PLAYER.mp3`)
              break
            case 3:
              // this.audioHandle.startSoundEffect(`TIED.mp3`)
              break
          }
        }, time + 5000, this.resultInfo.result.win)
        
      }
    },
    
    /**
     * 触发头部组件刷新用户金额
     */
    handleRefresh() {
      if (!this.$refs.headBar) {
        return
      }
      this.$refs.headBar.userInfos()
    },
    
    /**
     * 获取游戏下注统计信息
     */
    getGameBetCount() {
      apiService.gameTableBet({ table_id: this.tableId }).then(res => {
        if (res.data.code == 200) {
          this.betCountDetails = res.data.data
          this.$forceUpdate()
        }
      }).catch(error => {
        console.error('获取下注统计失败:', error)
      })
    },
    
    /**
     * 启动音频设置
     */
    switchAudioByBrowerStart() {
      setTimeout(() => {
        // 可在此添加音频启动逻辑
      }, 150)
    },
    
    /**
     * 停止音频设置
     */
    switchAudioByBrowerStop() {
      this.audioState.backgroundMusicState = 'off'
      this.audioState.musicEffectSate = 'off'
      this.sendSocketMessage({
        code: 205,
        user_id: this.userInformation.id,
        msg: this.audioState
      })
    },
    
    /**
     * 获取初始化桌子信息
     */
    getGameTableInfoInit() {
      apiService.gameTableInfo({ id: this.tableId }).then(res => {
        if (res.data.code === 200) {
          this.initTableInfo = res.data.data
          this.$forceUpdate()
          this.loadingState_tableDataInfo = 1
        }
      }).catch(error => {
        console.error('获取台桌初始化信息失败:', error)
      })
    },
    
    /**
     * 获取游戏桌子实时信息
     * 主要用于获取倒计时数据
     */
    getGameTableInfo() {
      apiService.gameTableInfo({ id: this.tableId }).then(res => {
        if (res.data.code === 200) {
          // 设置倒计时颜色
          if (res.data.data.end_time < 6) {
            this.activeColor = 'red'
          } else {
            this.activeColor = '#78E07A'
          }
          
          // 计算进度比率
          this.percent = res.data.data.end_time / res.data.data.countdown_time * 100
          this.tableRunInfo = res.data.data
          this.initTableInfo = res.data.data
          
          // 检查局号变化
          let temp_bureau_number = uni.getStorageSync(this.tablePre + 'bureauNumber').toString()
          if (!this.$refs.batPlugin) {
            return
          }
          
          if (temp_bureau_number != this.tableRunInfo.bureau_number.toString()) {
            // 局号发生变化的处理逻辑
          }
          
          // 存储最新的局号信息
          uni.setStorageSync(this.tablePre + 'bureauNumber', this.tableRunInfo.bureau_number)
          
          this.endTime = this.tableRunInfo.end_time
          
          // 处理开牌中状态
          if (this.tableRunInfo.end_time == 0 && this.tableRunInfo.run_status == 2 && this.stopMusicHasPlayed == false) {
            this.stopMusicHasPlayed = true
            
            // 调用投注区域的取消函数
            if (this.$refs.batPlugin) {
              this.$refs.batPlugin.cancel()
              this.$refs.batPlugin.sendFlag = 0
            }
            
            // 显示开牌中消息 | 暂时屏蔽 客户 要求的
            this.showMsgOpen = false
            this.activityDescribeText = this.liveLocales.openingCard
            
            // 清除历史投注信息
            uni.removeStorageSync('betTargetList')
            uni.setStorageSync('sendFlag', 0)
            
            // 投注状态重置
            this.betState = false
          }
          
          // 处理开始下注提示
          if (this.tableRunInfo.end_time == this.startShowWelcomeTime) {
            this.showMsgOpen = true
            this.activityDescribeText = this.liveLocales.begunBet
          }
          
          // 根据时间状态标记是否可以投注
          this.betState = this.tableRunInfo.end_time != 0
          
          // 3.5秒后关闭消息提示
          setTimeout(() => {
            this.showMsgOpen = false
          }, this.showMsgOpenTime)
          
          this.$forceUpdate()
        }
      }).catch(err => {
        console.error('获取游戏桌信息失败:', err)
      })
    },
    
    /**
     * 清除所有存储的投注信息
     */
    clearAll() {
      uni.removeStorageSync(this.tablePre + 'is_play_now')
      uni.removeStorageSync(this.tablePre + 'sendFlag')
      uni.removeStorageSync(this.tablePre + 'betMoneyBefore')
      uni.removeStorageSync(this.tablePre + 'betRepeatTargetList')
      uni.removeStorageSync(this.tablePre + 'betTargetList')
      uni.removeStorageSync(this.tablePre + 'isBetSuccessInOneGame')
      
      if (this.$refs.batPlugin) {
        this.$refs.batPlugin.clearAll()
      }
    },
    
    /**
     * 设置页面隐藏属性兼容
     */
    setHiddenProperty() {
      this.hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
          'mozHidden' in document ? 'mozHidden' : null
      
      this.visibilityChangeEvent = this.hiddenProperty.replace(/hidden/i, 'visibilitychange')
      
      // 添加页面可见性变化监听
      document.addEventListener(this.visibilityChangeEvent, this.listenerPageState.bind(this))
      
      // 定时重新设置
      this.pageHiddenTimer = setTimeout(() => {
        this.setHiddenProperty()
      }, 1000)
    },
    
    /**
     * 监听页面状态变化
     */
    listenerPageState() {
      if (!document[this.hiddenProperty]) {
        uni.setStorageSync('LivePageState', 'show')
      } else {
        uni.setStorageSync('LivePageState', 'hidden')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 基础页面样式 */
page {
  height: 100vh;
  overflow: hidden;
}

/* Socket状态指示器样式 */
.socket-status {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 12px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    
    text {
      margin-left: 4px;
    }
  }
}

/* 刷新动画 */
.video-animation {
  animation: refreshAnimation 1s linear infinite;
}

@keyframes refreshAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 页面背景 */
.live-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

/* 主要布局样式 */
.live-container {
  // position: relative;
  // height: 100vh;
  // display: flex;
  // flex-direction: column;
  // background: #000;
  
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 
        55px          /* 区域1固定高度 */
        250px         /* 区域2固定高度 */
        28px          /* 区域3固定高度 */
        1fr           /* 区域4自由压缩 */
        calc(100vw * 0.36); /* 区域5保持宽高比(假设比例为5:2) */
}

/* 视频区域样式 */
.live-box {
  position: relative;
  width: 100%;
  height: 250px;
  max-height: 280px;
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
}

/* 🎯 优化后的视频容器 - 支持整体缩放效果 */
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.5s ease, filter 0.3s ease;
}

/* 🎯 视频层 */
.video-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease, z-index 0.3s ease;
}

/* 🎯 激活状态的视频层 */
.layer-active {
  opacity: 1;
  z-index: 2;
  pointer-events: auto;
}

/* 🎯 隐藏状态的视频层 - 保持加载但不显示 */
.layer-hidden {
  opacity: 0;
  z-index: 1;
  pointer-events: none;
}

/* iframe样式 */
.live-details {
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
}

/* 🎯 缩放效果类 */
.normal {
  transform: scale(1);
}
/* 视频缩放 */
.opening-zoom {
  /* 超大缩放倍数 */
  transform: scale(1.5) !important;
  transform-origin: center center !important;
  
  /* 突破容器限制 */
  position: relative !important;
  z-index: 9999 !important;
  
  /* 确保显示区域合理 */
  overflow: visible !important;
  
  /* 视觉增强 */
  filter: brightness(1.3) contrast(1.2) saturate(1.4) !important;
  
  /* 平滑动画 */
  transition: all 1.2s cubic-bezier(0.23, 1, 0.320, 1) !important;
  
  /* 强烈的视觉效果 */
  box-shadow: 
    0 0 50px rgba(255, 255, 255, 0.6),
    0 0 100px rgba(255, 255, 255, 0.4),
    0 0 150px rgba(255, 255, 255, 0.2) !important;
  
  /* 边框效果 */
  border: 4px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 12px !important;
}



/* 🎯 切换动画优化 */
.video-layer.layer-active {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 加载动画样式 */
.live-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1;
  color: white;
}

.live-loading-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

@keyframes loadingRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.live-loading-img {
  width: 50px;
  height: 50px;
  animation: loadingRotate 1.2s linear infinite;
}

/* 倒计时样式 */
.live-count-down {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  z-index: 25;
  transform: rotateY(180deg) rotateZ(180deg);
}

.live-count-second {
  color: #78E07A;
  font-size: 18px;
  font-weight: bold;
  transform: rotateZ(0deg) rotateX(-180deg);
}

.live-active-color {
  color: red !important;
}

/* 洗牌标记样式 */
.live-shuffle {
  position: absolute;
  top: 20px;
  left: 90px;
  color: rgba(251, 93, 86, 0.9);
  font-size: 16px;
  font-weight: 600;
  z-index: 25;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
}

/* 通知消息样式 */
.live-notice {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #000000 0%, #454141 100%);
  color: #dac193;
  padding: 8px 16px;
  border-radius: 20px;
  z-index: 99;
  white-space: nowrap;
  font-size: 14px;
  animation: slideDown 500ms ease-out;
}

@keyframes slideDown {
  from {
    top: -30px;
    opacity: 0;
  }
  to {
    top: 10px;
    opacity: 1;
  }
}

/* 🎯 视频控制按钮 - 保持原有功能，确保在视频层之上 */
.video-controls {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 30; /* 确保在视频层之上 */
}

.control-btn {
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.control-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* 统计数据样式 */
.live-result-detail {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.8);
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  min-height: 32px;
  
  text {
    color: white;
    margin: 0 3px;
    font-size: 12px;
  }
}

.live-de-xian {
  color: #2B85E4 !important;
}

.live-de-he {
  color: #009949 !important;
}

.live-de-zhuang {
  color: #dc1a1f !important;
}

/* 投注区域样式 */
.live-bet-box {
  position: relative;
  flex: 1;
  min-height: 180px;
  background: rgba(0, 0, 0, 0.9);
  overflow: hidden;
}

.live-bet {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 2;
}

/* 露珠区域样式 */
.lz_details {
  position: relative;
  height: 155px;
  min-height: 155px;
  background: rgba(0, 0, 0, 0.9);
  overflow: hidden;
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.live-details-lz {
  position: absolute;
  top: 0;
  left: 0;
  background: #000;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 2;
}

/* APP端头部位置样式 */
.for_header_postion {
  width: 100%;
  height: 1px;
  padding-top: var(--status-bar-height, 0);
  flex-shrink: 0;
}

/* 🎯 移动端优化 */
@media screen and (max-width: 750px) {
  .live-box {
    height: 250px;
    max-height: 250px;
  }
  
  .opening-zoom {
    transform: scale(1.1); /* 小屏幕适度缩放 */
  }
  
  .live-result-detail {
    font-size: 11px;
    padding: 6px 8px;
    min-height: 28px;
    
    text {
      font-size: 10px;
      margin: 0 2px;
    }
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .control-icon {
    width: 20px;
    height: 20px;
  }
  
  .live-count-down {
    width: 50px;
    height: 50px;
    top: 15px;
    left: 15px;
  }
  
  .live-count-second {
    font-size: 16px;
  }
  
  .lz_details {
    height: 150px;
  }
}
.live-online-users {
  color: #00ff88 !important; // 绿色表示在线状态
  font-weight: bold;
}
/* 确保所有内容不露出背景 */
* {
  box-sizing: border-box;
}

.live-container > * {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>