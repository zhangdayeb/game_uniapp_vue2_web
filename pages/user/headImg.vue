<template>
	<view class="images" style="z-index: 25;">
		<view class="images-panel">
			<view class="images-box"  v-for="(item, index) in headImgs" :key="index" @click="handleHadeImg(item)">
				<image :src="item.url" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import apiService from '@/api/game.js'
    export default {
		props:[],
        data() {
            return {
				//头像
				headImgs: [
					{url: '/static/img/user/head1.jpeg',id:1},
					{url: '/static/img/user/head2.jpeg',id:2},
					{url: '/static/img/user/head3.jpeg',id:3},
					{url: '/static/img/user/head4.jpeg',id:4},
					{url: '/static/img/user/head5.jpeg',id:5},
					{url: '/static/img/user/head6.jpeg',id:6},
					{url: '/static/img/user/head7.jpeg',id:7},
					{url: '/static/img/user/head8.jpeg',id:8},
					{url: '/static/img/user/head9.jpeg',id:9},
					{url: '/static/img/user/head10.jpeg',id:10},
					{url: '/static/img/user/head11.jpeg',id:11},
					{url: '/static/img/user/head12.jpeg',id:12},
				]
            };
        },
        mounted() {
			
        },
        methods: {
			/**
			 * 选择头像
			 * @param {headImg} 选择的图片对象 
			 * */
			handleHadeImg(headImg){
				this.$emit('handleHadeImg', headImg)
			}
        }
    }
</script>


<style lang="scss" scoped>
	.images{
		position: absolute;
		width: 100%;
		height: 90%;
		background-color: rgba(0,0,0,.85);
		top: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.images-panel{
			min-height: 300rpx;
			width: 604rpx;
			height: 604rpx;
			border: 1px solid #ebd093;
			border-radius: 10rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			// padding: 0 64rpx;
		}
		
		.images-box{
			width: 136rpx;
			height: 136rpx;
			// border: 2rpx solid #ebd093;
			display: flex;
			justify-content: center;
			padding: 4rpx;
			
			image{
				height: 100%;
				width: 100%;
			}
		}
	}
	
</style>
