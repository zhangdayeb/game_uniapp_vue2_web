<template>
  <view class="games-page">
    <view class="games-panel">
      <!-- 加载遮罩 开始 -->
      <Loading 
        ref="loading" 
        :custom="false" 
        :shadeClick="false" 
        :type="3"
      />
      <!-- 加载遮罩 结束 -->

      <!-- 游戏类型切换/横幅区域 开始 -->
      <view class="gameListHead">
        <!-- 横幅图片展示 -->
        <view class="gameItem" style="position: relative;">
          <view 
            class="" 
            style="width: 100vw; height: calc(100vw * 0.390); overflow: hidden;"
          >
            <u-image 
              width="100%" 
              height="145%" 
              src="../../static/img/index/banner.png"
            />
          </view>
        </view>
      </view>
      <!-- 游戏类型切换/横幅区域 结束 -->

      <!-- 游戏台桌列表区域 开始 -->
      <view class="gameListContent">
        <view class="gameList">
          <!-- 下拉刷新动画图标 -->
          <view class="game_refresh" v-if="triggered">
            <image 
              :class="{'game-refresh-animation': triggered}" 
              src="../../static/img/index/refresh.svg" 
              mode=""
            />
          </view>

          <!-- 台桌列表滚动区域 -->
          <scroll-view 
            class="g_list" 
            scroll-y="true"
            @scroll="onscroll($event)" 
            @scrolltoupper="scrolltoupper"
          >
            <!-- 遍历每个游戏台桌 -->
            <view 
              class="baccaratItem" 
              v-for="(tableItem, index) in gameTable" 
              :key="index" 
              @click="toggleChoose()"
            >
              <!-- 台桌选择弹出菜单 开始 -->
              <view class="itemChoose" v-if="showChoose">
                <!-- 点投选项 -->
                <view 
                  class="ChooseText ChooseTextLeft" 
                  @click="intoTelTable(tableItem)"
                >
                  {{ indexLocales.diantou }}
                </view>
                <!-- 网投选项 -->
                <view 
                  class="ChooseText ChooseTextRight" 
                  @click="intoTable(tableItem)"
                >
                  {{ indexLocales.wangtou }}
                </view>
              </view>
              <!-- 台桌选择弹出菜单 结束 -->

              <!-- 台桌顶部信息栏 开始 -->
              <view class="itemTitle">
                <!-- 台桌名称 -->
                <view class="titleText">
                  {{ tableItem.localesTitle }}
                </view>

                <!-- 赔率参数显示区域 -->
                <view class="parameter">
                  <!-- 维护状态下显示0 -->
                  <text class="p" v-if="tableItem.status == 0">0</text>
                  <text class="t" v-if="tableItem.status == 0">0</text>
                  <text class="b" v-if="tableItem.status == 0">0</text>

                  <!-- 洗牌状态下显示0 -->
                  <text class="p" v-if="tableItem.wash_status == 1">0</text>
                  <text class="t" v-if="tableItem.wash_status == 1">0</text>
                  <text class="b" v-if="tableItem.wash_status == 1">0</text>

                  <!-- 正常游戏状态下显示实际赔率 -->
                  <text 
                    class="p" 
                    v-if="tableItem.status == 1 && tableItem.wash_status == 0"
                  >
                    {{ indexLocales.itemZhuang }} {{ tableItem.bjl_b }}
                  </text>
                  <text 
                    class="t" 
                    v-if="tableItem.status == 1 && tableItem.wash_status == 0"
                  >
                    {{ indexLocales.itemXian }} {{ tableItem.bjl_p }}
                  </text>
                  <text 
                    class="b" 
                    v-if="tableItem.status == 1 && tableItem.wash_status == 0"
                  >
                    {{ indexLocales.itemHe }} {{ tableItem.bjl_t }}
                  </text>
                  <text 
                    class="t" 
                    v-if="tableItem.status == 1 && tableItem.wash_status == 0"
                  >
                    {{ indexLocales.itemZhuangDui }} {{ tableItem.bjl_bpair }}
                  </text>
                  <text 
                    class="b" 
                    v-if="tableItem.status == 1 && tableItem.wash_status == 0"
                  >
                    {{ indexLocales.itemXianDui }} {{ tableItem.bjl_ppair }}
                  </text>
                  <text 
                    class="p" 
                    v-if="tableItem.status == 1 && tableItem.wash_status == 0"
                  >
                    {{ indexLocales.itemJuPu }} {{ tableItem.bjl_pu }}
                  </text>
                </view>
              </view>
              <!-- 台桌顶部信息栏 结束 -->

              <!-- 台桌主体内容区域 开始 -->
              <view class="itemBody">
                <!-- 游戏桌面和路珠显示区域 -->
                <view class="desktop">
                  <!-- 根据游戏类型加载不同的路珠iframe -->
                  <!-- 龙虎游戏路珠 -->
                  <iframe 
                    class="games-iframe" 
                    v-if="tableItem.game_type == 2" 
                    :src="configService.lzLhUrl + indexLocales.lzurl + '/list_lh.html?tableId=' + tableItem.id" 
                    scrolling="yes"
                  />
                  <!-- 百家乐游戏路珠 -->
                  <iframe 
                    class="games-iframe" 
                    v-if="tableItem.game_type == 3" 
                    :src="configService.lzBjlUrl + indexLocales.lzurl + '/list_bjl_678.html?tableId=' + tableItem.id" 
                    scrolling="yes"
                  />
                  <!-- 牛牛游戏路珠 -->
                  <iframe 
                    class="games-iframe" 
                    v-if="tableItem.game_type == 6" 
                    :src="`${configService.lzNnUrl}?table_id=${tableItem.id}&game_type=${tableItem.game_type}&user_id=${userInformation.id}&show_type=list`" 
                    scrolling="yes"
                  />
                  <!-- 三公游戏路珠 -->
                  <iframe 
                    class="games-iframe" 
                    v-if="tableItem.game_type == 8" 
                    :src="`${configService.lzThreeUrl}?table_id=${tableItem.id}&game_type=${tableItem.game_type}&user_id=${userInformation.id}&show_type=list`" 
                    scrolling="yes"
                  />

                  <!-- 台桌状态覆盖层 -->
                  <view class="cover">
                    <view 
                      class="state countDown" 
                      :style="tableItem.countDownWenzi"
                    >
                      {{ tableItem.showCoverText }}
                      <image 
                        src="/static/img/index/start.png" 
                        style="width: 108rpx; height: 96rpx; display: none;" 
                        :style="tableItem.showImg"
                      />
                    </view>
                  </view>
                </view>
              </view>
              <!-- 台桌主体内容区域 结束 -->
            </view>

            <!-- 台桌数量不足时的占位区域 -->
            <view class="desktop-null" v-if="gameTable.length < 4" />
          </scroll-view>
        </view>
      </view>
      <!-- 游戏台桌列表区域 结束 -->
    </view>
  </view>
</template>

<script>
import api from "@/api/game"
import tools from '@/common/util/tools.js'
import Loading from '@/components/loading/loading.vue'
import configService from '@/common/service/config.service.js'
import apiService from "../../api/api"

export default {
  name: 'GamesPage',
  
  components: {
    Loading
  },
  
  props: {
    // 页面编号
    pageNo: {
      type: [String, Number],
      default: ''
    },
    // 游戏类型ID
    game_type_id: {
      type: [String, Number],
      default: ''
    },
    // 是否正在下拉刷新
    isOnPullDownRefresh: {
      type: Boolean,
      default: false
    },
    // 是否到达底部
    isonReachBottom: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      // 用户信息
      user: uni.getStorageSync('login_user_info'),
      
      // 游戏相关数据
      gameList: [], // 游戏类型列表
      gameTable: [], // 游戏台桌列表
      gamePage: 3, // 当前游戏页面
      swiperCurrent: 0, // 轮播图当前索引
      counTDown: 0, // 倒计时
      
      // WebSocket相关
      type_class: {}, // 游戏类型分类
      
      // 定时器
      temp_timer: null,
      
      // UI状态
      gameTypeChoseText: '百家乐', // 当前选择的游戏类型文本
      pageHide: false, // 页面隐藏状态
      triggered: false, // 下拉刷新触发状态
      isToupper: false, // 是否在顶部
      showChoose: false, // 是否显示选择菜单
      
      // 配置和国际化
      configService: configService, // 配置服务
      indexLocales: this._i18n.messages[this.$storageLan].index, // 国际化文本
      userInformation: uni.getStorageSync('login_user_info') // 用户信息
    }
  },
  
  // 监听器
  watch: {
    // 可以在这里监听数据变化
  },
  
  /**
   * 页面挂载完成
   */
  mounted() {
    console.log("this.pageNo gamePage:" + this.pageNo)
    
    // 设置当前tab状态
    uni.setStorageSync('tabbar', 1)
    
    // 初始化页面数据
    this.initPageData()
  },
  
  /**
   * 页面卸载时清理资源
   */
  onUnload() {
    this.cleanupResources()
  },
  
  methods: {
    /**
     * 初始化页面数据
     */
    async initPageData() {
      try {
        // 显示加载动画
        this.$refs.loading.open()
        
        // 获取游戏信息和台桌列表
        await Promise.all([
          this.getGameInfo(),
          this.getTableList()
        ])
        
        // 2秒后关闭加载动画
        setTimeout(() => {
          this.$refs.loading.close()
        }, 2000)
      } catch (error) {
        console.error('初始化页面数据失败:', error)
        this.$refs.loading.close()
      }
    },
    
    /**
     * 清理页面资源
     */
    cleanupResources() {
      
      // 清理定时器
      if (this.temp_timer) {
        clearTimeout(this.temp_timer)
        this.temp_timer = null
      }
      
      // 设置页面隐藏状态
      this.pageHide = true
    },
    
    /**
     * 切换选择菜单显示状态
     */
    toggleChoose() {
      this.showChoose = !this.showChoose
    },
    
    /**
     * 滚动事件处理
     * @param {Object} e - 滚动事件对象
     */
    onscroll(e) {
      // 可以在这里处理滚动逻辑
    },
    
    /**
     * 滚动到顶部触发事件（下拉刷新）
     * @param {Object} e - 触顶事件对象
     */
    scrolltoupper(e) {
      // 触发刷新动画
      this.triggered = true
      
      // 2秒后关闭刷新动画
      setTimeout(() => {
        this.triggered = false
      }, 2000)
      
      console.log("滚动到顶部", e)
      
      // 刷新数据
      this.refreshData()
    },
    
    /**
     * 刷新页面数据
     */
    async refreshData() {
      try {
        await this.getTableList()
      } catch (error) {
        console.error('刷新数据失败:', error)
      }
    },
    
    /**
     * 获取台桌列表
     */
    async getTableList() {
      try {
        const res = await apiService.getTableList({ 
          type_id: this.game_type_id 
        })
        
        if (res.data.code == 200) {
          this.gameTable = res.data.data
          this.sortTableList()
          this.getTableState()
        }
      } catch (err) {
        console.error('获取台桌列表失败:', err)
      }
    },
    
    /**
     * 获取游戏信息
     */
    async getGameInfo() {
      try {
        const res = await api.gameType(this.loginform)
        this.loading = false
        
        if (res.data.code == 200) {
          this.gameList = res.data.data
        } else {
          // 可以在这里处理错误
          // this.$tip.alert(res.data.message)
        }
      } catch (error) {
        console.error('获取游戏信息失败:', error)
        this.loading = false
      }
    },
    
    /**
     * 台桌列表排序（按ID升序）
     */
    sortTableList() {
      this.gameTable.sort((x, y) => {
        if (x.id > y.id) {
          return 1
        } else if (x.id < y.id) {
          return -1
        } else {
          return 0
        }
      })
    },
    
    /**
     * 遍历并设置台桌状态
     * 根据台桌的不同状态设置显示文本和样式
     */
    getTableState() {
      this.gameTable.forEach((tabItem, index) => {
        let showCoverText_temp = '' // 覆盖层显示文本
        let countDownWenzi_temp = '' // 倒计时样式
        let showImg_temp = '' // 图片显示样式
        
        if (tabItem.status == 1) {
          // 台桌正常运行状态
          
          if (tabItem.run_status == 0) {
            // 暂停状态
            countDownWenzi_temp = { border: 'none', background: "none" }
            showCoverText_temp = this.indexLocales.pause
          }
          
          if (tabItem.wash_status != 1) {
            // 非洗牌状态
            if (tabItem.end_time >= 0 && tabItem.run_status != 2) {
              // 显示倒计时
              countDownWenzi_temp = {}
              showImg_temp = {}
              showCoverText_temp = tabItem.end_time
              this.$set(tabItem, 'showCoverText', showCoverText_temp)
            } else {
              // 非倒计时状态
              countDownWenzi_temp = { border: 'none', background: "none" }
              showImg_temp = { display: 'block' }
            }
          }
          
          if (tabItem.wash_status == 1) {
            // 洗牌状态
            countDownWenzi_temp = { border: 'none', background: "none" }
            showImg_temp = { display: 'none' }
            showCoverText_temp = this.indexLocales.shuffle
          }
        } else {
          // 维护状态
          countDownWenzi_temp = { border: 'none', background: "none" }
          showCoverText_temp = this.indexLocales.maintenance
        }
        
        // 使用$set确保响应式更新
        this.$set(tabItem, 'showCoverText', showCoverText_temp)
        this.$set(tabItem, 'countDownWenzi', countDownWenzi_temp)
        this.$set(tabItem, 'showImg', showImg_temp)
      })
    },
    
    /**
     * 进入台桌（网投版本）
     * @param {Object} tableItem - 台桌信息对象
     */
    intoTable(tableItem) {
      // 清除定时器
      clearTimeout(this.temp_timer)
      
      // 检查台桌状态
      if (tableItem.status == 1) {
        // 台桌正常，可以进入
        this.enterGameTable(tableItem, 'web')
      } else if (tableItem.status > 1) {
        // 台桌维护中
        this.$tip.alert(this.indexLocales.underMaintenance)
      } else {
        // 异常状态
        this.$tip.alert(this.indexLocales.underMaintenance)
      }
    },
    
    /**
     * 进入台桌（点投版本）
     * @param {Object} tableItem - 台桌信息对象
     */
    intoTelTable(tableItem) {
      // 清除定时器
      clearTimeout(this.temp_timer)
      
      // 检查台桌状态
      if (tableItem.status == 1) {
        // 台桌正常，可以进入
        this.enterGameTable(tableItem, 'tel')
      } else if (tableItem.status > 1) {
        // 台桌维护中
        this.$tip.alert(this.indexLocales.underMaintenance)
      } else {
        // 异常状态
        this.$tip.alert(this.indexLocales.underMaintenance)
      }
    },
    
    /**
     * 根据游戏类型和版本进入对应的游戏页面
     * @param {Object} tableItem - 台桌信息
     * @param {String} version - 版本类型 ('web' | 'tel')
     */
    enterGameTable(tableItem, version) {
      // 保存路由参数到本地存储
      uni.setStorageSync('routerParams', {
        table_id: tableItem.id,
        game_type_id: tableItem.game_type
      })
      
      // 根据游戏类型和版本跳转到对应页面
      const gameRoutes = this.getGameRoutes(tableItem.game_type, version)
      
      if (gameRoutes) {
        uni.redirectTo({
          url: `${gameRoutes}?table_id=${tableItem.id}&game_type_id=${tableItem.game_type}`
        })
      }
    },
    
    /**
     * 获取游戏路由路径
     * @param {Number} gameType - 游戏类型
     * @param {String} version - 版本类型
     * @returns {String} 路由路径
     */
    getGameRoutes(gameType, version) {
      const routeMap = {
        2: { // 龙虎
          web: '/pages/live/gameBjlAndLh',
          tel: '/pages/live/gameBjlDian'
        },
        3: { // 百家乐
          web: '/pages/live/gameBjlAndLh',
          tel: '/pages/live/gameBjlDian'
        },
        6: { // 牛牛
          web: '/pages/live/niuniu',
          tel: '/pages/live/niuniu'
        },
        8: { // 三公
          web: '/pages/live/sangong',
          tel: '/pages/live/sangong'
        }
      }
      
      return routeMap[gameType] ? routeMap[gameType][version] : null
    },
    
    /**
     * 返回首页
     */
    goHome() {
      uni.redirectTo({
        url: "/pages/index/index"
      })
    },
    
    /**
     * APP环境下添加特定CSS类
     * @returns {String} CSS类名
     */
    addClass() {
      // #ifdef APP-PLUS
      // return "gameListContentApp"
      // #endif
    },
    
    /**
     * APP环境下为头部添加特定CSS类
     * @returns {String} CSS类名
     */
    addClassHead() {
      // #ifdef APP-PLUS
      // return "gameListHeadApp"
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
/* 选中状态样式 */
.chose {
  background: rgba(218, 167, 58, 0.2);
}

/* 主页面容器 */
.games-page {
  width: 100%;
  height: 100%;
  background-color: #1E1D23;
  
  /* 游戏面板容器 */
  .games-panel {
    position: relative;
    height: 100%;
  }
  
  /* iframe样式 */
  .games-iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
  
  /* APP环境下的头部样式 */
  .gameListHeadApp {
    /* #ifndef APP-PLUS */
    // top: calc(var(--status-bar-height) + 80rpx);
    /* #endif*/
  }
  
  /* 游戏列表头部区域 */
  .gameListHead {
    z-index: 1000;
    width: 100%;
    height: 150rpx;
    background-color: #25252D;
    display: flex;
    justify-content: space-between;
    
    /* 游戏项目样式 */
    .gameItem {
      width: 100%;
      border: 2rpx solid #34333B;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #E5CA9A;
      font-size: 24rpx;
      position: relative;
      
      /* 游戏图标样式 */
      .game-img {
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
        border: 2rpx solid #E5CA9A;
      }
      
      /* 游戏文本样式 */
      .game_text {
        position: absolute;
        bottom: 10rpx;
      }
    }
  }
  
  /* 刷新图标容器 */
  .game_refresh {
    display: flex;
    justify-content: center;
    align-items: center;
    
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
  
  /* 刷新动画 */
  .game-refresh-animation {
    animation: refreshAnimation 1s;
  }
  
  @keyframes refreshAnimation {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* 空白占位区域 */
  .desktop-null {
    height: 320px;
  }
  
  /* 游戏列表内容区域 */
  .gameListContent {
    width: 100%;
    height: calc(100% - 104rpx);
  }
  
  /* 游戏列表容器 */
  .gameList {
    height: 100%;
  }
  
  /* APP环境下的内容样式 */
  .gameListContentApp {
    padding-top: 152rpx;
  }
  
  /* 滚动列表容器 */
  .g_list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    
    /* 百家乐台桌项目 */
    .baccaratItem {
      width: 100%;
      position: relative;
      
      /* 选择菜单覆盖层 */
      .itemChoose {
        position: absolute;
        top: 160rpx;
        height: 54rpx;
        width: 100%;
        z-index: 999999;
        padding-right: 8rpx;
        background-color: rgba(0, 0, 0, .5);
        display: flex;
        justify-content: right;
        align-items: center;
        overflow: hidden;
        
        /* 选择按钮通用样式 */
        .ChooseText {
          font-size: 32rpx;
          color: #E4CC9D;
          text-align: center;
          margin-left: 8rpx;
          width: 100rpx;
          height: 44rpx;
          border-radius: 6rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        /* 点投按钮样式（蓝色） */
        .ChooseTextLeft {
          background-color: #4D88CF;
        }
        
        /* 网投按钮样式（红色） */
        .ChooseTextRight {
          background-color: #FF6568;
        }
      }
      
      /* 台桌标题栏 */
      .itemTitle {
        height: 28rpx;
        line-height: 28rpx;
        width: 100%;
        background-color: #181818;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        /* 标题文本 */
        .titleText {
          font-size: 24rpx;
          transform: scale(.8);
          transform-origin: 0 10%;
          color: #E4CC9D;
          margin-left: 20rpx;
        }
        
        /* 参数显示区域 */
        .parameter {
          font-size: 24rpx;
          transform: scale(.8);
          transform-origin: 70% 20%;
          
          /* 参数项通用样式 */
          .p, .t, .b {
            margin-left: 40rpx;
            position: relative;
          }
          
          /* 参数项圆点图标 */
          .p:after, .t:after, .b:after {
            width: 20rpx;
            height: 20rpx;
            line-height: 20rpx;
            border-radius: 50%;
            position: absolute;
            left: -20rpx;
            top: calc(50% - 10rpx);
            color: #FFFFFF;
            font-size: 24rpx;
            text-align: center;
          }
          
          /* P点样式（蓝色） */
          .p:after {
            background-color: #4D88CF;
          }
          
          /* T点样式（绿色） */
          .t:after {
            background-color: #4F8675;
          }
          
          /* B点样式（红色） */
          .b:after {
            background-color: #FF6568;
          }
          
          /* 文字颜色对应点的颜色 */
          .p { color: #4D88CF; }
          .t { color: #4F8675; }
          .b { color: #FF6568; }
        }
      }
      
      /* 台桌主体内容 */
      .itemBody {
        display: flex;
        background-color: #FFFFFF;
        height: 280rpx;
        
        /* 荷官头像区域（已注释） */
        .LotusOfficer {
          width: 152rpx;
          background-color: #070f29;
        }
        
        /* 桌面游戏区域 */
        .desktop {
          width: 100%;
          position: relative;
          
          /* 状态覆盖层 */
          .cover {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            z-index: 99;
          }
          
          /* 状态显示位置 */
          .state {
            position: absolute;
            right: 60rpx;
            top: 4rpx;
            z-index: 999;
          }
          
          /* 倒计时圆形显示 */
          .countDown {
            text-align: center;
            width: 100rpx;
            height: 100rpx;
            line-height: 100rpx;
            font-size: 44rpx;
            font-weight: 600;
            background-color: rgba(0, 0, 0, .6);
            border-radius: 50%;
            border: 4rpx solid;
            border-color: #FB5D56;
            color: #FB5D56;
            display: block;
            word-break: keep-all;
          }
        }
      }
      
      /* 台桌底部区域（已注释） */
      .itemFooter {
        width: 100%;
        background-color: #1A1716;
      }
    }
  }
  
  /* 轮播图样式 */
  uni-swiper {
    height: 976rpx;
  }
}
</style>