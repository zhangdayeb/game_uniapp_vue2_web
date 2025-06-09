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
			// 应用启动时初始化登录状态
			this.initAuth();
		},
		onShow: function(options) {
			// 应用显示时也检查登录状态
			this.checkAuthStatus();	
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