<template>
	<view class="service">
		<web-view :src="serviceInfo.value"></web-view>
	</view>
</template>

<script>
	import customerService from '@/api/customer.js'
    export default {
		props:[],
        data() {
            return {
				//客服信息
				serviceInfo: {},
				//维护数据
				maintainData: {},
				goUrl:'/pages/login/login'
            };
        },
		onLoad() {
			let pages = getCurrentPages()
			let beforePage = pages[pages.length - 2];
			if(beforePage == undefined){
				this.goUrl = uni.getStorageSync('goUrl')?uni.getStorageSync('goUrl'):'/pages/login/login'
			}else if(beforePage != undefined && beforePage.route == 'pages/login/login'){
				this.goUrl = '/pages/login/login'
				uni.setStorageSync('goUrl', this.goUrl)
			}else{
				this.goUrl = '/pages/index/index'
				uni.setStorageSync('goUrl', this.goUrl)
			}
			// console.log(this.goUrl)
		},
		onShow(){
			this.getNoticeList()
		},
        mounted() {
			this.getCustomerService()
        },
        methods: {
			/**
			 * 获取整站维护通知
			 * */
			getNoticeList(){
				this.$maintainState.getNoticeList().then(res => {
					this.maintainData = res
				})
			},
			/**
			 * 监听顶部点击事件
			 * */
			onNavigationBarButtonTap(e) {
				uni.redirectTo({
					url: this.goUrl
				})        
			},
			/**
			 * 获取客服
			 * **/
			getCustomerService() {
				customerService.getService({name: 'app_webchat'}).then(res => {
					if(res.data.code == 200) {
						this.serviceInfo = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			}
        }
    }
</script>


<style lang="scss" scoped>
	.service{
	}
</style>
