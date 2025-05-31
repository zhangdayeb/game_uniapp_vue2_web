// /utils/socket-manager.js - Socket连接管理器
// 导入 配置文件
import configService from '@/common/service/config.service.js'
class SocketManager {
  constructor() {
    this.socket = null
    this.url = ''
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 1000
    this.heartbeatTimer = null
    this.heartbeatInterval = 30000 // 30秒心跳
    this.messageQueue = [] // 消息队列
    this.listeners = new Map() // 事件监听器
    this.connectionPromise = null
    this.lastPingTime = 0
    this.connectionTimeout = 10000 // 10秒连接超时
  }

  /**
   * 连接Socket
   * @param {string} url - WebSocket URL
   * @param {Object} options - 连接选项
   */
  async connect(url, options = {}) {
    if (this.isConnected && this.url === url) {
      return Promise.resolve()
    }

    this.url = url
    this.cleanup()

    // 如果已有连接进行中，返回现有Promise
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // uni-app的socket连接
        this.socket = uni.connectSocket({
          url: url,
          protocols: options.protocols || [],
          success: () => {
            console.log('Socket connection initiated')
          },
          fail: (error) => {
            console.error('Socket connection failed:', error)
            this.connectionPromise = null
            reject(error)
          }
        })

        // 连接超时处理
        const timeout = setTimeout(() => {
          this.connectionPromise = null
          reject(new Error('Connection timeout'))
        }, this.connectionTimeout)

        // 监听连接打开
        this.socket.onOpen(() => {
          clearTimeout(timeout)
          this.isConnected = true
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
          this.handleClose(event)
        })

        // 监听错误
        this.socket.onError((error) => {
          this.handleError(error)
        })

      } catch (error) {
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
      if (data === 'pong') {
        this.handlePong()
        return
      }

      // 尝试解析JSON
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {
          // 不是JSON格式的消息
        }
      }

      this.emit('message', data)
    } catch (error) {
      console.error('Message handling error:', error)
    }
  }

  /**
   * 处理连接关闭
   */
  handleClose(event) {
    this.isConnected = false
    this.stopHeartbeat()
    this.emit('close', event)
    
    // 自动重连
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect()
    } else {
      this.emit('maxReconnectAttemptsReached')
    }
  }

  /**
   * 处理连接错误
   */
  handleError(error) {
    console.error('Socket error:', error)
    this.emit('error', error)
  }

  /**
   * 安排重连
   */
  scheduleReconnect() {
    this.reconnectAttempts++
    const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 30000)
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`)
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.emit('reconnecting', this.reconnectAttempts)
        this.connect(this.url)
      }
    }, delay)
  }

  /**
   * 发送消息
   */
  send(data) {
    // 如果是命令，强制补齐这三个参数
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // 创建副本避免修改原对象
      data = { ...data }
      
      // 只在属性不存在或为空时才补齐
      if (this.gameData) {
        if (!data.hasOwnProperty('table_id') || data.table_id == null) {
          data.table_id = this.gameData.tableId
        }
        if (!data.hasOwnProperty('game_type') || data.game_type == null) {
          data.game_type = this.gameData.gameType
        }
        if (!data.hasOwnProperty('user_id') || data.user_id == null) {
          data.user_id = this.gameData.userId
        }
      }
    }

    const message = typeof data === 'object' ? JSON.stringify(data) : data

    if (this.isConnected && this.socket) {
      try {
        this.socket.send({
          data: message,
          success: () => {
            this.emit('messageSent', data)
          },
          fail: (error) => {
            console.error('Send message failed:', error)
            this.queueMessage(data)
          }
        })
      } catch (error) {
        console.error('Send error:', error)
        this.queueMessage(data)
      }
    } else {
      this.queueMessage(data)
    }
  }

  /**
   * 消息入队
   */
  queueMessage(data) {
    this.messageQueue.push(data)
    // 限制队列大小
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift()
    }
  }

  /**
   * 清空消息队列
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.send(message)
    }
  }

  /**
   * 开始心跳
   */
  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.ping()
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
    }
  }

  /**
   * 发送心跳
   */
  ping() {
    this.lastPingTime = Date.now()
    this.send('ping')
    
    // 心跳超时检测
    setTimeout(() => {
      if (Date.now() - this.lastPingTime > 10000) {
        console.log('Heartbeat timeout, reconnecting...')
        this.reconnect()
      }
    }, 10000)
  }

  /**
   * 处理心跳响应
   */
  handlePong() {
    const latency = Date.now() - this.lastPingTime
    this.emit('pong', { latency })
  }

  /**
   * 重连
   */
  async reconnect() {
    this.close()
    await this.connect(this.url)
  }

  /**
   * 关闭连接
   */
  close() {
    this.cleanup()
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.isConnected = false
    this.stopHeartbeat()
    this.messageQueue = []
  }

  /**
   * 添加事件监听器
   */
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(listener)
  }

  /**
   * 移除事件监听器
   */
  off(event, listener) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event)
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Event listener error for ${event}:`, error)
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
      reconnectAttempts: this.reconnectAttempts,
      messageQueueLength: this.messageQueue.length,
      url: this.url
    }
  }
}

// 游戏Socket管理器
class GameSocketManager extends SocketManager {
  constructor() {
    super()
    this.gameData = {
      tableId: null,
      gameType: null,
      userId: null
    }
    this.audioState = {}
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
    }
    
    const url = socketUrls[gameType]
    if (!url) {
      throw new Error(`Unsupported game type: ${gameType}`)
    }

    await this.connect(url)
  }

  /**
   * 发送初始化消息
   */
  sendInitMessage() {
    // 发送台桌信息
    this.send({
      table_id: this.gameData.tableId,
      game_type: this.gameData.gameType,
      user_id: this.gameData.userId
    })

    // 发送音效设置
    this.sendAudioState()
  }

  /**
   * 发送音效状态
   */
  sendAudioState() {
    this.send({
      code: 205,
      user_id: this.gameData.userId,
      msg: this.audioState
    })
  }

  /**
   * 更新音效状态
   */
  updateAudioState(audioState) {
    this.audioState = audioState
    if (this.isConnected) {
      this.sendAudioState()
    }
  }

  /**
   * 重写连接打开处理
   */
  handleMessage(message) {
    // 调用父类方法
    super.handleMessage(message)
    
    // 连接成功后发送初始化消息
    if (this.isConnected && this.gameData.userId) {
      this.sendInitMessage()
    }
  }
}

export { SocketManager, GameSocketManager }