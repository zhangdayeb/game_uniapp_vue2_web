<script>
	import api from '@/api/api.js'
	import tools from '@/common/util/tools.js'
	
	export default {
		data() {
			return {
				checkTimer:null
			}
		},
		onLaunch: function() {
		},
		onShow: function() {
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
			this.checkInLoginApp()
		},
		methods:{
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