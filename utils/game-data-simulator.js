// utils/game-data-simulator.js - 游戏数据模拟器
/**
 * 游戏数据模拟器
 * 用于模拟在线人数和投注金额的动态变化
 */

/**
 * 在线用户数模拟器
 */
class OnlineUsersSimulator {
  constructor(options = {}) {
    // 配置参数
    this.min = options.min || 30
    this.max = options.max || 100
    this.changePercentage = options.changePercentage || 0.05 // 每次变化幅度为当前值的5%
    this.updateInterval = {
      min: options.updateInterval?.min || 30000, // 最小更新间隔30秒
      max: options.updateInterval?.max || 60000  // 最大更新间隔60秒
    }
    
    // 状态管理
    this.currentUsers = 0
    this.timer = null
    this.lastUpdateTime = 0
    this.isRunning = false
    this.updateCallback = options.updateCallback || (() => {})
    
    // 初始化用户数
    this.currentUsers = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
  }
  
  /**
   * 启动模拟器
   */
  start() {
    if (this.isRunning) {
      console.log('在线用户模拟器已在运行')
      return
    }
    
    this.isRunning = true
    this.scheduleNextUpdate()
    console.log('在线用户模拟器启动，初始用户数:', this.currentUsers)
    
    // 立即触发一次回调
    this.updateCallback(this.currentUsers)
  }
  
  /**
   * 停止模拟器
   */
  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.isRunning = false
    console.log('在线用户模拟器已停止')
  }
  
  /**
   * 安排下次更新
   */
  scheduleNextUpdate() {
    if (!this.isRunning) return
    
    const interval = this.getRandomUpdateInterval()
    this.timer = setTimeout(() => {
      this.updateUsers()
      this.scheduleNextUpdate()
    }, interval)
  }
  
  /**
   * 更新用户数
   */
  updateUsers() {
    const currentTime = Date.now()
    
    // 防止更新过于频繁
    if (currentTime - this.lastUpdateTime < 25000) {
      return
    }
    
    // 计算变化幅度
    const changeRange = Math.floor(this.currentUsers * this.changePercentage)
    const change = Math.floor(Math.random() * (changeRange * 2 + 1)) - changeRange
    
    let newUsers = this.currentUsers + change
    
    // 确保在合理范围内
    newUsers = Math.max(this.min, Math.min(this.max, newUsers))
    
    // 更新状态
    this.currentUsers = newUsers
    this.lastUpdateTime = currentTime
    
    console.log(`在线用户数更新: ${newUsers}`)
    
    // 触发回调
    this.updateCallback(this.currentUsers)
  }
  
  /**
   * 获取随机更新间隔
   */
  getRandomUpdateInterval() {
    const { min, max } = this.updateInterval
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  /**
   * 获取当前用户数
   */
  getCurrentUsers() {
    return this.currentUsers
  }
  
  /**
   * 设置配置
   */
  updateConfig(options) {
    Object.assign(this, options)
  }
}

/**
 * 投注金额模拟器
 */
class BetAmountSimulator {
  constructor(options = {}) {
    // 配置参数
    this.minTarget = options.minTarget || 0
    this.maxTarget = options.maxTarget || 2000 // 最大2000
    this.updateFrequency = options.updateFrequency || 2.5 // 每秒更新次数
    this.bettingDuration = options.bettingDuration || 35 // 投注持续时间（秒）
    this.updateInterval = options.updateInterval || 400 // 更新间隔（毫秒）
    
    // 状态管理
    this.currentAmount = 0
    this.targetAmount = 0
    this.increment = 0
    this.timer = null
    this.isRunning = false
    this.isBettingPhase = false
    this.lastResetTime = 0
    this.updateCallback = options.updateCallback || (() => {})
    
    this.init()
  }
  
  /**
   * 初始化投注数据
   */
  init() {
    this.currentAmount = 0
    this.targetAmount = this.generateRandomTarget()
    this.increment = this.calculateIncrement()
    this.isBettingPhase = false
    console.log('投注模拟器初始化，目标金额:', this.formatAmount(this.targetAmount))
  }
  
  /**
   * 生成随机目标金额
   */
  generateRandomTarget() {
    return Math.floor(Math.random() * (this.maxTarget - this.minTarget + 1)) + this.minTarget
  }
  
  /**
   * 计算增长量
   */
  calculateIncrement() {
    const totalUpdates = this.updateFrequency * this.bettingDuration
    return this.targetAmount / totalUpdates
  }
  
  /**
   * 启动模拟器
   */
  start() {
    if (this.isRunning) {
      return
    }
    
    this.isRunning = true
    console.log('投注金额模拟器启动')
    
    // 立即触发一次回调
    this.updateCallback(this.currentAmount)
  }
  
  /**
   * 停止模拟器
   */
  stop() {
    this.stopTimer()
    this.isRunning = false
    console.log('投注金额模拟器已停止')
  }
  
  /**
   * 开始投注阶段
   */
  startBettingPhase(reason = '') {
    if (!this.isRunning) return
    
    console.log('开始投注阶段:', reason)
    this.isBettingPhase = true
    this.startTimer()
  }
  
  /**
   * 结束投注阶段
   */
  stopBettingPhase(reason = '') {
    console.log('结束投注阶段:', reason)
    this.isBettingPhase = false
    this.stopTimer()
  }
  
  /**
   * 重置投注数据
   */
  reset(reason = '') {
    console.log('重置投注金额:', reason)
    
    this.stopTimer()
    this.currentAmount = 0
    this.targetAmount = this.generateRandomTarget()
    this.increment = this.calculateIncrement()
    this.isBettingPhase = false
    this.lastResetTime = Date.now()
    
    console.log('新的投注目标:', this.formatAmount(this.targetAmount))
    
    if (this.isRunning) {
      this.updateCallback(this.currentAmount)
    }
  }
  
  /**
   * 启动定时器
   */
  startTimer() {
    this.stopTimer()
    
    if (!this.isBettingPhase) {
      return
    }
    
    this.timer = setInterval(() => {
      this.updateAmount()
    }, this.updateInterval)
  }
  
  /**
   * 停止定时器
   */
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  
  /**
   * 更新投注金额
   */
  updateAmount() {
    if (!this.isBettingPhase || !this.isRunning) {
      this.stopTimer()
      return
    }
    
    // 基础增长
    this.currentAmount += this.increment
    
    // 添加随机性，让增长更自然
    const randomFactor = 0.8 + Math.random() * 0.4 // 0.8-1.2的随机因子
    this.currentAmount += this.increment * randomFactor * 0.1
    
    // 确保不超过目标金额
    if (this.currentAmount >= this.targetAmount) {
      this.currentAmount = this.targetAmount
      this.stopTimer()
    }
    
    // 确保不小于0
    this.currentAmount = Math.max(0, this.currentAmount)
    
    // 触发回调
    this.updateCallback(this.currentAmount)
  }
  
  /**
   * 格式化金额显示
   */
  formatAmount(amount) {
    if (amount >= 10000) {
      return (amount / 10000).toFixed(1) + '万'
    }
    return Math.floor(amount).toLocaleString()
  }
  
  /**
   * 获取当前投注金额
   */
  getCurrentAmount() {
    return this.currentAmount
  }
  
  /**
   * 获取格式化的当前金额
   */
  getFormattedAmount() {
    return this.formatAmount(this.currentAmount)
  }
  
  /**
   * 更新配置
   */
  updateConfig(options) {
    Object.assign(this, options)
    // 重新计算增长量
    this.increment = this.calculateIncrement()
  }
  
  /**
   * 加速投注增长（用于倒计时最后阶段）
   */
  accelerate(factor = 1.2) {
    this.increment *= factor
    console.log('投注增长加速，新增长率:', this.increment)
  }
}

/**
 * 游戏数据模拟管理器
 * 统一管理所有模拟器
 */
class GameDataSimulator {
  constructor(options = {}) {
    this.options = options
    
    // 创建模拟器实例
    this.onlineUsers = new OnlineUsersSimulator({
      min: options.onlineUsers?.min || 200,
      max: options.onlineUsers?.max || 9000,
      updateCallback: options.onlineUsers?.updateCallback
    })
    
    this.betAmount = new BetAmountSimulator({
      minTarget: options.betAmount?.minTarget || 0,
      maxTarget: options.betAmount?.maxTarget || 200000,
      updateCallback: options.betAmount?.updateCallback
    })
    
    this.isRunning = false
  }
  
  /**
   * 启动所有模拟器
   */
  start() {
    if (this.isRunning) {
      console.log('游戏数据模拟器已在运行')
      return
    }
    
    this.isRunning = true
    this.onlineUsers.start()
    this.betAmount.start()
    console.log('游戏数据模拟器启动完成')
  }
  
  /**
   * 停止所有模拟器
   */
  stop() {
    this.isRunning = false
    this.onlineUsers.stop()
    this.betAmount.stop()
    console.log('游戏数据模拟器已停止')
  }
  
  /**
   * 开始新的投注周期
   */
  startNewBettingCycle(reason = '') {
    this.betAmount.reset('新投注周期: ' + reason)
    setTimeout(() => {
      this.betAmount.startBettingPhase('倒计时开始')
    }, 1000)
  }
  
  /**
   * 结束当前投注周期
   */
  endBettingCycle(reason = '') {
    this.betAmount.stopBettingPhase('投注结束: ' + reason)
  }
  
  /**
   * 加速投注增长（倒计时最后阶段）
   */
  accelerateBetting(factor = 1.2) {
    this.betAmount.accelerate(factor)
  }
  
  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      onlineUsers: this.onlineUsers.getCurrentUsers(),
      betAmount: this.betAmount.getCurrentAmount(),
      formattedBetAmount: this.betAmount.getFormattedAmount()
    }
  }
  
  /**
   * 更新配置
   */
  updateConfig(options) {
    this.options = { ...this.options, ...options }
    
    if (options.onlineUsers) {
      this.onlineUsers.updateConfig(options.onlineUsers)
    }
    
    if (options.betAmount) {
      this.betAmount.updateConfig(options.betAmount)
    }
  }
}

// 导出
export {
  OnlineUsersSimulator,
  BetAmountSimulator,
  GameDataSimulator
}

// 默认导出统一管理器
export default GameDataSimulator