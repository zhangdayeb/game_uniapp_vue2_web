<template>
	<view class="other" v-if="show">
		<view class="other-panel">
			<view class="other-title">
				系统消息
			</view>
			<view class="">
				此账号已登出，请重新登陆
			</view>
			<view class="other-close" @click="handleClose()">
				关闭
			</view>
		</view>
	</view>
	
</template>

<script>
export default {
	name: 'otherPlace',
	props: {
		
	},
	components: {},
	data() {
		return {
			show: true
		}
	},
	mounted() {
		
	},
	methods: {
		handleClose() {
			this.show = false
			this.$otherPlaceVue.close({})
			uni.redirectTo({
				url:'/pages/login/login'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	.other-page{
		
	}
	.other{
		position: fixed;
		z-index: 99;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.5);
		display: flex;
		align-items: center;
		color: #d3d4d3;
		
		.other-panel{
			border: 2rpx solid #72654d;
			border-radius: 20rpx;
			width: 60%;
			height: 208rpx;
			margin: 0 auto;
			background-color: rgba(0,0,0,1);
			text-align: center;
			font-size: 12px;
			padding: 10rpx 0;
		}
		.other-title{
			margin-bottom: 16rpx;
		}
		.other-close{
			color: black;
			background-color: #ecd1a3;
			width: 170rpx;
			height: 50rpx;
			line-height: 50rpx;
			border-radius: 30rpx;
			margin: 54rpx auto 0;
		}
	}
</style>