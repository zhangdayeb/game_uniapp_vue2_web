// utils/viewport-fix.js - Safari视口高度修复工具

/**
 * Safari视口高度修复器
 * 解决iPhone Safari浏览器工具栏导致的视口高度问题
 */
class SafariViewportFixer {
  constructor() {
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    this.debounceTimer = null
    this.initialized = false
    
    console.log('Safari视口修复器初始化:', {
      isIOS: this.isIOS,
      isSafari: this.isSafari
    })
  }
  
  /**
   * 初始化视口修复
   */
  init() {
    if (this.initialized) {
      return
    }
    
    // 立即设置一次
    this.setViewportHeight()
    
    // 监听事件
    this.addEventListeners()
    
    this.initialized = true
    console.log('Safari视口修复器启动完成')
  }
  
  /**
   * 添加事件监听器
   */
  addEventListeners() {
    // 窗口大小改变事件
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true })
    
    // 方向改变事件
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this), { passive: true })
    
    // 页面可见性改变事件
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    
    // iOS特有的滚动事件
    if (this.isIOS && this.isSafari) {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
    }
  }
  
  /**
   * 设置视口高度CSS变量
   */
  setViewportHeight() {
    try {
      // 获取真实的视口高度
      const realHeight = window.innerHeight
      const realVh = realHeight * 0.01
      
      // 设置CSS自定义属性
      document.documentElement.style.setProperty('--real-vh', `${realVh}px`)
      
      console.log('视口高度更新:', {
        windowInnerHeight: realHeight,
        realVh: realVh
      })
      
    } catch (error) {
      console.error('设置视口高度失败:', error)
    }
  }
  
  /**
   * 防抖处理视口变化
   */
  debounceViewportUpdate() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    
    this.debounceTimer = setTimeout(() => {
      this.setViewportHeight()
    }, 100)
  }
  
  /**
   * 处理窗口大小改变
   */
  handleResize() {
    console.log('窗口大小改变')
    this.debounceViewportUpdate()
  }
  
  /**
   * 处理方向改变
   */
  handleOrientationChange() {
    console.log('设备方向改变')
    // 方向改变时需要延迟一下
    setTimeout(() => {
      this.setViewportHeight()
    }, 300)
  }
  
  /**
   * 处理页面可见性改变
   */
  handleVisibilityChange() {
    if (!document.hidden) {
      console.log('页面变为可见，更新视口高度')
      setTimeout(() => {
        this.setViewportHeight()
      }, 100)
    }
  }
  
  /**
   * 处理滚动事件
   */
  handleScroll() {
    // Safari工具栏显示/隐藏时会触发滚动
    this.debounceViewportUpdate()
  }
  
  /**
   * 手动强制更新视口高度
   */
  forceUpdate() {
    console.log('强制更新视口高度')
    this.setViewportHeight()
  }
  
  /**
   * 销毁视口修复器
   */
  destroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    
    // 移除事件监听器
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('orientationchange', this.handleOrientationChange)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    
    if (this.isIOS && this.isSafari) {
      window.removeEventListener('scroll', this.handleScroll)
    }
    
    this.initialized = false
    console.log('Safari视口修复器已销毁')
  }
}

// 创建全局实例
let safariViewportFixer = null

/**
 * 初始化Safari视口修复
 */
export function initSafariViewportFix() {
  if (!safariViewportFixer) {
    safariViewportFixer = new SafariViewportFixer()
  }
  safariViewportFixer.init()
  return safariViewportFixer
}

/**
 * 强制更新视口高度
 */
export function forceUpdateViewport() {
  if (safariViewportFixer) {
    safariViewportFixer.forceUpdate()
  }
}

/**
 * 销毁视口修复器
 */
export function destroyViewportFixer() {
  if (safariViewportFixer) {
    safariViewportFixer.destroy()
    safariViewportFixer = null
  }
}

// 默认导出初始化函数
export default initSafariViewportFix