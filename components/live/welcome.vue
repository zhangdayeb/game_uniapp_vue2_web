<template name="welcome">
	<view class="live-welcome">
		<view class="live-wel-panel">
			<view >
				{{msg}}
			</view>
			<view class="live-wel-confirm" @click="handleWelcomeClose()">
				确定
			</view>
		</view>
	</view>
</template>

<script>
    export default {
		name:'welcome',
        props:{
			msg: {
        		type: String,//属性类型
        		value: "欢迎光临游戏"
        	}
        },
        data() {
            return {
            };
        },
        mounted() {
        },
        methods: {
			/**
			 * 关闭提示，造成造成游戏交互 从而达成音乐播放
			 */
			handleWelcomeClose() {
				this.$emit("closeMsg","") //子传父 
			},
        }
    }
</script>

<style lang="scss" scoped>
	.live-welcome{
		height: 100%;
		width: 100%;
		position: fixed;
		display: flex;
		z-index: 999;
		background-color: rgba(0,0,0,0.5);
		align-items: center;
		color: #d3d4d3;
	}   
    .live-wel-panel{
    	border: 2rpx solid #72654d;
    	border-radius: 20rpx;
    	width: 60%;
    	height: 208rpx;
    	margin: 0 auto;
    	background-color: rgba(0,0,0,1);
    	text-align: center;
    	padding: 20rpx 40rpx;
    	font-size: 14px;
    }
	.live-wel-confirm{
		color: black;
		background-color: #ecd1a3;
		width: 170rpx;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 30rpx;
		margin: 40rpx auto 4rpx;
	}
</style>
