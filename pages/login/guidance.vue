<template>
    <view class="guidance" v-if="open" @click="close()">
		<view class="guidance-panel" v-if="is_ios">
			<image class="guidance-img" src="/static/img/login/ios1.png"></image>
			<image class="guidance-img" src="/static/img/login/ios2.png"></image>
			<image class="guidance-img" src="/static/img/login/ios3.png"></image>
		</view>
		<view class="guidance-panel" v-else>
			<image class="guidance-img" src="/static/img/login/an1.png"></image>
			<image class="guidance-img" src="/static/img/login/an2.png"></image>
		</view>
    </view>
</template>

<script>
    export default {
		props:['show'],
        components: {
            
        },
        data() {
            return {
                open: false,
				is_ios:true,
				is_an:false
            };
        },
		watch:{
			show(val) {
				this.open = this.show
			}
		},
		onLoad(option) {
			
		},
        mounted() {
			this.testWeb()
        },
        methods: {
			testWeb(){
				// #ifdef H5
				let userAgent = navigator.userAgent;
				if(/Safari/.test(userAgent) && !/Chrome/.test(userAgent)){
					this.is_ios = true
					this.is_an = false
				}else{
					this.is_ios = false
					this.is_an = true
				}
				//#endif
			},
			/**
			 * 关闭
			 * **/
			close(){
				this.open = false
				this.$emit('close',{})
			}
        },
    }
</script>

<style lang="scss" scoped>
	.guidance{
		position: fixed;
		top: 0rpx;
		bottom: 0rpx;
		overflow: auto;
		width: 100%;
		z-index: 99999;
		
		.guidance-panel{
			width: 80vw;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
		}
		
		.guidance-img{ 
			width: 80vw;
			height: calc(80vw * 2.164);
		}
	}
</style>
