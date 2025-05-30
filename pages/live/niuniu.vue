<template>
	<view class="niu">
		<view class="niu-container">
			<!-- <welcomeMsg v-if="showWelcomeMsg" @closeMsg="closeMsg" :msg="welcomeMsg"></welcomeMsg> -->
			<headbar ref="headBar" :tableDataInfo="initTableInfo" :tableRunInfo="tableRunInfo" ></headbar>
			<!-- #ifdef APP-PLUS -->
			<view class="for_header_postion"></view>
			<!-- #endif -->
			<view class="niu-live-box" >
				<!-- 远景摄像头 开始 -->
				<view style="z-index: 13;" class="niu-live-video" id="niu-live-video-far" :class="{'niu-live-video-top': videoEnlarge}" >
					<iframe class="niu-live-details" frameborder="0" scrolling="no" :src="videoFar" ></iframe>
				</view>
				<!-- 远景摄像头 结束 -->
				<!-- 近景摄像头 开始 -->
				<view style="z-index: 13;" class="niu-live-video" id="niu-live-video-near" :class="{'niu-live-video-top': !videoEnlarge}" >
					<iframe class="niu-live-details" frameborder="0" scrolling="no" :src="videoNear" ></iframe>
				</view>
				<!-- 近景摄像头 结束 -->
				<!-- 默认加载背景 开始 -->
				<view style="z-index: 12;" class="niu-loading" >
					<view class="niu-loading-panel">
						<image class="niu-loading-img" src="/static/img/live/loading.svg" mode="" ></image>
						<view class="">
							{{liveLocales.selectNetwork}}
						</view>
					</view>					
				</view>
				<!-- 倒计时圈圈 开始 -->
				<view  class="niu-count-down" v-if="tableRunInfo.end_time > 0" >
					<circleProgress :percent="percent" :size="50" :circleWidth="2" :circleColor="activeColor" :innerbgColor="innerbgColor" :defaultColor="defaultColor">
						<text class="niu-count-second" :class="{'niu-active-color': tableRunInfo.end_time < 6}">{{tableRunInfo.end_time}}</text>
					</circleProgress>
				</view>
				<!-- 洗牌状态 标记  结束 -->
				<!-- 消息状态 通知栏  开始 -->
				<view class="niu-notice" v-if="showMsgOpen">
					{{activityDescribeText}}
				</view>
				<view class="niu-notice" v-if="showWinMsgOpen">
					{{showWinMsgText}}
				</view>
				<!-- 洗牌状态 标记  开始 -->
				<view class="niu-shuffle" v-if="tableRunInfo.wash_status == 1" >
					{{$locales.index.shuffle}}
				</view>
				<!-- 视频放大缩小  开始 -->
				<view class="niu-zoom" style="z-index: 21;">
					<image src="/static/img/live/enlarge.svg" mode="" v-if="!videoEnlarge" @click="handleZoom()"></image>
					<image src="/static/img/live/reduce.svg" mode="" v-if="videoEnlarge" @click="handleZoom()"></image>
				</view>
				<!-- 视频刷新按钮 -->
				<view class="niu-zoom" style="z-index: 21; top:80rpx" @tap="refreshIframe()">
					<u-icon :class="{'video-animation': startAnimation}" name="reload" color="#ffffbc"  size="48" ></u-icon>
				</view>
			</view>
			<view class="niu-bet-box">
				<!-- <iframe class="niu-bet" frameborder="0" scrolling="no" :src="`http://192.168.1.6:8080/cattle?table_id=${tableId}&game_type=6&user_id=${userInformation.id}&token=${userToken}`" ></iframe> -->
				<iframe class="niu-bet" frameborder="0" scrolling="no" :src="`${configService.betUrl}/cattle?table_id=${tableId}&game_type=${gameType}&user_id=${userInformation.id}&token=${userToken}`" ></iframe>
			</view>
			<!-- 露珠 开始 -->
			<view class="details">
				<!-- <iframe class="niu-live-details" :src="`http://192.168.101.15:8848/luzhu_niu/list_niu.html?table_id=${tableId}&game_type=${gameType}&user_id=${userInformation.id}`" ></iframe> -->
				<iframe class="niu-live-details" :src="`${lzUrl}?table_id=${tableId}&game_type=${gameType}&user_id=${userInformation.id}`" ></iframe>
			</view>
		</view>
	</view>
</template>

<script>
	import headbar from './head.vue'
	import apiService from '@/api/game.js'
	import welcomeMsg 	from '@/components/live/welcome.vue'
	import circleProgress from '@/components/circle-progress/progress.vue'
	import configService from '@/common/service/config.service.js'
	import tools from '@/common/util/tools.js'
	import {NN_URL,SocketTask} from '@/api/socket.js'
	// import AudioHandle from '@/common/service/audio.js'
	import Bus from "@/common/util/bus.js"
	
	//音乐类型 背景音乐  音效
	const MUSIC_TYPE = {
		backgroundMusicState: 'backgroundMusicState',
		musicEffectSate: 'musicEffectSate'
	}
	
	export default {
		components: {
			headbar,
			welcomeMsg,
			circleProgress,
		},
		data() {
			return {
				configService:configService,							// 初始化 服务配置项目
				lzUrl:'',												// 露珠URL
				// 欢迎光临信息
				welcomeMsg:'欢迎光临牛牛游戏',							
				// 初始化 台桌信息 仓库
				initTableInfo:{},
				// 牌桌 运行信息
				tableRunInfo: {},
				// 视频 远近景 切换按钮	
				videoEnlarge: false,
				// 远景 地址 后台获取
				videoFar:'',
				// 近景 地址 后台获取
				videoNear:'',
				//输赢展示
				showWinMsgOpen:false, 
				showMsgOpen: false,
				//输赢展示文本
				showWinMsgText:'',                                    	
				// 进度 圆圈的 倒计时
				percent: 100,
				// 激活倒计时颜色
				activeColor: '#78E07A',
				// 圈内颜色
				innerbgColor: 'RGB(0,0,0,.6)',	
				// 圆环底部颜色	
				defaultColor: 'rgb(135,135,135,.1)',					
				//视频 加载
				videoLoadState: true,
				// 刷新动画
				startAnimation: false,									
				// 定时句柄 后台获取游戏状态的句柄  
				getInfotimerHandle: null,
				//直播视频页语言
				liveLocales: this._i18n.messages[this.$storageLan].live, 
				// 所有浏览器进入欢迎语
				showWelcomeMsg: false,
				//用户token
				userToken: uni.getStorageSync('Access-Token'),
				// 初始化 socket 句柄
				socketTask: null,	
				//桌号
				tableId: '',
				//游戏类型
				gameType: '',
				//音频播放状态
				audioState: {},
				// 初始化 音频项目导入
				// audioHandle: new AudioHandle(),							
			}
		},
		// 页面初始化
		onLoad(option) {
			uni.setStorageSync('LivePageState','show')
			this.showWelcomeMsg = true
			this.tableId = option.table_id
			this.gameType = option.game_type_id
			this.lzUrl = configService.lzNnUrlMain
			this.userInformation = uni.getStorageSync('login_user_info')
			// 初始化音频新
			// this.audioHandle.backgroundMusicState = uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on'
			// this.audioHandle.musicEffectSate = uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
		},
		onShow() {
			uni.setStorageSync('LivePageState','show')
			this.socketTask = new SocketTask(NN_URL)
			this.initSocket()					
			this.getGameTableInfoInit()
			this.getNoticeList()
			this.switchAudioByBrowerStart()
			// 每秒 获取 台桌信息
			// this.getGameTableInfo()
			
		},
		onReady() {
			// this.audioHandle.audioPath = 'niu'
			uni.setStorageSync('LivePageState','show')
			setTimeout(() => {
				uni.pageScrollTo({
		　　　　　　scrollTop: 0, duration: 300 
		　　　　});
			},600)
			this.addEventSettingMusic()
			this.getTableInfoVideo()
		},
		
		onHide() {
			uni.setStorageSync('LivePageState','hidden')
			this.switchAudioByBrowerStop()
			// this.socketTask.close()
			clearTimeout(this.getInfotimerHandle)
		},
		onUnload(){
			uni.setStorageSync('LivePageState','hidden')
			this.switchAudioByBrowerStop()
			// this.socketTask.close()
			clearTimeout(this.getInfotimerHandle)
		},
		destroyed(){
			uni.setStorageSync('LivePageState','hidden')
			this.switchAudioByBrowerStop()
			// this.socketTask.close()
			clearTimeout(this.getInfotimerHandle)
			// this.audioHandle = null
			Bus.$off('setMusicType', this.addEventSettingMusic())
		},
		
		methods:{
			//监听设置音效和背景音乐
			addEventSettingMusic(){
				
				Bus.$on('setMusicType', (data) =>{
					this.audioState = {
						backgroundMusicState: uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on',
						musicEffectSate: uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
					}
					this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, voiceSwitch:'voiceSwitch', msg: this.audioState})
					switch (data) {
						case 'backgroundMusicState': 
							// this.audioHandle.startSoundBackground()
						break
					}
				}) 
			},
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
					this.socketTask.sendMsg({table_id: this.tableId, game_type: this.gameType, user_id: this.userInformation.id})
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
			 * **/
			reconnection() {
				this.socketTask.connect()
				this.socketTask.onOpen(res => {		// 监听 socket 连接开始发送信息，{台桌ID 游戏类型 用户ID}
					this.socketTask.sendMsg({table_id: this.tableId, game_type: this.gameType, user_id: this.userInformation.id})
					this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, msg: this.audioState})
				})
				this.receiveMsg()
			},
			
			/**
			 * 接收开牌信息 主要是开牌结果 下注提示  派彩 
			 * 注意 音频播放的时候 手机浏览器要慢点，所以时间稍微长一点才可以
			 */
			receiveMsg() {
				this.socketTask.receiveMsg(res => {
					if(res.data ==  'fail') {
						this.socketTask.sendMsg({code: 205, user_id: this.userInformation.id, msg: this.audioState})
					}
					// 如果空数据，则不处理
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
						this.setTableInfo(result.data.table_run_info)
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
						},4500)
						// 新增 自动刷新 结果
						this.$refs.headBar.userInfos()
					}
					//不是该桌的游戏结果不展示 
					if(result.data.result_info.table_info.game_type != this.gameType || 
					result.data.result_info.table_info.table_id != this.tableId || this.tableRunInfo.end_time > 0) {
						return
					}
					if(result.code == 200) {							// 如果正常状态
						// 赋值开牌结果过来 自动展示
						this.resultInfo = result.data.result_info	
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
				// 刷新钱数
				this.handleRefresh()							
				setTimeout(() => {
					this.showMsgOpen = false
				}, 2500) 
			},
			
			/**
			 * 设置游戏桌信息 倒计时
			 * @param {table_run_info} 后台返回的结果  
			 * **/
			setTableInfo(tableRunInfo){
				// 返回时间 低于 6秒 红色
				if(tableRunInfo.end_time < 6) {
					this.activeColor = 'red'
				}else {
					this.activeColor = '#78E07A'
				}
				this.percent = tableRunInfo.end_time / tableRunInfo.countdown_time * 100		// 进度比率 那个 圆圈的那个
				this.tableRunInfo = tableRunInfo 			// 开牌信息展示
				this.initTableInfo = tableRunInfo			// 新增 更新 
				// 存储最新的信息1
				uni.setStorageSync(this.tablePre+'bureauNumber',this.tableRunInfo.bureau_number)
				//++++++++++++++牛叉的分割线++++++++++++++++++++++++++++++
				this.endTime = this.tableRunInfo.end_time		// 同步倒计时状态
				// 如果倒计时 结束 ，并且 开牌中，并且二次请求了
				if(this.tableRunInfo.end_time == 0 &&  this.tableRunInfo.run_status == 2 && this.stopMusicHasPlayed == false) {
					this.stopMusicHasPlayed = true
					// 调用 bet 投注区域的函数跟参数 
					// 展示消息
					this.showMsgOpen = true
					this.activityDescribeText = this.liveLocales.openingCard
					// 投注状态重置
					this.betState = false								// 标记停止下注状态
					// this.audioHandle.startSoundEffect("stopbets.mp3")	// 播放停止下注音乐
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
			/**
			 * 触发 头部的 刷新用户金额
			 * **/
			handleRefresh() {
				if(!this.$refs.headBar){
					return
				}
				this.$refs.headBar.userInfos()
			},
			
			/**
			 * 获取初始化桌子信息
			 * **/
			getGameTableInfoInit(){
				apiService.gameTableInfo({id: this.tableId}).then(res => {
					if(res.data.code === 200) {
						this.initTableInfo = res.data.data
						this.$forceUpdate()
					}
				})
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
			 * 关闭提示消息
			 */
			closeMsg(){
				uni.setStorageSync('LivePageState','show')
				this.showWelcomeMsg = false
				this.initAudio()
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
						// this.audioHandle.backgroundAudioContext.play()
					// }
					// if(this.audioHandle.musicEffectSate == 'on'){
						// audioHandle.musicEffecAudioContext.play()
					// }
				}, 150)
			},
			
			/**
			 * 音频 初始化
			 * **/
			initAudio() {
				let backgroundMusicStartTime = 150
				
				// 如果 音效开启 首先开启音效
				// if(this.audioHandle.musicEffectSate == 'on') {
				// 	backgroundMusicStartTime = 3000				// 给背景音乐播放 增加时间
				// 	this.audioHandle.startSoundEffect('welcome.mp3')
				// }else{
				// 	this.audioHandle.musicEffecAudioContext.pause()
				// }
				
				// 延时启动  音效 是为了播放完成 那个 欢迎词，然后 循环播放背景音乐
				setTimeout( () => {
					let tempLivePageState = uni.getStorageSync('LivePageState')
					if(tempLivePageState == 'hidden') {
						return
					}
					// this.audioHandle.startSoundBackground()
				},backgroundMusicStartTime)
			},
			/**
			 * 刷新 视频刷新
			 * **/ 
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
			/**
			 * 放大缩小
			 * */
			handleZoom() {
				this.videoEnlarge = !this.videoEnlarge
				//#ifdef H5
				let agent = this.getBrowser()
				// console.log('agent',agent)
				if( agent.type == 'Safari' && agent.versions == 12){
					this.refreshIframe()
				}
				//#endif
				// #ifdef APP-PLUS
				// this.refreshIframe()
				//#endif
			},
			
			/**
			 * 获取浏览器
			 * **/ 
			getBrowser() {
			    let UserAgent = navigator.userAgent.toLowerCase();
			    let browserInfo = {};
			    let browserArray = {
			        IE: window.ActiveXObject || "ActiveXObject" in window, // IE
			        Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
			        Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
			        Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
			        Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1, // safari浏览器
			        Edge: UserAgent.indexOf('edge') > -1, // Edge浏览器
			        QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
			        WeixinBrowser: /MicroMessenger/i.test(UserAgent) // 微信浏览器
			    };
			    for (let i in browserArray) {
			        if (browserArray[i]) {
			            let versions = '';
			            if (i == 'IE') {
			                versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
			            } else if (i == 'Chrome') {
			                for (let mt in navigator.mimeTypes) {
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
		}
	}
</script>

<style lang="scss" scoped>
	page{
		// height: 100vh;
		// overflow: hidden;
	}
	.video-animation{
		animation: refreshAnimation 1s;
	}
	@keyframes refreshAnimation
	{
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}
	.niu::before{
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
	.niu{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.niu{
		.niu-container{
			height: 100%;
			padding-bottom: 10rpx;
			position: relative;
		}
		.niu-live-box {
			height: calc(100vw * 0.56);
			overflow: hidden;
			position: relative;
		}
		.niu-live-video{
			position: absolute;
			width: 100%;
			overflow: hidden;
			height: 100%;
			z-index: 1;
			border: 1px solid green;
			border: none;
		}
		.niu-count-down{
			position: absolute;
			width: 100rpx;
			height: 100rpx;
			z-index: 25;
			top: 42rpx;
			left: 5px;
			transform: rotateY(180deg) rotateZ(180deg);
		}
		.niu-live-video-top{
			z-index: 2;
			height: 0rpx;
		}
		.niu-loading{
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 9;
			color: white;
		}
		.niu-loading-panel{
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
		.niu-loading-img{
			width: 100rpx;
			height: 100rpx;
			animation: loadingRotate 1.2s linear infinite;
		}
		.niu-live-details{
			border: none; 
			height: 100%;
			width: 100%;
			padding: 0;
		}
		.niu-bet-box{
			// height: 320px;
			height: calc(100% - 266rpx - 50px - (100vw * 0.559));
			min-height: 250px;
		}
		.niu-count-second{
			color: #78E07A;
			margin-top: -5px;
			margin-left: -5px;
			font-size: 20px;
			font-weight: bold;
			transform: rotateZ(0deg) rotateX(-180deg);
		}
		.niu-active-color{
			color: red;
		}
		.details {
			height: 266rpx;
			width: 100%;
			position: relative;
		}
		.niu-zoom{
			position: absolute;
			z-index: 10;
			right: 34rpx;
			top: 20rpx;
		}
		.niu-zoom image{
			width: 48rpx;
			height: 48rpx;
		}
		.niu-bet{
			height: 100%;
			width: 100%;
		}
		.niu-shuffle{
			color: rgba(251,93,86,0.9);
			font-size: 22px;
			position: absolute;
			font-weight: 600;
			width: 146rpx;
			top: 46rpx;
			z-index: 25;
			left: 5px;
		}
		
		.niu-notice{
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
			background-image: url(/static/img/live/noticeLogo.png);
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
		
		
		
		
		.for_header_postion{
			display: flex;
			width: 100%;
			height: 1rpx;
			padding-top:calc(var(--status-bar-height));
			z-index: 1000;
		}
		
	}
</style>
