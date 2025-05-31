<template>
  <view class="live-page" id="live-page">
    <!-- 加载组件 -->
    <Loading 
      ref="loading" 
      :custom="false" 
      :shadeClick="false" 
      :type="3"
    />
    
    <!-- 主要内容区域 -->
    <view class="live-container" v-if="this.loadingState_tableDataInfo == 1">
      <!-- 进入的欢迎语 开始 -->
      <!-- <welcomeMsg v-if="showWelcomeMsg" @closeMsg="closeMsg" :msg="welcomeMsg"></welcomeMsg> -->
      <!-- 进入的欢迎语 结束 -->
      
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
        <!-- 默认加载背景 开始 -->
        <view style="z-index: 1;" class="live-loading">
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
        <!-- 默认加载背景 结束 -->
        
        <!-- 近景摄像头 开始 -->
        <view 
          v-if="videoEnlarge" 
          class="live-video" 
          id="live-video-near"
        >
          <iframe 
            class="live-details" 
            frameborder="0" 
            scrolling="no" 
            :src="videoNear"
          />
        </view>
        <!-- 近景摄像头 结束 -->
        
        <!-- 远景摄像头 开始 -->
        <view 
          v-else 
          class="live-video" 
          id="live-video-far"
        >
          <iframe 
            class="live-details" 
            frameborder="0" 
            scrolling="no" 
            :src="videoFar"
          />
        </view>
        <!-- 远景摄像头 结束 -->
        
        <!-- 倒计时圈圈 开始 -->
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
        <!-- 倒计时圈圈 结束 -->
        
        <!-- 洗牌状态标记 开始 -->
        <view 
          class="live-shuffle" 
          v-if="tableRunInfo.wash_status == 1"
        >
          {{ $locales.index.shuffle }}
        </view>
        <!-- 洗牌状态标记 结束 -->
        
        <!-- 消息状态通知栏 开始 -->
        <view class="live-notice" v-if="showMsgOpen">
          {{ activityDescribeText }}
        </view>
        <view class="live-notice" v-if="showWinMsgOpen">
          {{ showWinMsgText }}
        </view>
        <!-- 消息状态通知栏 结束 -->
        
        <!-- 视频放大缩小按钮 开始 -->
        <view class="live-zoom" style="z-index: 21;">
          <image 
            src="/static/img/live/enlarge.svg" 
            mode="" 
            v-if="!videoEnlarge" 
            @click="handleZoom()"
          />
          <image 
            src="/static/img/live/reduce.svg" 
            mode="" 
            v-if="videoEnlarge" 
            @click="handleZoom()"
          />
        </view>
        
        <!-- 视频刷新按钮 -->
        <view 
          class="live-zoom" 
          style="z-index: 21; top:80rpx" 
          @tap="refreshIframe()"
        >
          <u-icon 
            :class="{'video-animation': startAnimation}" 
            name="reload" 
            color="#ffffbc" 
            size="48"
          />
        </view>
        <!-- 视频放大缩小 结束 -->
      </view>
      <!-- 视频显示区域 结束 -->
      
      <!-- 统计数据 开始 - 百家乐 -->
      <view class="live-result-detail" v-if="game_type_id == 3">
        <text class="live-de-zhuang">{{ indexLocales.itemZhuang }}:{{ betCountDetails.zhuang }}</text>
        <text class="live-de-xian">{{ indexLocales.itemXian }}:{{ betCountDetails.xian }}</text>
        <text class="live-de-he">{{ indexLocales.itemHe }}:{{ betCountDetails.he }}</text>
        <text class="live-de-zhuang">{{ indexLocales.itemZhuangDui }}:{{ betCountDetails.zhuang_dui }}</text>
        <text class="live-de-xian">{{ indexLocales.itemXianDui }}:{{ betCountDetails.xian_dui }}</text>
        <text>{{ liveLocales.totalGames }}:{{ betCountDetails.count }}</text>
      </view>
      <!-- 统计数据 结束 - 百家乐 -->
      
      <!-- 统计数据 开始 - 龙虎 -->
      <view class="live-result-detail" v-if="game_type_id == 2">
        <text class="live-de-zhuang">{{ liveLocales.dragon }}:{{ betCountDetails.zhuang }}</text>
        <text class="live-de-xian">{{ liveLocales.tiger }}:{{ betCountDetails.xian }}</text>
        <text class="live-de-he">{{ liveLocales.peace }}:{{ betCountDetails.he }}</text>
        <text>{{ liveLocales.totalGames }}:{{ betCountDetails.count }}</text>
      </view>
      <!-- 统计数据 结束 - 龙虎 -->
      
      <!-- 投注区域 开始 -->
      <view class="live-bet-box">
        <!-- 投注区域加载背景 -->
        <view style="z-index: 0;" class="live-loading">
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
          style="z-index: 2;position: absolute;" 
          class="live-bet" 
          id="betIframe" 
          frameborder="0" 
          scrolling="no" 
          :src="`${configService.betUrl222}/bjlLhV2?table_id=${tableId}&game_type=${game_type_id}&user_id=${userInformation.id}&token=${userToken}`"
        />
      </view>
      <!-- 投注区域 结束 -->
      
      <!-- 露珠显示区域 开始 -->
      <view class="details lz_details">
        <!-- 露珠加载背景 -->
        <view 
          style="z-index: 0;" 
          class="live-loading" 
          @click="reloadLuzhu()"
        >
          <view class="live-loading-panel">
            <view class="">
              {{ liveLocales.selectNetwork }},tap to reload
            </view>
          </view>
        </view>
        
        <!-- 露珠iframe -->
        <iframe 
          class="live-details live-details-lz" 
          id="live_details_lz" 
          name="liveDetailsLz" 
          :src="`${lzUrl}?tableId=${tableId}&user_id=${userInformation.id}`"
        />
      </view>
      <!-- 露珠显示区域 结束 -->
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
import { SocketTask } from '@/api/socket.js'
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
      
      // Socket相关
      socketTask: null, // 初始化socket句柄
      configService: configService, // 初始化服务配置项目
      
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
      
      // 视频相关
      videoLoadState: true, // 视频加载状态
      videoEnlarge: false, // 视频远近景切换按钮
      videoFar: '', // 远景地址 后台获取
      videoNear: '', // 近景地址 后台获取
      startAnimation: false, // 刷新动画
      
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
  },
  
  /**
   * 页面前台展示
   */
  onShow() {
    // 初始化Socket连接
    this.socketTask = this.game_type_id == 3 ? new SocketTask(configService.bjlWsUrl) : new SocketTask(configService.lhWsUrl)
    
    // 获取通知列表
    this.getNoticeList()
    
    // 设置页面状态
    uni.setStorageSync('LivePageState', 'show')
    
    // 启动音频
    this.switchAudioByBrowerStart()
    
    // 初始化Socket连接
    this.initSocket()
  },
  
  /**
   * 组件挂载
   */
  mounted() {
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
  },
  
  /**
   * 页面后台运行
   */
  onHide() {
    this.clearTimersAndConnections()
    uni.setStorageSync('LivePageState', 'hidden')
    this.switchAudioByBrowerStop()
    this.socketTask.close()
  },
  
  /**
   * 页面退出
   */
  onUnload() {
    this.clearTimersAndConnections()
    uni.setStorageSync('LivePageState', 'hidden')
    this.switchAudioByBrowerStop()
    this.socketTask.close()
  },
  
  /**
   * 组件销毁
   */
  destroyed() {
    this.clearTimersAndConnections()
    uni.setStorageSync('LivePageState', 'hidden')
    this.switchAudioByBrowerStop()
    this.socketTask.close()
    Bus.$off('setMusicType', this.addEventSettingMusic())
  },
  
  methods: {
    /**
     * 清理定时器和连接
     */
    clearTimersAndConnections() {
      clearTimeout(this.pageHiddenTimer)
      clearInterval(this.getInfotimerHandle)
    },
    
    /**
     * 重新加载露珠
     */
    reloadLuzhu() {
      let lzIframe = document.getElementById('live_details_lz')
      lzIframe.src = `${this.lzUrl}?tableId=${this.tableId}&user_id=${this.userInformation.id}`
    },
    
    /**
     * 监听设置音效和背景音乐
     */
    addEventSettingMusic() {
      Bus.$on('setMusicType', (data) => {
        this.audioState = {
          backgroundMusicState: uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on',
          musicEffectSate: uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
        }
        
        // 发送音效设置到服务器
        this.socketTask.sendMsg({
          code: 205,
          user_id: this.userInformation.id,
          voiceSwitch: 'voiceSwitch',
          msg: this.audioState
        })
        
        // 根据不同的音效类型处理
        switch (data) {
          case MUSIC_TYPE.backgroundMusicState:
            break
          case MUSIC_TYPE.musicEffectSate:
            break
        }
      })
    },
    
    /**
     * 获取整站维护通知
     */
    getNoticeList() {
      this.$maintainState.getNoticeList().then(res => {
        this.maintainData = res
        if (this.maintainData.web_maintain_status == this.$WEB_MAINTAIN_STATE) {
          uni.navigateTo({
            url: '/pages/maintain/maintain'
          })
        }
      })
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
     * 刷新视频iframe
     */
    refreshIframe() {
      this.startAnimation = true
      
      // 执行刷新动作 - 先清空再重新赋值
      let tempVidelFar = this.videoFar
      let tempVideoNear = this.videoNear
      this.videoFar = ''
      this.videoNear = ''
      
      setTimeout(() => {
        this.startAnimation = false
        this.videoFar = tempVidelFar
        this.videoNear = tempVideoNear
      }, 1000)
    },
    
    /**
     * 停止滚动事件
     * @param {Object} touchEvent - 触摸事件
     */
    stopScrolling(touchEvent) {
      touchEvent.preventDefault()
    },
    
    /**
     * 初始化Socket连接信息
     */
    initSocket() {
      // 初始化音频状态
      this.audioState = {
        backgroundMusicState: uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on',
        musicEffectSate: uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
      }
      
      // 建立Socket连接
      this.socketTask.connect()
      
      // 监听Socket连接成功
      this.socketTask.onOpen(res => {
        // 发送台桌信息
        this.socketTask.sendMsg({
          table_id: this.tableId,
          game_type: this.game_type_id,
          user_id: this.userInformation.id
        })
        
        // 发送音效设置
        this.socketTask.sendMsg({
          code: 205,
          user_id: this.userInformation.id,
          msg: this.audioState
        })
      })
      
      // 接收消息
      this.receiveMsg()
      
      // 监听Socket错误，6秒后重连
      this.socketTask.onError(() => {
        setTimeout(() => {
          this.reconnection()
        }, 6000)
      })
    },
    
    /**
     * Socket重连
     */
    reconnection() {
      console.log('websocket reconnect')
      
      this.socketTask.connect()
      this.socketTask.onOpen(res => {
        // 重新发送连接信息
        this.socketTask.sendMsg({
          table_id: this.tableId,
          game_type: this.game_type_id,
          user_id: this.userInformation.id
        })
        
        // 重新发送音效设置
        this.socketTask.sendMsg({
          code: 205,
          user_id: this.userInformation.id,
          msg: this.audioState
        })
      })
      
      this.receiveMsg()
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
        }
      }).catch(err => {
        console.log(err)
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
     * 视频放大缩小切换
     */
    handleZoom() {
      this.videoEnlarge = !this.videoEnlarge
      
      // Safari 12版本兼容处理
      //#ifdef H5
      let agent = this.getBrowser()
      if (agent.type == 'Safari' && agent.versions == 12) {
        this.refreshIframe()
      }
      //#endif
    },
    
    /**
     * 接收Socket消息
     * 主要处理开牌结果、下注提示、派彩等信息
     * 
     * 开牌结果数据结构说明：
     * result.data.result中包含：
     * - zhuang_point: 庄点数
     * - xian_point: 闲点数  
     * - zhuang_dui: 是否庄对
     * - xian_dui: 是否闲对
     * - win: 主结果 1=庄赢 2=闲赢 3=和牌 0=错误
     * - size: 大赢还是小赢 0=小赢 1=大赢
     * - lucky: 是否是幸运6 0=不是 大于0=是幸运6
     */
    receiveMsg() {
      this.socketTask.receiveMsg(res => {
        // 处理失败数据
        if (res.data == 'fail') {
          this.socketTask.sendMsg({
            code: 205,
            user_id: this.userInformation.id,
            msg: this.audioState
          })
        }
        
        // 验证JSON格式
        if (!tools.isJSON(res.data.trim())) {
          this.tableRunInfo.end_time = 0
          return
        }
        
        let result = JSON.parse(res.data)
        
        // 处理失败消息
        if (result.code == 404) {
          this.$tip.alert(result.msg)
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
        
        // 处理倒计时开牌状态信息
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
          }, 5000)
        }
      })
    },
    
    /**
     * 处理成功消息
     * @param {Object} result - 响应结果信息
     */
    handleSuccessMsg(result) {
      this.showMsgOpen = true
      this.activityDescribeText = `${result.msg}:${result.data.money_spend}`
      
      // 刷新用户金额
      this.handleRefresh()
      
      // 2.5秒后关闭消息提示
      setTimeout(() => {
        this.showMsgOpen = false
      }, 2500)
    },
    
    /**
     * 设置游戏桌倒计时信息
     * @param {Object} tableRunInfo - 后台返回的台桌运行信息
     */
    dao_ji_shi(tableRunInfo) {
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
      
      // 3.5秒后关闭消息提示
      setTimeout(() => {
        this.showMsgOpen = false
      }, this.showMsgOpenTime)
      
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
        console.log(error)
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
      this.socketTask.sendMsg({
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
            
            // 显示开牌中消息
            this.showMsgOpen = true
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
        console.log(err)
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
      document.addEventListener(this.visibilityChangeEvent, this.listenerPageState())
      
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
page {
  height: 100%;
  overflow: auto;
}

/* 刷新动画 */
.video-animation {
  animation: refreshAnimation 1s;
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
.live-page::before {
  content: " ";
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;
  background: url('/static/img/login/bg1.jpg') no-repeat center center fixed;
  background-size: 100% 100%;
  opacity: 0.2;
}

/* 主要布局样式 */
.live-page {
  position: relative;
  width: 100%;
  height: 100%;
  
  .live-container {
    height: 100%;
    padding-bottom: 10rpx;
    position: relative;
  }
  
  /* 加载动画样式 */
  .live-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
    color: white;
  }
  
  .live-loading-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    width: 100rpx;
    height: 100rpx;
    animation: loadingRotate 1.2s linear infinite;
  }
  
  /* 露珠区域样式 */
  .lz_details {
    position: relative;
  }
  
  .live-details-lz {
    top: 0rpx;
    left: 0;
    z-index: 9;
    position: absolute;
  }
  
  .live-details {
    border: none;
    height: 100%;
    width: 100%;
    padding: 0;
  }
  
  /* 视频区域样式 */
  .live-box {
    height: calc(100vw * 0.559);
    overflow: hidden;
    position: relative;
  }
  
  /* 倒计时样式 */
  .live-count-down {
    position: absolute;
    width: 100rpx;
    height: 100rpx;
    z-index: 25;
    top: 42rpx;
    left: 5px;
    transform: rotateY(180deg) rotateZ(180deg);
  }
  
  .live-count-second {
    color: #78E07A;
    margin-top: -5px;
    margin-left: -5px;
    font-size: 20px;
    font-weight: bold;
    transform: rotateZ(0deg) rotateX(-180deg);
  }
  
  .live-active-color {
    color: red;
  }
  
  /* 洗牌标记样式 */
  .live-shuffle {
    color: rgba(251, 93, 86, 0.9);
    font-size: 22px;
    position: absolute;
    font-weight: 600;
    width: 146rpx;
    top: 46rpx;
    z-index: 25;
    left: 5px;
  }
  
  /* 投注区域样式 */
  .live-bet-box {
    position: relative;
    height: calc(100% - 100rpx - (100vw * 0.559) - 28rpx - (100vw * 0.35));
  }
  
  .live-bet {
    height: 100%;
    width: 100%;
  }
  
  /* 视频样式 */
  .live-video {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10;
    border: none;
  }
  
  .live-video-child {
    position: relative;
    height: 100%;
  }
  
  /* 详情区域样式 */
  .details {
    height: 100vw * 0.35;
    width: 100%;
    position: relative;
    aspect-ratio: 100/35;
  }
  
  /* 缩放按钮样式 */
  .live-zoom {
    position: absolute;
    z-index: 10;
    right: 34rpx;
    top: 20rpx;
    
    image {
      width: 48rpx;
      height: 48rpx;
    }
  }
  
  /* 通知消息样式 */
  .live-notice {
    position: absolute;
    padding: 0 20rpx;
    padding-left: 76rpx;
    height: 78rpx;
    background-size: 100% 100%;
    width: calc(78rpx * 4.14117);
    top: 10rpx;
    left: 50%;
    white-space: nowrap;
    transform: translateX(-50%);
    z-index: 99;
    color: #dac193;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to right, black, #454141);
    animation: mobileNote 500ms;
    -webkit-animation: mobileNote 500ms;
  }
  
  @keyframes mobileNote {
    from {
      top: 100rpx;
    }
    to {
      top: 10rpx;
    }
  }
  
  @-webkit-keyframes mobileNote {
    from {
      top: 100rpx;
    }
    to {
      top: 10rpx;
    }
  }
  
  /* 统计数据样式 */
  .live-result-detail {
    font-size: 30rpx;
    font-family: '隶书';
    color: white;
    font-weight: 600;
    height: 36rpx;
    
    text {
      margin: 0 10rpx;
    }
  }
  
  .live-de-xian {
    color: #2B85E4;
  }
  
  .live-de-he {
    color: #009949;
  }
  
  .live-de-zhuang {
    color: #dc1a1f;
  }
  
  /* 开牌结果相关样式 */
  .live-result {
    position: absolute;
    z-index: 10000;
    height: 286rpx;
    font-size: 26px;
    font-weight: 800;
    font-family: '隶书';
    width: 100%;
    background-color: rgba(0, 0, 0, .7);
    display: flex;
    text-shadow: 1px 1px 0px #b7b7c1, 1px 1px 0px #b7b7c1;
  }
  
  /* 各种动画效果 */
  .live-win-bg {
    animation: backRedFlicker 1000ms infinite;
    -webkit-animation: backRedFlicker 1000ms infinite;
  }
  
  .live-win-blue-bg {
    animation: backBlueFlicker 1000ms infinite;
    -webkit-animation: backBlueFlicker 1000ms infinite;
  }
  
  .live-win-green-bg {
    animation: backGreenFlicker 1000ms infinite;
    -webkit-animation: backGreenFlicker 1000ms infinite;
  }
  
  @keyframes backRedFlicker {
    from {
      background-color: rgba(255, 0, 0, 1);
    }
    to {
      background-color: rgba(255, 0, 0, .1);
    }
  }
  
  @-webkit-keyframes backRedFlicker {
    from {
      background-color: rgba(255, 0, 0, 1);
    }
    to {
      background-color: rgba(255, 0, 0, .1);
    }
  }
  
  @keyframes backBlueFlicker {
    from {
      background-color: rgba(38, 67, 255, 1);
    }
    to {
      background-color: rgba(38, 67, 255, .1);
    }
  }
  
  @-webkit-keyframes backBlueFlicker {
    from {
      background-color: rgba(38, 67, 255, 1);
    }
    to {
      background-color: rgba(38, 67, 255, .1);
    }
  }
  
  @keyframes backGreenFlicker {
    from {
      background-color: rgba(19, 133, 53, 1);
    }
    to {
      background-color: rgba(19, 133, 53, .1);
    }
  }
  
  @-webkit-keyframes backGreenFlicker {
    from {
      background-color: rgba(19, 133, 53, 1);
    }
    to {
      background-color: rgba(19, 133, 53, .1);
    }
  }
}

/* APP端头部位置样式 */
.for_header_postion {
  display: flex;
  width: 100%;
  height: 1rpx;
  padding-top: calc(var(--status-bar-height));
  z-index: 1000;
}

/* iframe样式 */
::v-deep iframe {
  top: 0;
}
</style>