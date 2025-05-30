<template>
	<view class="download">
		<iframe class="download-link" :src="appDownUrl" ></iframe>
	</view>
</template>

<script>
	import customerService from '@/api/customer.js'
	export default {
		data() {
			return {
				// 下载地址
				appDownUrl:''
			}
		},
		onShow(){
			this.getAppDownUrl()
		},
		mounted() {
		},
		destroyed() {
			
		},
		methods: {
			
			/**
			 * 获取logo
			 * **/
			getAppDownUrl() {
				customerService.getService({name: 'app_down_android'}).then(res => {
					if(res.data.code == 200) {
						this.appDownUrl = res.data.data.value
						console.log("this.appDownUrl:",this.appDownUrl)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
	}
	.download{
		height: 100%;
	}
	.download-link{
		border: none;
		height: 100%;
		width: 100%;
		padding: 0;
	}
</style>
