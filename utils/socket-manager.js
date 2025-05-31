// utils/optimized-socket-manager.js - 优化的Socket连接管理器
import configService from '@/common/service/config.service.js'

/**
 * 优化的Socket管理器 - 解决频繁重连问题
 */
class OptimizedSocketManager {
  constructor() {
    this.socket = null
    this.url = ''
    this.isConnected = false
    this.isConnecting = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 3 // 降低最大重连次数
    this.baseReconnectInterval = 2000 // 基础重连间隔2秒
    this.maxReconnectInterval = 30000 // 最大重连间隔30秒
    this.heartbeatTimer = null
    this.heartbeatInterval = 25000 // 25秒心跳，避免与服务器冲突
    this.messageQueue = []
    this.listeners = new Map()
    this.connectionPromise = null
    this.lastHeartbeatTime = 0
    this.connectionTimeout = 8000 // 8秒连接超时
    this.reconnectTimer = null
    this.isManualClose = false // 手动关闭标记
    this.connectStartTime = 0
    this.lastConnectAttempt = 0
    this.minConnectInterval = 1000 // 最小连接间隔1秒
  }

  /**
   * 连接Socket - 防止频繁连接
   * @param {string} url - WebSocket URL
   * @param {Object} options - 连接选项
   */
  async connect(url, options = {}) {
    // 防止频繁连接
    const now = Date.now()
    if (now - this.lastConnectAttempt < this.minConnectInterval) {
      console.log('连接过于频繁，等待...')
      await new Promise(resolve => setTimeout(resolve, this.minConnectInterval))
    }
    this.lastConnectAttempt = now

    // 如果已连接同一URL，直接返回
    if (this.isConnected && this.url === url) {
      console.log('Socket already connected to:', url)
      return Promise.resolve()
    }

    // 如果正在连接中，等待当前连接完成
    if (this.isConnecting && this.connectionPromise) {
      console.log('Connection in progress, waiting...')
      return this.connectionPromise
    }

    this.url = url
    this.isManualClose = false
    
    // 清理旧连接
    this.cleanup(false)

    console.log(`🔌 开始连接 Socket: ${url}`)
    this.isConnecting = true
    this.connectStartTime = Date.now()

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // 连接超时处理
        const timeout = setTimeout(() => {
          console.error('❌ Socket连接超时')
          this.isConnecting = false
          this.connectionPromise = null
          reject(new Error('Connection timeout'))
        }, this.connectionTimeout)

        // 创建WebSocket连接
        this.socket = uni.connectSocket({
          url: url,
          protocols: options.protocols || [],
          success: () => {
            console.log('📡 Socket连接初始化成功')
          },
          fail: (error) => {
            clearTimeout(timeout)
            console.error('❌ Socket连接失败:', error)
            this.isConnecting = false
            this.connectionPromise = null
            reject(error)
          }
        })

        // 监听连接打开
        this.socket.onOpen(() => {
          clearTimeout(timeout)
          const connectTime = Date.now() - this.connectStartTime
          console.log(`✅ Socket连接成功! 耗时: ${connectTime}ms`)
          
          this.isConnected = true
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.connectionPromise = null
          
          this.startHeartbeat()
          this.flushMessageQueue()
          this.emit('open')
          resolve()
        })

        // 监听消息
        this.socket.onMessage((message) => {
          this.handleMessage(message)
        })

        // 监听连接关闭
        this.socket.onClose((event) => {
          clearTimeout(timeout)
          this.handleClose(event)
        })

        // 监听错误
        this.socket.onError((error) => {
          clearTimeout(timeout)
          this.handleError(error)
        })

      } catch (error) {
        console.error('❌ Socket连接异常:', error)
        this.isConnecting = false
        this.connectionPromise = null
        reject(error)
      }
    })

    return this.connectionPromise
  }

  /**
   * 处理消息
   */
  handleMessage(message) {
    try {
      let data = message.data
      
      // 心跳响应处理
      if (typeof data === 'string' && (data === 'pong' || data.includes('heartbeat'))) {
        this.handleHeartbeatResponse()
        return
      }

      // 尝试解析JSON
      if (typeof data === 'string') {
        try {
          // 检查是否为有效JSON
          if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
            data = JSON.parse(data)
          }
        } catch (e) {
          // 保持原始字符串格式
          console.log('收到非JSON消息:', data)
        }
      }

      this.emit('message', data)
    } catch (error) {
      console.error('❌ 消息处理错误:', error)
    }
  }

  /**
   * 处理连接关闭
   */
  handleClose(event) {
    console.log('🔌 Socket连接关闭:', event)
    this.isConnected = false
    this.isConnecting = false
    this.stopHeartbeat()
    this.emit('close', event)
    
    // 只有在非手动关闭的情况下才重连
    if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect()
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ 达到最大重连次数，停止重连')
      this.emit('maxReconnectAttemptsReached')
    }
  }

  /**
   * 处理连接错误
   */
  handleError(error) {
    console.error('❌ Socket错误:', error)
    this.isConnecting = false
    this.emit('error', error)
  }

  /**
   * 智能重连调度
   */
  scheduleReconnect() {
    if (this.isManualClose || this.reconnectTimer) {
      return
    }

    this.reconnectAttempts++
    
    // 指数退避算法，但限制最大间隔
    const delay = Math.min(
      this.baseReconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1),
      this.maxReconnectInterval
    )
    
    console.log(`🔄 计划第${this.reconnectAttempts}次重连，${delay}ms后执行`)
    this.emit('reconnecting', this.reconnectAttempts)
    
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null
      
      if (!this.isConnected && !this.isConnecting && !this.isManualClose) {
        try {
          console.log(`🔄 执行第${this.reconnectAttempts}次重连`)
          await this.connect(this.url)
        } catch (error) {
          console.error(`❌ 第${this.reconnectAttempts}次重连失败:`, error)
        }
      }
    }, delay)
  }

  /**
   * 发送消息 - 优化队列机制
   */
  send(data) {
    const message = typeof data === 'object' ? JSON.stringify(data) : String(data)

    if (this.isConnected && this.socket) {
      try {
        this.socket.send({
          data: message,
          success: () => {
            console.log('📤 消息发送成功:', data)
            this.emit('messageSent', data)
          },
          fail: (error) => {
            console.error('❌ 消息发送失败:', error)
            this.queueMessage(data)
          }
        })
      } catch (error) {
        console.error('❌ 发送异常:', error)
        this.queueMessage(data)
      }
    } else {
      console.log('📝 连接未就绪，消息加入队列:', data)
      this.queueMessage(data)
    }
  }

  /**
   * 消息入队 - 限制队列大小
   */
  queueMessage(data) {
    this.messageQueue.push({
      data: data,
      timestamp: Date.now()
    })
    
    // 限制队列大小，移除过期消息
    if (this.messageQueue.length > 50) {
      const removed = this.messageQueue.shift()
      console.log('📝 移除队列中过期消息:', removed)
    }
    
    // 移除超过30秒的旧消息
    const now = Date.now()
    this.messageQueue = this.messageQueue.filter(item => 
      now - item.timestamp < 30000
    )
  }

  /**
   * 清空消息队列
   */
  flushMessageQueue() {
    console.log(`📨 清空消息队列，共${this.messageQueue.length}条消息`)
    while (this.messageQueue.length > 0) {
      const item = this.messageQueue.shift()
      this.send(item.data)
    }
  }

  /**
   * 优化的心跳机制
   */
  startHeartbeat() {
    this.stopHeartbeat()
    console.log('💓 启动心跳机制')
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.sendHeartbeat()
      } else {
        this.stopHeartbeat()
      }
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
      console.log('💓 心跳停止')
    }
  }

  /**
   * 发送心跳
   */
  sendHeartbeat() {
    this.lastHeartbeatTime = Date.now()
    const heartbeatMsg = {
      use_target: 'heartbeat',
      post_position: 'game',
      timestamp: this.lastHeartbeatTime
    }
    
    this.send(heartbeatMsg)
    
    // 心跳超时检测
    setTimeout(() => {
      if (Date.now() - this.lastHeartbeatTime > 15000) {
        console.log('💔 心跳超时，触发重连')
        this.handleHeartbeatTimeout()
      }
    }, 15000)
  }

  /**
   * 处理心跳响应
   */
  handleHeartbeatResponse() {
    const latency = Date.now() - this.lastHeartbeatTime
    console.log(`💓 心跳响应，延迟: ${latency}ms`)
    this.emit('heartbeat', { latency })
  }

  /**
   * 处理心跳超时
   */
  handleHeartbeatTimeout() {
    console.log('💔 心跳超时，主动断开重连')
    this.close(false)
    this.scheduleReconnect()
  }

  /**
   * 关闭连接
   * @param {boolean} manual - 是否手动关闭
   */
  close(manual = true) {
    this.isManualClose = manual
    this.cleanup(manual)
    
    if (this.socket) {
      try {
        this.socket.close()
      } catch (error) {
        console.error('❌ 关闭连接异常:', error)
      }
      this.socket = null
    }
    
    if (manual) {
      console.log('🔌 手动关闭Socket连接')
    }
  }

  /**
   * 清理资源
   * @param {boolean} manual - 是否手动清理
   */
  cleanup(manual = true) {
    this.isConnected = false
    this.isConnecting = false
    this.stopHeartbeat()
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    if (manual) {
      this.messageQueue = []
      this.reconnectAttempts = 0
    }
  }

  /**
   * 手动重连
   */
  async reconnect() {
    console.log('🔄 手动重连')
    this.close(false)
    this.reconnectAttempts = 0 // 重置重连次数
    await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒
    return this.connect(this.url)
  }

  /**
   * 事件监听器管理
   */
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(listener)
  }

  off(event, listener) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event)
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`❌ 事件监听器错误 ${event}:`, error)
        }
      })
    }
  }

  /**
   * 获取连接状态
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      messageQueueLength: this.messageQueue.length,
      url: this.url,
      lastHeartbeatTime: this.lastHeartbeatTime,
      isManualClose: this.isManualClose
    }
  }
}

/**
 * 游戏专用Socket管理器
 */
class GameSocketManager extends OptimizedSocketManager {
  constructor() {
    super()
    this.gameData = {
      tableId: null,
      gameType: null,
      userId: null
    }
    this.audioState = {}
    this.initialized = false
  }

  /**
   * 连接游戏Socket
   */
  async connectGame(gameType, tableId, userId) {
    this.gameData = { tableId, gameType, userId }
    
    // 根据游戏类型选择URL
    const socketUrls = {
      2: configService.lhWsUrl, // 龙虎
      3: configService.bjlWsUrl, // 百家乐
      6: configService.nnWsUrl, // 牛牛
      8: configService.threeWsUrl, // 三公
    }
    
    const url = socketUrls[gameType]
    if (!url) {
      throw new Error(`不支持的游戏类型: ${gameType}`)
    }

    console.log(`🎮 连接游戏Socket - 类型:${gameType}, 桌子:${tableId}, 用户:${userId}`)
    await this.connect(url)
  }

  /**
   * 重写消息处理 - 连接成功后自动发送初始化消息
   */
  handleMessage(message) {
    super.handleMessage(message)
    
    // 连接成功后发送初始化消息
    if (this.isConnected && !this.initialized && this.gameData.userId) {
      this.sendInitMessage()
      this.initialized = true
    }
  }

  /**
   * 发送初始化消息
   */
  sendInitMessage() {
    console.log('🎮 发送游戏初始化消息')
    
    // 发送台桌信息
    this.send({
      table_id: this.gameData.tableId,
      game_type: this.gameData.gameType,
      user_id: this.gameData.userId
    })

    // 延迟发送音效设置，避免消息过于密集
    setTimeout(() => {
      this.sendAudioState()
    }, 500)
  }

  /**
   * 发送音效状态
   */
  sendAudioState() {
    if (Object.keys(this.audioState).length > 0) {
      console.log('🔊 发送音效设置:', this.audioState)
      this.send({
        code: 205,
        user_id: this.gameData.userId,
        msg: this.audioState
      })
    }
  }

  /**
   * 更新音效状态
   */
  updateAudioState(audioState) {
    this.audioState = { ...audioState }
    if (this.isConnected) {
      this.sendAudioState()
    }
  }

  /**
   * 重写发送方法 - 自动补充游戏信息
   */
  send(data) {
    // 自动补充游戏基础信息
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const gameData = { ...data }
      
      // 只在属性不存在时才补充
      if (this.gameData.tableId && !gameData.hasOwnProperty('table_id')) {
        gameData.table_id = this.gameData.tableId
      }
      if (this.gameData.gameType && !gameData.hasOwnProperty('game_type')) {
        gameData.game_type = this.gameData.gameType
      }
      if (this.gameData.userId && !gameData.hasOwnProperty('user_id')) {
        gameData.user_id = this.gameData.userId
      }
      
      super.send(gameData)
    } else {
      super.send(data)
    }
  }

  /**
   * 重置初始化状态
   */
  resetInitialized() {
    this.initialized = false
  }

  /**
   * 重写关闭方法
   */
  close(manual = true) {
    this.initialized = false
    super.close(manual)
  }
}

export { OptimizedSocketManager, GameSocketManager }