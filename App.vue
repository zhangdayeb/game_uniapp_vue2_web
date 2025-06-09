<script>
	import api from '@/api/api.js'
	import tools from '@/common/util/tools.js'
	
	export default {
		data() {
			return {
				checkTimer:null
			}
		},
		onLaunch: function(options) {
			console.log('App Launch', options);
			// 应用启动时初始化登录状态
			this.initAuth();
		},
		onShow: function(options) {
			console.log('App Show', options);			
			// 应用显示时也检查登录状态
			this.checkAuthStatus();	
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
			
		},
		mounted() {
		},
		methods: {
			// 初始化认证状态
			async initAuth() {
			  // 1. 首先尝试从URL参数获取
			  const fromUrl = this.$auth.initFromUrlParams();
			  
			  if (!fromUrl) {
				// 2. 如果URL没有参数，则从本地存储恢复
				this.$auth.restoreFromStorage();
			  }
			  
			  // 3. 验证token有效性
			  if (this.$auth.isLoggedIn()) {
				const isValid = await this.$auth.validateToken();
				
				if (!isValid) {
				  console.log('Token已失效，清除登录状态');
				  this.$auth.logout();
				  this.redirectToLogin();
				} else {
				  console.log('登录状态有效');
				  this.onLoginSuccess();
				}
			  } else {
				console.log('未登录状态');
				this.redirectToLogin();
			  }
			},
			
			// 检查认证状态
			checkAuthStatus() {
			  if (!this.$auth.isLoggedIn()) {
				this.redirectToLogin();
			  }
			},
			
			// 登录成功处理
			onLoginSuccess() {
			  const userInfo = this.$auth.getUserInfo();
			  console.log('用户已登录:', userInfo);
			  
			  // 可以在这里进行一些全局的登录后处理
			  // 比如获取用户详细信息、配置等
			},
			
			// 跳转到登录页
			redirectToLogin() {
			  // 根据你的应用结构调整路径
			  uni.reLaunch({
				url: '/pages/login/login'
			  });
			},
			/**
			 * app js 检测是否 登录 | 暂时放弃
			 */
			checkInLoginApp(){
				this.checkTimer = setInterval(() => {
					let routes = getCurrentPages()
					let curRoute = routes[routes.length - 1].route
					if(curRoute == 'pages/login/login' || curRoute == 'pages/maintain/maintain' || curRoute == 'pages/login/register') {
						return
					}else{
						let userInformation = uni.getStorageSync('login_user_info')
						let postData = {token: userInformation.token}
						api.getUserOnline(postData).then((res) => {
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