<script>
	import api from '@/api/api.js'
	import tools from '@/common/util/tools.js'
	import {USER_URL,SocketTask} from '@/api/socket.js'
	let socketTask = new SocketTask(USER_URL)
	
	export default {
		data() {
			return {
				checkTimer:null
			}
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			// #ifdef H5
			// 此处增加 h5 手机网页 操作时间检测 超过多少秒，自动退出 
			window.addEventListener("click", () => {
				// 开始 处理 多长没有动作 时间后 自动 退出功能 开始
				uni.setStorageSync('loginStartTime',new Date().getTime())
				// 开始 处理 多长没有动作 时间后 自动 退出功能 结束
			}, true);
			//#endif
			
		},
		onHide: function() {
			console.log('App Hide')
		},
		mounted() {
			// #ifdef H5
			// 仅仅 H5 有效 注释掉 这个 默认的 链接，保持一个 ws 连接。防止卡顿
			this.initSocket()
			//#endif
			// #ifdef APP-PLUS 
			// app 真的卡 添加一个 这 就直接卡了
			//this.checkInLoginApp()
			//#endif
		},
		methods:{
			/**
			 * 初始化 socket 链接信息
			 * 仅仅 H5 有效 暂时废弃了 因为 app 打包后，不知道 ws 同时多开
			 */
			initSocket(){
				socketTask.connect()			// 建立 socket 连接
				socketTask.onOpen(res => {		// 监听 socket 连接开始发送信息，{台桌ID 游戏类型 用户ID}
					this.checkInLogin()
				})
				this.receiveMsg()					// 接收消息
				socketTask.onError(() => {
					setTimeout(() => {
						this.reconnection()
					}, 6000)
				})
				socketTask.onClose((res) => {
					console.log("断开连接：",res)
				})
			},
			
			/**
			 * 重连
			 * 仅仅 H5 有效 暂时废弃了 因为 app 打包后，不知道 ws 同时多开
			 * **/
			reconnection() {
				socketTask.connect()
				socketTask.onOpen(res => {		// 监听 socket 连接开始发送信息，{台桌ID 游戏类型 用户ID}
					this.checkInLogin()
				})
				this.receiveMsg()
			},
			/**
			 * 注意 音频播放的时候 手机浏览器要慢点，所以时间稍微长一点才可以
			 * 仅仅 H5 有效 暂时废弃了 因为 app 打包后，不知道 ws 同时多开
			 */
			receiveMsg() {
				socketTask.receiveMsg(res => {
					// console.log(res)
					// 如果空数据，则不处理
					if(!tools.isJSON(res.data.trim())) {
						return
					}
					let result = JSON.parse(res.data)
					//505用户其它地方登录 
					if(result.code == 505) {
						this.$otherPlaceVue.show({})
						return
					}
					if(result.code != 200) {
						uni.navigateTo({
							url: '/pages/login/login'
						})
						this.$forceUpdate()
					}
				})
			},
			/**
			 * 检测是否登录
			 * 仅仅 H5 有效 暂时废弃了 因为 app 打包后，不知道 ws 同时多开
			 * **/
			checkInLogin(){
				setTimeout(() => {
					let curRoute = ''
					// #ifdef H5
					curRoute = this.$vm._route.meta.pagePath //获取当前页面的路由
					//#endif
					// #ifdef APP-PLUS 
					let routes = getCurrentPages()
					curRoute = routes[routes.length - 1].route
					// #endif 
					if(curRoute == 'pages/login/login' || curRoute == 'pages/maintain/maintain') {
						socketTask.sendMsg({ user_id: '', token: ''})
						this.checkInLogin()
						return
					}else{
						let userInformation = uni.getStorageSync('login_user_info')
						socketTask.sendMsg({ user_id: userInformation.id, token: userInformation.token})
						this.checkInLogin()
					}
				}, 2000)
			},
			/**
			 * app js 检测是否 登录
			 */
			checkInLoginApp(){
				this.checkTimer = setInterval(() => {
					let routes = getCurrentPages()
					let curRoute = routes[routes.length - 1].route
					if(curRoute == 'pages/login/login' || curRoute == 'pages/maintain/maintain') {
						return
					}else{
						let userInformation = uni.getStorageSync('login_user_info')
						let postData = {token: userInformation.token}
						api.getUserOnline(postData).then((res) => {
							//console.log(res)
							if(res == undefined || res.data.code == 1){
								uni.navigateTo({
									url: '/pages/login/login'
								})
								this.$forceUpdate()
							}
						})
					}
				}, 10000)
			}
		}
	}
</script>

<style lang="scss">
	body,html{background-color: black;}
	*{box-sizing: border-box;}
	* {  -webkit-overflow-scrolling: touch }
	uni-page-body,html,body{
	        height: 100%; 
			width: 100%;
			// overflow-x: hidden;
	    }  
	@import "uview-ui/index.scss";
</style>