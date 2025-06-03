// pages/live/gameBjlAndLh.js - 精简版（移除模拟逻辑）
import { GameSocketManager } from '@/utils/socket-manager.js'
import configService from '@/common/service/config.service.js'
import apiService from '@/api/game.js'
import Bus from "@/common/util/bus.js"
import GameDataSimulator from '@/utils/game-data-simulator.js'

// 音乐类型常量
const MUSIC_TYPE = {
  backgroundMusicState: 'backgroundMusicState',
  musicEffectSate: 'musicEffectSate'
}

// 导出一个包含所有核心逻辑的对象
export default {
  data() {
    return {
      // 国际化相关
      indexLocales: this._i18n.messages[this.$storageLan].index,
      liveLocales: this._i18n.messages[this.$storageLan].live,
      
      // 基本配置
      tableType: 'dianji',
      game_type_id: 3,
      lzUrl: '',
      tableId: -1,
      welcomeMsg: '欢迎光临XXX游戏',
      
      // 消息提示相关
      startShowWelcomeTime: 35,
      showMsgOpen: false,
      showMsgOpenTime: 3500,
      stopMusicHasPlayed: false,
      showWelcomeMsg: false,
      
      // 用户信息
      userInformation: {},
      userToken: uni.getStorageSync('Access-Token'),
      
      // 游戏数据
      betCountDetails: {},
      bureauNumber: '',
      resultInfo: {},
      initTableInfo: {},
      tableRunInfo: {},
            
      // 倒计时和进度相关
      percent: 100,
      activeColor: '#78E07A',
      innerbgColor: 'RGB(0,0,0,.6)',
      defaultColor: 'rgb(135,135,135,.1)',
      endTime: -99,
      
      // 消息和状态
      activityDescribeText: '',
      showWinMsgOpen: false,
      showWinMsgText: '',
      
      // 视频相关
      videoEnlarge: false,
      videoFar: '',
      videoNear: '',
      startAnimation: false,
      zoomEffectClass: 'normal',
      
      // 状态标记
      receiveResultState: false,
      audioState: {},
      loadingState_tableDataInfo: 0,
      
      // Socket相关
      configService: configService,
      show_websocket_tips: false,
      gameSocket: null,
      socketStatus: {
        isConnected: false,
        reconnectAttempts: 0,
        latency: 0,
        lastMessageTime: 0
      },
      connectionRetryTimer: null,
      isManualDisconnect: false,
      
      // 露珠相关
      lastRefreshedBureau: null,
      isRefreshingLuzhu: false,
      luzhuSrc: '',
      luzhuKey: 1,
      luzhuTimestamp: Date.now(),
      aspectRatio: 2.7,
      luzhuHeight: 0,
      screenWidth: 0,
      
      // 模拟数据（由外部模拟器管理）
      onlineUsers: 0,
      betAmount: 0,
      
      // 游戏数据模拟器
      dataSimulator: null,
    }
  },

  /**
   * 页面初始化
   */
  onLoad(option) {
    this.tableId = option.table_id
    this.userInformation = uni.getStorageSync('login_user_info')
    this.game_type_id = option.game_type_id
    
    // 存储路由参数
    uni.setStorageSync('routerParams', {
      table_id: option.table_id,
      game_type_id: option.game_type_id
    })
    
    // 根据游戏类型设置露珠URL
    if (option.game_type_id == 3) {
      this.lzUrl = configService.lzBjlUrlMain + this.liveLocales.lzurl + '/bjl_xc_big_678.html'
    }
    if (option.game_type_id == 2) {
      this.lzUrl = configService.lzLhUrlMain + this.liveLocales.lzurl + '/lh_bet_xc.html'
    }
    
    this.initSocket()
    this.initDataSimulator()
  },
  
  /**
   * 页面显示
   */
  onShow() {
    uni.setStorageSync('LivePageState', 'show')
    this.isManualDisconnect = false
    this.connectGameSocket()
    
    // 动态设置露珠高度
    uni.getSystemInfo({
      success: (res) => {
        this.screenWidth = res.windowWidth
        this.luzhuHeight = Math.floor(this.screenWidth / this.aspectRatio)
      }
    })
    
    // 启动数据模拟器
    if (this.dataSimulator) {
      this.dataSimulator.start()
    }
  },
  
  /**
   * 组件挂载
   */
  mounted() {
    this.luzhuTimestamp = Date.now()
    this.luzhuSrc = `${this.lzUrl}?tableId=${this.tableId}&user_id=${this.userInformation.id}&t=${this.luzhuTimestamp}`
    
    // 显示加载动画
    this.$refs.loading.open()
    
    // 页面滚动到顶部
    setTimeout(() => {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }, 600)
    
    uni.setStorageSync('LivePageState', 'show')
    
    // 初始化操作
    this.getTableInfoVideo()
    this.getGameTableInfoInit()
    this.getGameBetCount()
    this.addEventSettingMusic()
    
    // 关闭加载动画
    setTimeout(() => {
      this.$refs.loading.close()
    }, 4000)
  },
  
  /**
   * 页面隐藏和退出 - 合并处理
   */
  onHide() {
    this.cleanup()
  },
  
  onUnload() {
    this.cleanup()
  },
  
  beforeDestroy() {
    this.cleanup()
    Bus.$off('setMusicType', this.addEventSettingMusic)
  },
  
  methods: {
    // ==================== 核心业务方法 ====================
    
    /**
     * 统一清理资源
     */
    cleanup() {
      uni.setStorageSync('LivePageState', 'hidden')
      this.isManualDisconnect = true
      this.disconnectSocket()
      
      // 停止数据模拟器
      if (this.dataSimulator) {
        this.dataSimulator.stop()
      }
      
      if (this.connectionRetryTimer) {
        clearTimeout(this.connectionRetryTimer)
        this.connectionRetryTimer = null
      }
    },

    /**
     * 初始化数据模拟器
     */
    initDataSimulator() {
      this.dataSimulator = new GameDataSimulator({
        onlineUsers: {
          min: 200,
          max: 9000,
          updateCallback: (users) => {
            this.onlineUsers = users
            this.$forceUpdate()
          }
        },
        betAmount: {
          minTarget: 0,
          maxTarget: 200000,
          updateCallback: (amount) => {
            this.betAmount = amount
            this.$forceUpdate()
          }
        }
      })
      
      console.log('数据模拟器初始化完成')
    },

    /**
     * 格式化投注金额显示（从模拟器获取方法）
     */
    formatBetAmount(amount) {
      if (this.dataSimulator) {
        return this.dataSimulator.betAmount.formatAmount(amount)
      }
      // 备用格式化方法
      if (amount >= 10000) {
        return (amount / 10000).toFixed(1) + '万'
      }
      return Math.floor(amount).toLocaleString()
    },

    // ==================== Socket 相关方法 ====================
    
    /**
     * 初始化Socket管理器
     */
    initSocket() {
      this.gameSocket = new GameSocketManager()
      
      this.gameSocket.on('open', () => {
        console.log('Socket连接成功')
        this.socketStatus.isConnected = true
        this.socketStatus.reconnectAttempts = 0
        this.$forceUpdate()
        this.updateAudioState()
      })

      this.gameSocket.on('message', (data) => {
        this.socketStatus.lastMessageTime = Date.now()
        this.handleSocketMessage(data)
      })

      this.gameSocket.on('close', (event) => {
        console.log('Socket连接断开', event)
        this.socketStatus.isConnected = false
        this.$forceUpdate()
      })

      this.gameSocket.on('reconnecting', (attempts) => {
        console.log(`Socket重连中... 第${attempts}次`)
        this.socketStatus.reconnectAttempts = attempts
        this.$forceUpdate()
      })

      this.gameSocket.on('error', (error) => {
        console.error('Socket连接错误:', error)
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
        this.updateAudioState()
        await this.gameSocket.connectGame(
          this.game_type_id,
          this.tableId,
          this.userInformation.id
        )
        console.log('游戏Socket连接建立')
      } catch (error) {
        console.error('Socket连接失败:', error)
        if (!this.isManualDisconnect) {
          this.connectionRetryTimer = setTimeout(() => {
            this.connectGameSocket()
          }, 3000)
        }
      }
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
     * 处理Socket消息
     */
    handleSocketMessage(data) {
      console.log('收到Socket消息:', data)
      
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
        return
      }

      let result = typeof data === 'string' ? JSON.parse(data) : data

      // 处理失败消息
      if (result.code == 404) {
        this.showAlert(result.msg)
        return
      }

      // 处理下注成功消息
      if (result.code == 203) {
        this.handleSuccessMsg(result)
        return
      }

      // 处理倒计时信息
      if (result.data && result.data.table_run_info) {
        this.dao_ji_shi(result.data.table_run_info)
        return
      }

      // 处理开牌结果
      if (result.data && result.data.result_info) {
        this.handleGameResult(result)
      }
    },

    /**
     * 处理游戏结果
     */
    handleGameResult(result) {
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

      // 处理开牌结果
      if (result.code == 200 && !this.receiveResultState) {
        this.resultInfo = result.data.result_info
        this.receiveResultState = true
        this.$forceUpdate()

        // 5秒后刷新相关数据
        setTimeout(() => {
          this.receiveResultState = false
          this.getGameBetCount()
          this.handleRefresh()
          this.smartRefreshLuzhu(this.bureauNumber, '开牌结果确认')
        }, 5000)
      }
    },

    /**
     * 发送Socket消息
     */
    sendSocketMessage(data) {
      if (this.gameSocket && this.socketStatus.isConnected) {
        this.gameSocket.send(data)
      } else {
        console.warn('Socket未连接，消息已排队:', data)
      }
    },

    /**
     * 更新音效状态
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

    // ==================== 游戏数据相关方法 ====================

    /**
     * 设置游戏桌倒计时信息（集成数据模拟器）
     */
    dao_ji_shi(tableRunInfo) {
      console.log('倒计时更新:', tableRunInfo)
      
      // 🎯 集成数据模拟器的投注逻辑
      if (this.dataSimulator) {
        // 当倒计时从0变为正数时，开始新的投注周期
        if (this.endTime <= 0 && tableRunInfo.end_time > 0) {
          this.dataSimulator.startNewBettingCycle('新局开始')
        }
        
        // 当倒计时结束时，停止投注增长
        if (tableRunInfo.end_time == 0 && tableRunInfo.run_status == 2) {
          this.dataSimulator.endBettingCycle('开牌中')
        }
        
        // 当倒计时较少时（比如最后10秒），加快投注增长速度
        if (tableRunInfo.end_time <= 10 && tableRunInfo.end_time > 0) {
          this.dataSimulator.accelerateBetting(1.2)
        }
      }
      
      // 设置倒计时颜色
      if (tableRunInfo.end_time < 6) {
        this.activeColor = 'red'
      } else {
        this.activeColor = '#78E07A'
      }

      // 计算进度比率
      this.percent = tableRunInfo.end_time / tableRunInfo.countdown_time * 100
      this.endTime = tableRunInfo.end_time

      // 同步局号信息
      if (tableRunInfo.end_time == 45 || tableRunInfo.end_time == 0) {
        this.tableRunInfo = tableRunInfo
      }

      // 重置音乐播放标记
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
      
      // 倒计时1秒时执行缩放效果
      if (tableRunInfo.end_time == 1) {
        this.smartVideoZoom('倒计时1秒缩放')
      }

      // 3.5秒后关闭消息提示
      setTimeout(() => {
        this.showMsgOpen = false
      }, this.showMsgOpenTime)
      
      this.$forceUpdate()
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
     * 获取台桌视频信息
     */
    getTableInfoVideo() {
      let system = this.getSystemType()
      
      apiService.getTableInfoVideo({ id: this.tableId }).then(res => {
        if (res.data.code == 200) {
          this.videoFar = res.data.data.video_far
          this.videoNear = res.data.data.video_near
          
          // iOS系统使用flv格式
          if (system == 'ios') {
            this.videoFar = this.videoFar.replace("/index.html", '/flv/index.html')
            this.videoNear = this.videoNear.replace("/index.html", '/flv/index.html')
          }
          
          console.log('视频URL加载完成')
        }
      }).catch(err => {
        console.error('获取视频信息失败:', err)
      })
    },

    /**
     * 触发头部组件刷新用户金额
     */
    handleRefresh() {
      if (this.$refs.headBar) {
        this.$refs.headBar.userInfos()
      }
    },

    // ==================== 视频和露珠相关方法 ====================

    /**
     * 开牌时的智能缩放效果
     */
    smartVideoZoom(reason = '') {
      setTimeout(() => {
        console.log('开牌缩放效果:', reason)
        this.zoomEffectClass = 'opening-zoom'
        setTimeout(() => {
          this.zoomEffectClass = 'normal'
        }, 15000)
      }, 3000)
    },

    /**
     * 重新加载露珠
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
     * 智能刷新露珠
     */
    smartRefreshLuzhu(bureauNumber = null, reason = '') {
      if (this.isRefreshingLuzhu) {
        console.log('露珠刷新中，跳过本次请求:', reason)
        return
      }
         
      this.isRefreshingLuzhu = true
      
      try {
        const lzIframe = document.getElementById('live_details_lz')
        if (lzIframe) {
          const timestamp = Date.now()
          const newSrc = `${this.lzUrl}?tableId=${this.tableId}&user_id=${this.userInformation.id}&t=${timestamp}`
          lzIframe.src = newSrc
          
          if (bureauNumber) {
            this.lastRefreshedBureau = bureauNumber
          }
          
          console.log('露珠刷新成功:', reason)
        }
      } catch (error) {
        console.error('露珠刷新失败:', error)
      } finally {
        setTimeout(() => {
          this.isRefreshingLuzhu = false
        }, 25000)
      }
    },

    // ==================== 工具方法 ====================

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
     * 判断系统类型
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
     * 显示提示信息
     */
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
     * 监听设置音效和背景音乐
     */
    addEventSettingMusic() {
      Bus.$on('setMusicType', (data) => {
        this.updateAudioState()
      })
    }
  }
}