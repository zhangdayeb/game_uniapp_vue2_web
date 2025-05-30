<template>
	<view class="live-page" id="live-page">
		<Loading ref="loading" :custom="false" :shadeClick="false" :type="3" ></Loading>
		<view class="live-container" v-if="this.loadingState_tableDataInfo == 1" >
			<!-- 进入的欢迎语 开始 -->
			<!-- <welcomeMsg v-if="showWelcomeMsg" @closeMsg="closeMsg" :msg="welcomeMsg"></welcomeMsg> -->
			<!-- 进入的欢迎语 结束 -->
			
			<!-- 头部 组件 开始 -->
			<headbar ref="headBar" :tableType="tableType" :tableDataInfo="initTableInfo" :tableRunInfo="tableRunInfo" ></headbar>
			<!-- #ifdef APP-PLUS -->
			<view class="for_header_postion"></view>
			<!-- #endif -->
			<!-- 头部 组件 结束 -->
			
			<!-- 视频显示区域 开始  -->
			<view class="live-box" >
				<!-- 默认加载背景 开始 -->
				<view style="z-index: 1;" class="live-loading" >
					<view class="live-loading-panel">
						<image class="live-loading-img" src="/static/img/live/loading.svg" mode="" ></image>
						<view class="">
							{{liveLocales.selectNetwork}}
						</view>
					</view>					
				</view>
				<!-- 默认加载背景 开始 -->
				
				<!-- 近景摄像头 开始 :class="{'live-video-top': !videoEnlarge}"-->
				<view v-if="videoEnlarge" class="live-video" id="live-video-near" >
					<iframe class="live-details" frameborder="0" scrolling="no" :src="videoNear" ></iframe>
				</view>
				<!-- 近景摄像头 结束 -->
				<!-- 远景摄像头 开始 :class="{'live-video-top': videoEnlarge}"-->
				<view v-else  class="live-video" id="live-video-far" >
					<iframe class="live-details" frameborder="0" scrolling="no" :src="videoFar" ></iframe>
				</view>
				<!-- 远景摄像头 结束 -->
				<!-- 倒计时圈圈 开始 -->
				<view  class="live-count-down" v-if="endTime > 0" >
					<circleProgress :percent="percent" :size="50" :circleWidth="2" :circleColor="activeColor" :innerbgColor="innerbgColor" :defaultColor="defaultColor">
						<text class="live-count-second" :class="{'live-active-color': endTime < 6}">{{endTime}}</text>
					</circleProgress>
				</view>
				<!-- 倒计时圈圈 结束 -->
				<!-- 洗牌状态 标记  开始 -->
				<view class="live-shuffle" v-if="tableRunInfo.wash_status == 1" >
					{{$locales.index.shuffle}}
				</view>
				<!-- 洗牌状态 标记  结束 -->
				<!-- 消息状态 通知栏  开始 -->
				<view class="live-notice" v-if="showMsgOpen">
					{{activityDescribeText}}
				</view>
				<view class="live-notice" v-if="showWinMsgOpen">
					{{showWinMsgText}}
				</view>
				<!-- 消息状态 通知栏  结束 -->
				<!-- 视频放大缩小  开始 -->
				<view class="live-zoom" style="z-index: 21;">
					<image src="/static/img/live/enlarge.svg" mode="" v-if="!videoEnlarge" @click="handleZoom()"></image>
					<image src="/static/img/live/reduce.svg" mode="" v-if="videoEnlarge" @click="handleZoom()"></image>
				</view>
				<!-- 视频刷新按钮 -->
				<view class="live-zoom" style="z-index: 21; top:80rpx" @tap="refreshIframe()">
					<u-icon :class="{'video-animation': startAnimation}" name="reload" color="#ffffbc"  size="48" ></u-icon>
				</view>
				<!-- 视频放大缩小  结束 -->
			</view>
			<!-- 视频显示区域 结束  -->
			<!--
			<view class="">
				<fProgress :number="betCountDetails.count>100?100:betCountDetails.count" :xueNumber="betCountDetails.count"></fProgress>
			</view> 
			-->
			<!-- 统计数据 开始  百家乐 -->
			<view class="live-result-detail" v-if="game_type_id == 3">
				<!-- <text>{{liveLocales.totalBet}}:{{betCountDetails.count_money}}</text> -->
				<text class="live-de-zhuang">{{indexLocales.itemZhuang}}:{{betCountDetails.zhuang}}</text>
				<text class="live-de-xian">{{indexLocales.itemXian}}:{{betCountDetails.xian}}</text>
				<text class="live-de-he">{{indexLocales.itemHe}}:{{betCountDetails.he}}</text>
				<text class="live-de-zhuang">{{indexLocales.itemZhuangDui}}:{{betCountDetails.zhuang_dui}}</text>
				<text class="live-de-xian">{{indexLocales.itemXianDui}}:{{betCountDetails.xian_dui}}</text>
				<text>{{liveLocales.totalGames}}:{{betCountDetails.count}}</text>
			</view>
			<!-- 统计数据 结束  百家乐 -->
			<!-- 统计数据 开始  百家乐 -->
			<view class="live-result-detail" v-if="game_type_id == 2">
				<!-- <text>{{liveLocales.totalBet}}:{{betCountDetails.count_money}}</text> -->
				<text class="live-de-zhuang">{{liveLocales.dragon}}:{{betCountDetails.zhuang}}</text>
				<text class="live-de-xian">{{liveLocales.tiger}}:{{betCountDetails.xian}}</text>
				<text class="live-de-he">{{liveLocales.peace}}:{{betCountDetails.he}}</text>
				<text>{{liveLocales.totalGames}}:{{betCountDetails.count}}</text>
			</view>
			<!-- 统计数据 结束  百家乐 -->
			
			<!-- 投注区域 开始  -->
			<view class="live-bet-box">
				<view style="z-index: 0;" class="live-loading" >
					<view class="live-loading-panel">
						<image class="live-loading-img" src="/static/img/live/loading.svg" mode="" ></image>
						<view class="">
							{{liveLocales.selectNetwork}}
						</view>
					</view>					
				</view>
				<iframe style="z-index: 2;position: absolute;" class="live-bet" id="betIframe" frameborder="0" scrolling="no" :src="`${configService.betUrl}/bjlLhV2?table_id=${tableId}&game_type=${game_type_id}&user_id=${userInformation.id}&token=${userToken}`" ></iframe>
			</view>
			
			
			<!-- 露珠 开始 -->
			<view class="details lz_details">
				<view style="z-index: 0;" class="live-loading" @click="reloadLuzhu()">
					<view class="live-loading-panel" >
						<view class="">
							{{liveLocales.selectNetwork}},tap to reload
						</view>
					</view>					
				</view>
				<iframe class="live-details live-details-lz" id="live_details_lz" name="liveDetailsLz" :src="`${lzUrl}?tableId=${tableId}&user_id=${userInformation.id}`" ></iframe>
			</view>
			<!-- 露珠 结束 -->
					
		</view>
	</view>
</template>

<script>
	// 组件导入
	import headbar 		from './head.vue'
	import user 		from "@/api/api"
	import api 			from "@/api/table"
	import circleProgress from '@/components/circle-progress/progress.vue'
	import fProgress from '@/components/f-progress/f-progress.vue'
	import welcomeMsg 	from '@/components/live/welcome.vue'
	import Bus from "@/common/util/bus.js"
	import tools from '@/common/util/tools.js'
	import Loading from '@/components/loading/loading.vue'
	
	
	// 导入JS
	import apiService from '@/api/game.js'
	import {BJL_URL,LH_URL,SocketTask} from '@/api/socket.js'
	import configService from '@/common/service/config.service.js'
	// import AudioHandle from '@/common/service/audio.js'
	

	//音乐类型 背景音乐  音效
	const MUSIC_TYPE = {
		backgroundMusicState: 'backgroundMusicState',
		musicEffectSate: 'musicEffectSate'
	}
	
	// 默认数据
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
				indexLocales: this._i18n.messages[this.$storageLan].index,
				tableType:'dianji',									// 传递给组件的
				// 特殊配置
				game_type_id:3,											// 游戏类型设定 1 牛牛 2 龙虎 3 百家乐   onload 会重载的
				lzUrl:'',												// 露珠URL
				welcomeMsg:'欢迎光临XXX游戏',							// 欢迎光临信息
				audioPath:'bjl',										// 音频文件路径
				tableId: -1,											// table_id 当前桌子的ID
				startShowWelcomeTime:35,								// 当秒数为这个时，提示已开局，请下注
				showMsgOpen: false,										// 显示提示信息 默认关闭
				showMsgOpenTime:3500,									// 提示消息时间长短
				stopMusicHasPlayed:false,								// 防止无限播放 停止的那个
				//用户基本信息
				userInformation: {},									// 用户基本信息 用来检测用户是否登录
				gameUserInfo: {},                                       // 游戏里用户信息 检测限红
				limitRed: [],                                           // 限红数据
				betCountDetails: {},									// 当前台桌所有用户下注的真实统计信息
				bureauNumber: '',										// 靴号 铺号  用来判读数据 是否是新的数据
				resultInfo: {},											// 开牌信息
				initTableInfo:{},										// 初始化 台桌信息 仓库
				socketTask: null,					// 初始化 socket 句柄
				configService:configService,							// 初始化 服务配置项目
				// audioHandle: new AudioHandle(),							// 初始化 音频项目导入
				// 筹码
				tableRunInfo: {},										// 牌桌 运行信息
				percent: 100,											// 进度 圆圈的 倒计时
				getInfotimerHandle: null,								// 定时句柄 后台获取游戏状态的句柄  
				activeColor: '#78E07A',									// 激活倒计时颜色
				activityDescribeText: '',								// 活动描述
				innerbgColor: 'RGB(0,0,0,.6)',							// 圈内颜色
				defaultColor: 'rgb(135,135,135,.1)',					// 圆环底部颜色
				endTime: -99,											// tableRunInfo.end_time
				showWelcomeMsg: false,									// 所有浏览器进入
				showBeginning: false,									// 展示开局中
				played: 'init',											// 是否 投注过 .......
				pageVisibility: false,									// 页面可视状态				
				welcomePlayed: false,									// 是否播入过欢迎光临
				//视频 加载
				videoLoadState: true,									// 视频 加载状态
				videoEnlarge: false,									// 视频 远近景 切换按钮				
				videoFar:'',											// 远景 地址 后台获取
				videoNear:'',											// 近景 地址 后台获取
				startAnimation: false,									// 刷新动画
				visibilityChangeEvent: '',                              // 可视页面事件
				hiddenProperty: '',                                     // 兼容各种页面隐藏
				liveLocales: this._i18n.messages[this.$storageLan].live, 	//直播视频页语言
				maintainData: {},                                        	//维护状态数据
				showWinMsgOpen:false,                                   //输赢展示
				showWinMsgText:'',                                    	//输赢展示
				pageHiddenTimer:null,
				// 各种加载状态
				loadingState_limitRed:0,								// 游戏限红 非个人限红 状态  		---> 影响投注 状态
				loadingState_tableDataInfo:0,							// 台桌 静态信息 状态				---> 影响投注 状态
				loadingState_tableRunInfo:0,							// 台桌 运行的 状态				---> 影响投注 状态
				loadingState_choiceChips:0,								// 用户筹码 状态					---> 影响投注 状态
				loadingState_betState:0,								// 开启投注 状态					---> 影响投注 状态
				loadingState_endState:0,								// 结束投注 状态					---> 影响投注 状态
				loadingState_resultInfo:0,								// 开牌结果 状态					---> 影响投注 状态
				//龙虎输赢状态 1龙赢 2虎赢 3和
				winState: {
					dragon: 1,
					tiger: 2,
					peace: 3
				},
				//接收结果状态
				receiveResultState:  false,
				//音频播放状态
				audioState: {},
				userToken: uni.getStorageSync('Access-Token')
			};
		},
		// 页面初始化
		onLoad(option) {
			// 有参数
			this.tableId = option.table_id
			this.tablePre = option.game_type_id + '_' + option.table_id + '_storage_flag_'
			this.userInformation = uni.getStorageSync('login_user_info')
			uni.setStorageSync('routerParams',{table_id: option.table_id, game_type_id: option.game_type_id})
			// 初始化音频新
			// this.audioHandle.backgroundMusicState = uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on'
			// this.audioHandle.musicEffectSate = uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
			// 加载过后
			this.showWelcomeMsg = true
			this.game_type_id = option.game_type_id
			// 兼容龙虎 游戏处理
			if(option.game_type_id == 3){
				// 百家乐 防止其它特殊针对性的 更新
				this.lzUrl = configService.lzBjlUrlMain + this.liveLocales.lzurl + '/lucky6_type2_xianchang_v2.html'
				// this.welcomeMsg = this.liveLocales.welcomeBaccarat  
				// this.audioHandle.audioPath = 'bjl'
			}
			if(option.game_type_id == 2){
				this.lzUrl = configService.lzLhUrlMain + this.liveLocales.lzurl + '/lh_type1.html'
				// 龙虎 防止其它特殊针对性的 更新
				// this.lzUrl = configService.lzLhUrlMain
				// this.welcomeMsg = this.liveLocales.welcomeLongHu
				// this.audioHandle.audioPath = 'longhu'
			}
			
		},
		// 页面前台展示
		onShow() {
			this.socketTask = this.game_type_id == 3 ? new SocketTask(BJL_URL) : new SocketTask(LH_URL)
			this.getNoticeList()
			uni.setStorageSync('LivePageState','show')
			this.switchAudioByBrowerStart()
			this.initSocket()					// 初始化 socket 连接
		},
		// 挂载程序
		mounted(){
			this.$refs.loading.open();
			//#ifdef H5
				this.setHiddenProperty()
			//#endif
			setTimeout(() => {
				uni.pageScrollTo({
		　　　　　　scrollTop: 0, duration: 300 
		　　　　});
			},600)
			 
			uni.setStorageSync('LivePageState','show')
			// 一次性初始化
			this.getTableInfoVideo()			// 初始化 获取台桌视频  
			this.getGameTableInfoInit()			// 初始化 获取台桌初始化信息 
			// 启动后 2个 循环定时的任务
			this.getGameBetCount()				// 获取游戏下注信息
			this.addEventSettingMusic()
			setTimeout(() => {
				this.$refs.loading.close();
			}, 4000)
		},
		// 页面后台运行
		onHide() {
			clearTimeout(this.pageHiddenTimer)
			clearInterval(this.getInfotimerHandle) 
			uni.setStorageSync('LivePageState','hidden')
			this.switchAudioByBrowerStop()
			this.socketTask.close()
		},
		// 退出
		onUnload() {
			clearTimeout(this.pageHiddenTimer)
			clearInterval(this.getInfotimerHandle) 
			uni.setStorageSync('LivePageState','hidden')
			this.switchAudioByBrowerStop()
			this.socketTask.close()								// 关闭 socket 连接
		},
		// 销毁
		destroyed() {
			clearTimeout(this.pageHiddenTimer)
			uni.setStorageSync('LivePageState','hidden')
			this.switchAudioByBrowerStop()
			clearInterval(this.getInfotimerHandle)             // 清除定期获取游戏倒计时状态的时间句柄
			this.socketTask.close()
			Bus.$off('setMusicType', this.addEventSettingMusic())
		},
		methods: {
			reloadLuzhu(){
				let lzIframe = document.getElementById('live_details_lz')
				// document.frames("liveDetailsLz").location.reload(true);
				lzIframe.src = `${this.lzUrl}?tableId=${this.tableId}&user_id=${this.userInformation.id}`
				// <iframe class="live-details" id="live_details_lz" :src="`${lzUrl}?tableId=${tableId}&user_id=${userInformation.id}`" ></iframe>
			},
			//监听设置音效和背景音乐
			addEventSettingMusic(){
				Bus.$on('setMusicType', (data) =>{
					this.audioState = {
						backgroundMusicState: uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on',
						musicEffectSate: uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
					}
					this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, voiceSwitch:'voiceSwitch', msg: this.audioState})
					switch (data) {
						case MUSIC_TYPE.backgroundMusicState: 
							// this.audioHandle.startSoundBackground()
						break
						case MUSIC_TYPE.musicEffectSate: 
						break
					}
				}) 
			},
			/**
			 * 获取整站维护通知
			 * */
			getNoticeList(){
				this.$maintainState.getNoticeList().then(res => {
					this.maintainData = res
					if(this.maintainData.web_maintain_status == this.$WEB_MAINTAIN_STATE){
						uni.navigateTo({
							url: '/pages/maintain/maintain'
						})
					}
				})
			},
			// 获取浏览器
			getBrowser() {
			    var UserAgent = navigator.userAgent.toLowerCase();
			    var browserInfo = {};
			    var browserArray = {
			        IE: window.ActiveXObject || "ActiveXObject" in window, // IE
			        Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
			        Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
			        Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
			        Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1, // safari浏览器
			        Edge: UserAgent.indexOf('edge') > -1, // Edge浏览器
			        QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
			        WeixinBrowser: /MicroMessenger/i.test(UserAgent) // 微信浏览器
			    };
			    for (var i in browserArray) {
			        if (browserArray[i]) {
			            var versions = '';
			            if (i == 'IE') {
			                versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
			            } else if (i == 'Chrome') {
			                for (var mt in navigator.mimeTypes) {
			                    //检测是否是360浏览器(测试只有pc端的360才起作用)
			                    if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin') {
			                        i = '360';
			                    }
			                }
			                versions = UserAgent.match(/chrome\/([\d.]+)/)[1];
			            } else if (i == 'Firefox') {
			                versions = UserAgent.match(/firefox\/([\d.]+)/)[1];
			            } else if (i == 'Opera') {
			                versions = UserAgent.match(/opera\/([\d.]+)/)[1];
			            } else if (i == 'Safari') {
			                versions = UserAgent.match(/version\/([\d.]+)/)[1];
			            } else if (i == 'Edge') {
			                versions = UserAgent.match(/edge\/([\d.]+)/)[1];
			            } else if (i == 'QQBrowser') {
			                versions = UserAgent.match(/qqbrowser\/([\d.]+)/)[1];
			            }
			            browserInfo.type = i;
			            browserInfo.versions = parseInt(versions);
			        }
			    }
			    return browserInfo;
			},
			// 刷新 视频刷新 
			refreshIframe(){
				this.startAnimation = true
				//执行刷新动作
				let tempVidelFar = this.videoFar
				let tempVideoNear = this.videoNear
				this.videoFar = ''
				this.videoNear = ''
				setTimeout(() => {
					this.startAnimation = false
					this.videoFar = tempVidelFar
					this.videoNear = tempVideoNear
				},1000)
			},
			// 停止滚动
			stopScrolling( touchEvent ) {
				touchEvent.preventDefault();
			},
			// /**
			//  * 关闭提示消息
			//  */
			// closeMsg(){
			// 	this.showWelcomeMsg = false
			// 	// 增加 开启页面状态：
			// 	uni.setStorageSync('LivePageState','show')
			// 	// 增加 结束
			// 	this.initAudio()
			// },
			/**
			 * 初始化 socket 链接信息
			 */
			initSocket(){
				this.audioState = {
					backgroundMusicState: uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on',
					musicEffectSate: uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
				}
				this.socketTask.connect()			// 建立 socket 连接
				this.socketTask.onOpen(res => {		// 监听 socket 连接开始发送信息，{台桌ID 游戏类型 用户ID}
					this.socketTask.sendMsg({table_id: this.tableId, game_type: this.game_type_id, user_id: this.userInformation.id})
					this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, msg: this.audioState})
				})
				this.receiveMsg()					// 接收消息
				this.socketTask.onError(() => {
					setTimeout(() => {
						this.reconnection()
					}, 6000)
				})
			},
			
			/**
			 * 重连
			 * 
			 * **/
			reconnection() {
				console.log('webscoket reconnect')
				this.socketTask.connect()
				this.socketTask.onOpen(res => {		// 监听 socket 连接开始发送信息，{台桌ID 游戏类型 用户ID}
					this.socketTask.sendMsg({table_id: this.tableId, game_type: this.game_type_id, user_id: this.userInformation.id})
					this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, msg: this.audioState})
				})
				this.receiveMsg()
			},
			/**
			 * 获取视频
			 * **/
			getTableInfoVideo(){
				this.videoLoadState = true
				let system = this.getSystemType()
				apiService.getTableInfoVideo({id: this.tableId}).then(res => {
					if(res.data.code == 200) {
						this.videoFar  = res.data.data.video_far
						this.videoFar = system == 'ios' ? this.videoFar.replace("/index.html",'/flv/index.html') : this.videoFar
						this.videoNear  = res.data.data.video_near
						this.videoNear = system == 'ios' ? this.videoNear.replace("/index.html",'/flv/index.html') : this.videoNear
					}
				}).catch(err => {
					console.log(err)
				})
			},
			/**
			 * 判断系统类型
			 * **/
			getSystemType() {
				let system = ''
				//#ifdef H5
				system = 'h5'
				//#endif
				// #ifdef APP-PLUS
				switch(uni.getSystemInfoSync().platform){
				    case 'android':
						system = 'android'
					    break;
				    case 'ios':
						system = 'ios'
					   	break;
				}
				//#endif
				return system
			},
			/**
			 * 放大缩小
			 * */
			handleZoom() {
				this.videoEnlarge = !this.videoEnlarge
				
				if(this.videoEnlarge){
					
				}
				//#ifdef H5
				let agent = this.getBrowser()
				if( agent.type == 'Safari' && agent.versions == 12){
					this.refreshIframe()
				}
				//#endif
			},
			/**
			 * 数据样式
			 * result.data.result中
			 * zhuang_point 庄点数
			 * xian_point 闲点数
			 * zhuang_dui 是否庄对
			 * xian_dui 是否闲对
			 * win 主结果 =1 庄赢  =2 闲赢 =3 和牌   0错误
			 * size  大赢还是小赢 0 小赢   1大赢
			 * lucky 是否是幸运6   0不是  大于0是幸运6
			 * **/
			/**
			 * 接收开牌信息 主要是开牌结果 下注提示  派彩 
			 * 注意 音频播放的时候 手机浏览器要慢点，所以时间稍微长一点才可以
			 */
			receiveMsg() {
				this.socketTask.receiveMsg(res => {
					// console.log(res)
					// 如果空数据，则不处理
					if(res.data ==  'fail') {
						this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, msg: this.audioState})
					}
					if(!tools.isJSON(res.data.trim())) {
						this.tableRunInfo.end_time = 0
						return
					}
				
					let result = JSON.parse(res.data)					// 非空信息 即开奖信息
					//失败消息
					if(result.code == 404) {
						this.$tip.alert(result.msg)
						return
					}
					//成功下注（客户端推服务推客户端）
					if(result.code == 204) {
						// this.audioHandle.startSoundEffect('bet.mp3')
						return
					}
					//下注成功（服务推客户端）
					if(result.code == 203) {
						this.handleSuccessMsg(result)
						return
					}
					//倒计时 开牌状态信息
					if( result.data && result.data.table_run_info) {
						//console.log("倒计时",result.data.table_run_info.end_time)
						//console.log(result.data.table_run_info)
						this.dao_ji_shi(result.data.table_run_info)
						return
					}
					//以下是说开牌结果 
					if(!result.data || !result.data.result_info) {
						return
					}
					if(result.data.result_info.money != false){
						this.showWinMsgOpen = true
						this.showWinMsgText = `${this.liveLocales.win}：${result.data.result_info.money}`
						setTimeout(() => {
							this.showWinMsgOpen = false
						},2000)
					}
					//不是该桌的游戏结果不展示 
					if(result.data.result_info.table_info.game_type != this.game_type_id || 
					result.data.result_info.table_info.table_id != this.tableId || this.tableRunInfo.end_time > 0) {
						return
					}
					console.log("result.code:",result.code,"this.receiveResultState:",this.receiveResultState)
					if(result.code == 200 && !this.receiveResultState) {			
						this.resultInfo = result.data.result_info				// 赋值开牌结果过来 自动展示
						this.receiveResultState = true
						this.$forceUpdate()
						this.runOpenMusicEffect(result.data.bureau_number)		// 播放开牌音乐  第一次 自动播放 
						setTimeout(() => {
							this.receiveResultState = false
							this.getGameTableInfo()
							this.getGameBetCount()									// 处理开牌信息
							this.handleRefresh()									// 刷新钱数
						}, 5000)
					}
					
				})
			},
			/**
			 * 处理成功消息
			 * @param result 响应结果信息 
			 * **/
			handleSuccessMsg(result) {
				this.showMsgOpen = true
				this.activityDescribeText = `${result.msg}:${result.data.money_spend}`
				// this.audioHandle.startSoundEffect('betsuccess.mp3')
				this.handleRefresh()							// 刷新钱数
				setTimeout(() => {
					this.showMsgOpen = false
				}, 2500) 
			},
			/**
			 * 设置游戏桌信息 倒计时
			 * @param {table_run_info} 后台返回的结果  
			 * **/
			dao_ji_shi(tableRunInfo){
				// 返回时间 低于 6秒 红色
				if(tableRunInfo.end_time < 6) {
					this.activeColor = 'red'
				}else {
					this.activeColor = '#78E07A'
				}
				this.percent = tableRunInfo.end_time / tableRunInfo.countdown_time * 100		// 进度比率 那个 圆圈的那个
				this.endTime = tableRunInfo.end_time		// 同步倒计时状态
				// 同步到 头的 局号信息
				if(tableRunInfo.end_time == 45 || tableRunInfo.end_time == 0){
					this.tableRunInfo = tableRunInfo
				}
				//++++++++++++++牛叉的分割线++++++++++++++++++++++++++++++
				// 如果倒计时 结束 ，并且 开牌中，并且二次请求了
				if(tableRunInfo.end_time == 0 &&  tableRunInfo.run_status == 2 && this.stopMusicHasPlayed == false) {
					this.stopMusicHasPlayed = true
					this.showMsgOpen = true
					this.activityDescribeText = this.liveLocales.openingCard
					// this.audioHandle.startSoundEffect("stopbets.mp3")		// 播放停止下注音乐
				}
				// 如果不是第一次 
				if(tableRunInfo.end_time == this.startShowWelcomeTime) {
					this.showMsgOpen = true
					this.activityDescribeText = this.liveLocales.begunBet
					// this.audioHandle.startSoundEffect("startbets.mp3")
				}
				// 3.5 秒后，关闭 效果
				setTimeout(() => {
					this.showMsgOpen = false
				},this.showMsgOpenTime)
				//+++++++++++++++++牛叉的分割线+++++++++++++++++++++++++++
				this.$forceUpdate()
			},
			/**
			 * 有开牌结果的时候，执行的音乐播放
			 * @param {Object} bureau_number
			 */
			runOpenMusicEffect(bureau_number){
				let tempLivePageState = uni.getStorageSync('LivePageState')
				if(tempLivePageState == 'hidden') {
					return
				}
				// 如果获取的消息是新的 一局 也就是铺号不同
				if(this.bureauNumber != bureau_number) {
					this.bureauNumber = bureau_number		// 更新铺号
					// this.audioHandle.startSoundEffect('OPENCARD.mp3')
					let time = 2000
					setTimeout(() => {
						// this.audioHandle.startSoundEffect(`P${this.resultInfo.result.xian_point}.mp3`)
					},time)
					setTimeout(() => {
						// this.audioHandle.startSoundEffect(`B${this.resultInfo.result.zhuang_point}.mp3`)
					},time + 2500)
					setTimeout((win=0) => {
						//主结果 =1 庄赢  =2 闲赢 =3 和牌 
						switch(win) {
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
					}, time + 5000,this.resultInfo.result.win)
				}
			},
			/**
			 * 触发 头部的 刷新用户金额
			 * **/
			handleRefresh() {
				if(!this.$refs.headBar){
					return
				}
				this.$refs.headBar.userInfos()
			},
			
			// 获取统计信息
			getGameBetCount() {
				apiService.gameTableBet({table_id: this.tableId}).then(res => {
					if(res.data.code == 200) {
						this.betCountDetails = res.data.data
						this.$forceUpdate()
					}
				}).catch(error => {
					console.log(error)
				})
				
			},
			//音频 初始化
			// initAudio() {
			// 	let backgroundMusicStartTime = 150
			// 	// 如果 音效开启 首先开启音效
			// 	if(this.audioHandle.musicEffectSate == 'on') {
			// 		backgroundMusicStartTime = 2000				// 给背景音乐播放 增加时间
			// 		this.audioHandle.startSoundEffect('welcome.mp3')
			// 	}else{
			// 		this.audioHandle.musicEffecAudioContext.pause()
			// 	}
			// 	setTimeout(() => {
			// 		this.audioHandle.startSoundBackground()
			// 	},backgroundMusicStartTime)
			// },
			/**
			 * 设置音乐开关
			 * 开启跟关闭
			 * **/
			switchAudioByBrowerStart() {
				// 网页显示
				setTimeout(() => {
					
					// 初始化音频新
					// this.audioHandle.backgroundMusicState = uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on'
					// this.audioHandle.musicEffectSate = uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
					
					// console.log('audioHandle.backgroundMusicState',audioHandle.backgroundMusicState)
					// console.log('audioHandle.musicEffectSate',audioHandle.musicEffectSate)
					
					// if(this.audioHandle.backgroundMusicState == 'on'){
					// 	// this.audioHandle.backgroundAudioContext.play()
					// }
					// if(this.audioHandle.musicEffectSate == 'on'){
					// 	// audioHandle.musicEffecAudioContext.play()
					// }
				}, 150)
			},
			/**
			 * 设置音乐开关
			 * 目前发现没用调用的地方呢
			 * 开启跟关闭
			 * **/
			switchAudioByBrowerStop() {
				this.audioState.backgroundMusicState = 'off' 
				this.audioState.musicEffectSate = 'off'
				this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, msg: this.audioState})
				// this.audioHandle.musicEffecAudioContext.pause()
				// this.audioHandle.backgroundAudioContext.pause()
			},
			/**
			 * 获取初始化桌子信息
			 * **/
			getGameTableInfoInit(){
				apiService.gameTableInfo({id: this.tableId}).then(res => {
					if(res.data.code === 200) {
						this.initTableInfo = res.data.data
						this.$forceUpdate()
						this.loadingState_tableDataInfo = 1
					}
				})
			},
			
			/**
			 * 设置音乐开关
			 * 目前发现没用调用的地方呢
			 * 开启跟关闭
			 * **/
			getGameTableInfo(){
				// console.log("获取状态小能手！不停的去后台获取倒计时的数据")
				apiService.gameTableInfo({id: this.tableId}).then(res => {
					if(res.data.code === 200) {
						// 返回时间 低于 6秒 红色
						if(res.data.data.end_time < 6) {
							this.activeColor = 'red'
						}else {
							this.activeColor = '#78E07A'
						}
						this.percent = res.data.data.end_time / res.data.data.countdown_time * 100		// 进度比率 那个 圆圈的那个
						this.tableRunInfo = res.data.data 			// 开牌信息展示
						this.initTableInfo = res.data.data			// 新增 更新 
						
						// 判断一下 之前是否还有信息 不同的话，就清除
						let temp_bureau_number = uni.getStorageSync(this.tablePre+'bureauNumber').toString()
						// console.log('test 1 emp_bureau_number',temp_bureau_number)
						// console.log('test 2 this.tableRunInfo.bureau_number',this.tableRunInfo.bureau_number)
						if(!this.$refs.batPlugin) {
							return
						}
						if(temp_bureau_number != this.tableRunInfo.bureau_number.toString()){
							// console.log('test 2 clear run')
							// this.clearAll()
						}
						// 存储最新的信息1
						uni.setStorageSync(this.tablePre+'bureauNumber',this.tableRunInfo.bureau_number)
						//++++++++++++++牛叉的分割线++++++++++++++++++++++++++++++
						this.endTime = this.tableRunInfo.end_time		// 同步倒计时状态
						// 如果倒计时 结束 ，并且 开牌中，并且二次请求了
						if(this.tableRunInfo.end_time == 0 &&  this.tableRunInfo.run_status == 2 && this.stopMusicHasPlayed == false) {
							this.stopMusicHasPlayed = true
							// 调用 bet 投注区域的函数跟参数 
							this.$refs.batPlugin.cancel()
							this.$refs.batPlugin.sendFlag = 0
							// 展示消息
							this.showMsgOpen = true
							this.activityDescribeText = this.liveLocales.openingCard
							// 清除历史信息
							uni.removeStorageSync('betTargetList')
							uni.setStorageSync('sendFlag',0)
							// 投注状态重置
							this.betState = false								// 标记停止下注状态
							// this.audioHandle.startSoundEffect("stopbets.mp3")		// 播放停止下注音乐
						}
						// 如果不是第一次 
						if(this.tableRunInfo.end_time == this.startShowWelcomeTime) {
							this.showMsgOpen = true
							this.activityDescribeText = this.liveLocales.begunBet
							// this.audioHandle.startSoundEffect("startbets.mp3")
						}
						// 根据时间状态 标记是否可以投注 
						if(this.tableRunInfo.end_time == 0 ) {
							this.betState = false
						}
						// 根据时间状态 标记是否可以投注 
						if(this.tableRunInfo.end_time != 0) {
							this.betState = true
						}
						// 3.5 秒后，关闭 效果
						setTimeout(() => {
							this.showMsgOpen = false
						},this.showMsgOpenTime)
						//+++++++++++++++++牛叉的分割线+++++++++++++++++++++++++++
						this.$forceUpdate()
					}
				}).catch(err => {
					console.log(err)
				})
			},
			clearAll() {
				uni.removeStorageSync(this.tablePre+'is_play_now');
				uni.removeStorageSync(this.tablePre+'sendFlag');
				uni.removeStorageSync(this.tablePre+'betMoneyBefore');
				uni.removeStorageSync(this.tablePre+'betRepeatTargetList');
				uni.removeStorageSync(this.tablePre+'betTargetList');
				uni.removeStorageSync(this.tablePre+'isBetSuccessInOneGame');						
				this.$refs.batPlugin.clearAll()
			},
			/**
			 * 设置兼容页面隐藏状状
			 * */
			setHiddenProperty() {
				this.hiddenProperty = 'hidden' in document
				this.hiddenProperty = 'hidden' in document ? 'hidden' :
				    'webkitHidden' in document ? 'webkitHidden' :    
				    'mozHidden' in document ? 'mozHidden' :    
				    null;
				this.visibilityChangeEvent = this.hiddenProperty.replace(/hidden/i, 'visibilitychange');
				let dom = document.getElementById('live-page')
				document.addEventListener(this.visibilityChangeEvent, this.listenerPageState());
				this.pageHiddenTimer = setTimeout(() => {
					this.setHiddenProperty()
				},1000)
			},
			/**
			 * 监听页面状态
			 * */
			listenerPageState() {
				if (!document[this.hiddenProperty]) {
				    uni.setStorageSync('LivePageState','show')
				}else{
				    uni.setStorageSync('LivePageState','hidden')
					// this.audioHandle.closeSoundBackground()
				}
			},
			/**
			 * 设置台桌 游戏状态
			 * 
			 * 倒计时 ，开牌中 ， 开局状态 
			 * */
			// setActivityDescribe(){
			// 	this.endTime = this.tableRunInfo.end_time		// 同步倒计时状态
			// 	// 如果倒计时 结束 ，并且 开牌中，并且二次请求了
			// 	if(this.tableRunInfo.end_time == 0 &&  this.tableRunInfo.run_status == 2) {
			// 		// 调用 bet 投注区域的函数跟参数 
			// 		this.$refs.batPlugin.cancel()
			// 		this.$refs.batPlugin.sendFlag = 0
			// 		// 展示消息
			// 		this.showMsgOpen = true
			// 		this.activityDescribeText = this.liveLocales.openingCard
			// 		// 清除历史信息
			// 		uni.removeStorageSync('betTargetList')
			// 		uni.setStorageSync('sendFlag',0)
			// 		// 投注状态重置
			// 		this.betState = false								// 标记停止下注状态
			// 		this.audioHandle.startSoundEffect("stopbets.mp3")		// 播放停止下注音乐
			// 	}
			// 	// 如果不是第一次 
			// 	if(this.tableRunInfo.end_time == this.startShowWelcomeTime) {
			// 		this.showMsgOpen = true
			// 		this.activityDescribeText = this.liveLocales.begunBet
			// 		this.audioHandle.startSoundEffect("startbets.mp3")
			// 	}
			// 	// 根据时间状态 标记是否可以投注 
			// 	if(this.tableRunInfo.end_time == 0 ) {
			// 		this.betState = false
			// 	}
			// 	// 根据时间状态 标记是否可以投注 
			// 	if(this.tableRunInfo.end_time != 0) {
			// 		this.betState = true
			// 	}
			// 	// 3.5 秒后，关闭 效果
			// 	setTimeout(() => {
			// 		this.showMsgOpen = false
			// 	},this.showMsgOpenTime)
			// },
		}		
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		overflow: auto;
	}
	.video-animation{
		animation: refreshAnimation 1s;
	}
	@keyframes refreshAnimation
	{
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}
	.live-page::before{
		content: " ";
		width: 100%;
		height: 100%;
		content: " ";
		top: 0;
		position: absolute;
		background: url('/static/img/login/bg1.jpg') no-repeat center center fixed;
		background-size: 100% 100%;
		opacity: 0.2;
	}
	.live-result-scene-card{
		display: flex;
		justify-content: center;
	}
	.live-page {
		position: relative;
		width: 100%;
		height: 100%;
		.live-container{
			height: 100%;
			padding-bottom: 10rpx;
			position: relative;
		}
		.live-loading{
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 9;
			color: white;
		}
		.live-loading-panel{
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		@keyframes loadingRotate{
			from{
				transform: rotate(0deg);
			}
			to{
				transform: rotate(360deg);
			}
		}
		
		.live-loading-img{
			width: 100rpx;
			height: 100rpx;
			animation: loadingRotate 1.2s linear infinite;
		}
		
		.lz_details{
			position: relative;
		}
		.live-details-lz{
			top: 0rpx;
			left: 0;
			z-index: 9;
			position: absolute;
		}
		
		.live-details{
			border: none; 
			height: 100%;
			width: 100%;
			padding: 0;
		}
		.live-box {
			height: calc(100vw * 0.559);
			overflow: hidden;
			position: relative;
		}
		.live-count-down{
			position: absolute;
			width: 100rpx;
			height: 100rpx;
			z-index: 25;
			top: 42rpx;
			left: 5px;
			transform: rotateY(180deg) rotateZ(180deg);
		}
		.live-shuffle{
			color: rgba(251,93,86,0.9);
			font-size: 22px;
			position: absolute;
			font-weight: 600;
			width: 146rpx;
			top: 46rpx;
			z-index: 25;
			left: 5px;
		}
		.live-result-scene-right-txt{
			text-align: right;
		}
		.live-bet-box{
			// height: 248px;
			//高度等于 总高 - 头部区 - 视频区 - 减露珠区
			position: relative;
			height: calc(100% - 100rpx - (100vw *  0.559) - 28rpx - (100vw * 0.35)) ;
			// min-height: 250px;
		}
		.live-bet{
			height: 100%;
			width: 100%;
		}
		.live-video{
			position: absolute;
			top: 0px;
			width: 100%;
			height: 100%;
			overflow: hidden;
			z-index: 10;
			border: none;
		}
		
		.live-video-child{
			position: relative;
			height: 100%;
		}
		.details {
			height: 100vw * 0.35;
			width: 100%;
			position: relative;
			aspect-ratio: 100/35;
		}
		.live-result{
			position: absolute;
			z-index: 10000;
			height: 286rpx;
			font-size: 26px;
			font-weight: 800;
			font-family: '隶书';
			width: 100%;
			background-color: rgba(0, 0, 0, .7);
			display: flex;
			text-shadow:1px 1px 0px #b7b7c1, 1px 1px 0px #b7b7c1;
		}
		.logo {
			width: 280rpx;
			height: 80rpx;
			margin: 0 auto;
			margin-top: 0rpx;
			// background: url(/static/img/login/yb11.png) no-repeat;
			// background-size: 100% 100%;
		}
		
		.live-count-second{
			color: #78E07A;
			margin-top: -5px;
			margin-left: -5px;
			font-size: 20px;
			font-weight: bold;
			transform: rotateZ(0deg) rotateX(-180deg);
		}
		.live-active-color{
			color: red;
		}
		.live-result-txt{
			display: flex;
			flex-direction: column;
			width: 50rpx;
			margin-top: 78rpx;
		}
		.live-result-txt-lh{
			display: flex;
			flex-direction: column;
			width: 50rpx;
			margin-top: 28rpx;
		}
		.live-result-scene-txt{
			display: flex;
			flex-direction: column;
			margin-top: 0rpx;
		}
		.live-result-panel{
			position: relative;
		}
		.live-result-panel-longhu{
			padding-left: 8%;
			padding-right: 8%;
		}
		.live-result-t-card{
			padding: 0 42rpx;
		}
		.live-result-scene-panel{
			flex: 1
		}
		.live-equality{
			width: 120rpx;
			font-size: 22px;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.live-result-scene-img{
			width: 180rpx;
			height: 180rpx;
		}
		.live-result-detail{
			font-size: 30rpx;
			font-family: '隶书';
			color: white;
			font-weight: 600;
			height: 36rpx;
		}
		.live-result-detail text{
			margin:0 10rpx;
		}
		.live-de-xian{
			color: #2B85E4;
		}
		.live-de-he{
			color: #009949;
		}
		.live-equality text{
			width: 60rpx;
			height: 136rpx;
			font-size: 17px;
			text-align: center;
			display: flex;
			font-weight: 400;
			align-items: center;
			justify-content: center;
			padding-bottom: 8rpx;
			border-radius: 32rpx;
		}
		.live-zoom{
			position: absolute;
			z-index: 10;
			right: 34rpx;
			top: 20rpx;
		}
		.live-de-zhuang{
			color: #dc1a1f
		}
		.live-zoom image{
			width: 48rpx;
			height: 48rpx;
		}
		.live-equality-he{
			background-color: rgba(19,133,53,1);
		}
		.live-equality-zhuang{
			background-color: rgba(255,0,0,1);
		}
		.live-equality-xian{
			background-color: rgba(38,67,255,1);
		}
		.live-result-t-card image{
			transform: rotate(90deg);
		}
		.live-result-top{
			align-items: center;
			height: 140rpx;
			position: relative;
			display: flex;
			padding: 0 16rpx;
		}
		.live-result-tally{
			margin-top: -10rpx;
			font-size: 18px;
		}
		.live-result-tally-r{
			text-align: right;
		}
		.live-result-card{
			width: 104rpx;
			height: 140rpx;
			margin: 0 8rpx;
			border-radius: 4rpx;
		}
		.live-win-bg{
			animation: backRedFlicker 1000ms infinite;
			-webkit-animation:backRedFlicker 1000ms infinite;
		}
		.live-win-blue-bg{
			animation: backBlueFlicker 1000ms infinite;
			-webkit-animation:backBlueFlicker 1000ms infinite;
		}
		.live-win-green-bg{
			animation: backGreenFlicker 1000ms infinite;
			-webkit-animation:backGreenFlicker 1000ms infinite;
		}
		.live-result-end{
			justify-content: flex-end;
		}
		.live-result-blue{
			color: #2643ff;
		}
		.live-result-red{
			color: #f0262c;
		}
		.live-result-c-end{
			justify-content: flex-end;
		}
		.live-result-bottom{
			display: flex;
			padding: 0 42rpx;
		}
		.live-result-bottom-lh{
			display: flex;
			padding: 0 42rpx;
		}
		.live-notice{
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
			background-image: linear-gradient(to right, black, #454141) ;
			animation:mobileNote 500ms;
			-webkit-animation:mobileNote 500ms;
			// background-image: url(/static/img/live/noticeLogo.png);
		}
		
		@keyframes mobileNote{
			from {top:100rpx;}
			to {top:10rpx;}
		}
		
		@-webkit-keyframes mobileNote 
		{
			from {top:100rpx;}
			to {top:10rpx;}
		}
		
		@keyframes backRedFlicker{
			from {background-color: rgba(255,0,0,1);}
			to {background-color: rgba(255,0,0,.1);}
		}
		
		@-webkit-keyframes backRedFlicker 
		{
			from {background-color: rgba(255,0,0,1);}
			to {background-color: rgba(255,0,0,.1);}
		}
		@keyframes backBlueFlicker{
			from {background-color: rgba(38,67,255,1);}
			to {background-color: rgba(38,67,255,.1);}
		}
		
		@-webkit-keyframes backBlueFlicker 
		{
			from {background-color: rgba(38,67,255,1);}
			to {background-color: rgba(38,67,255,.1);}
		}
		
		@keyframes backGreenFlicker{
			from {background-color: rgba(19,133,53,1);}
			to {background-color: rgba(19,133,53,.1);}
		}
		
		@-webkit-keyframes backGreenFlicker 
		{
			from {background-color: rgba(19,133,53,1);}
			to {background-color: rgba(19,133,53,.1);}
		}
	}
	.for_header_postion{
		display: flex;
		width: 100%;
		height: 1rpx;
		padding-top:calc(var(--status-bar-height));
		z-index: 1000;
	}
	::v-deep iframe{top: 0}
</style>
