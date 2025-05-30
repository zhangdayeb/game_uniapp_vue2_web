<template>
	<view v-show="isPopup" class="loading-popup">
		<view v-show="shadeShow" class="shade-popup" :class="[ani]" @click="close(shadeClick)"></view>
		<view class="loading-content" :class="[ani]" :style="[{height:height,width:width,backgroundColor:backgroundColor}]">
			<slot></slot>
			<view class="circle-loading" v-show="!custom&&type==1">
				<view class="dot">
					<view class="first-dot"></view>
				</view>
				<view class="dot"></view>
				<view class="dot"></view>
				<view class="dot"></view>
			</view>
			<view class="rectangle-loading" v-show="!custom&&type==2">
				<view class="dot"></view>
				<view class="dot"></view>
				<view class="dot"></view>
				<view class="dot"></view>
			</view>
			<view class="figure" v-show="!custom&&type==3">
			    <div class="dot white"></div>
			    <div class="dot"></div>
			    <div class="dot"></div>
			    <div class="dot"></div>
			    <div class="dot"></div>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			shadeShow:{
				value:Boolean,
				default:true
			},
			shadeClick:{
				value:Boolean,
				default:false
			},
			custom:{
				value:Boolean,
				default:false
			},
			type:{
				value:Number,
				default:1
			},
			width:{
				value:String,
				default:"450rpx"
			},
			height:{
				value:String,
				default:"300rpx"
			},
			backgroundColor:{
				value:String,
				default:"#balck"
			},
			callback:{
				type:Function,
				default:function () {
					
				}
			}
		},
		data(){
			return{
				isPopup:false,
				ani:''
			}
		},
		methods:{
			open:function(){
				this.isPopup=true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.ani = 'open-animation'
					}, 30);
				})
			},
			close:function(v){
				let isClose = v == false ? false:true;
				if(isClose){
					this.ani = ''
					setTimeout(() => {
						this.isPopup=false;
						this.$emit('callback');
					}, 200);
				}	
			}
		}
	}
</script>

<style lang="scss">
	/*弹窗*/
	.loading-popup{
		.shade-popup{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #000;
			opacity: 0;
			transition: all .6s;
			z-index: 2000;
		}
		.shade-popup.open-animation{
			opacity: 0.93;
		}
		.loading-content{
			z-index: 2001;
			position: fixed;
			display: flex;
			justify-content: center;
			text-align: center;
			align-items: center;
			border-radius: 20rpx;
			margin: auto;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			transform: scale(1.2);
			transition: all .6s;
			opacity: 0;
		}
		.loading-content.open-animation{
			transform: scale(1);
			opacity: 1;
		}
	}
	
	.figure{
		position: absolute;
		margin: auto;
		top: 0; bottom: 0; left: 0; right: 0;
		width: 6.250em; height: 6.250em;
		animation: rotate 2.4s linear infinite;
	}
	
	.white { 
	  top: 0; bottom: 0; left: 0; right: 0; 
	  background: white; 
	  animation: flash 2.4s linear infinite;
	  opacity: 0;
	}
	.dot {
	  position: absolute;
	  margin: auto;
	  width: 2.4em; height: 2.4em;
	  border-radius: 100%;
	  transition: all 1s ease;
	}
	.dot:nth-child(2) { top: 0; bottom: 0; left: 0; background: #FF4444; animation: dotsY 2.4s linear infinite; }
	.dot:nth-child(3) { left: 0; right: 0; top: 0; background: #FFBB33; animation: dotsX 2.4s linear infinite; }
	.dot:nth-child(4) { top: 0; bottom: 0; right: 0; background: #99CC00; animation: dotsY 2.4s linear infinite; }
	.dot:nth-child(5) { left: 0; right: 0; bottom: 0; background: #33B5E5; animation: dotsX 2.4s linear infinite; }
	
	@keyframes rotate {
	  0% { transform: rotate( 0 ); }
	  10% { width: 6.250em; height: 6.250em; }
	  66% { width: 2.4em; height: 2.4em; }
	  100%{ transform: rotate(360deg); width: 6.250em; height: 6.250em; }
	}
	
	@keyframes dotsY {
	  66% { opacity: .1; width: 2.4em; }
	  77%{ opacity: 1; width: 0; }
	}
	@keyframes dotsX {
	  66% { opacity: .1; height: 2.4em;}
	  77%{ opacity: 1; height: 0; }
	}
	
	@keyframes flash {
	  33% { opacity: 0; border-radius: 0%; }
	  55%{ opacity: .6; border-radius: 100%; }
	  66%{ opacity: 0; }
	}
	
	/*圆形加载*/
	.circle-loading{
		width: 150rpx;
		height: 150rpx;
		position: relative;
		margin: auto;
		.dot{
			position: absolute;
			top: 0;
			left: 0;
			width: 150rpx;
			height: 150rpx;
			animation: 1.5s loadrotate cubic-bezier(0.800,0.005,0.500,1.000) infinite;
			&:after,
			.first-dot{
				content: '';
				position: absolute;
				width: 18rpx;
				height: 18rpx;
				background: #3aa4f0;
				border-radius: 50%;
				left: 50%;
			}
			.first-dot{
				background: #3aa4f0;
				animation: 1.5s dotscale cubic-bezier(0.800,0.005,0.500,1.000) infinite;
					
			}
		}
	}
	@for $i from 1 through 4 {
		.circle-loading {
			&>.dot:nth-child(#{$i}) {
				animation-delay: 0.15s*$i;
			}
		}
	}
	
	@keyframes loadrotate
	 {
		 from{
			 transform: rotate(0deg);
		 }
		 to{
			 transform: rotate(360deg);
		 }
	 }
	@keyframes dotscale { 
		0%, 10% { width: 28rpx; height: 28rpx; margin-left: -2rpx; margin-top: -5rpx;} 
		50% { width: 16rpx; height: 16rpx; margin-left: 0rpx; margin-top: 0rpx;}
		90%, 100% { width: 28rpx; height: 28rpx; margin-left: -2rpx; margin-top: -5rpx;}
	}
	
	
	/*矩形加载*/
	.rectangle-loading{
		height: 60px;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		.dot{
			height: 50px;
			width: 10px;
			margin-right: 20rpx;
		}
	}
	
	$color:#FF3404,skyblue, #F48f00,#39d754;

	@for $i from 1 through 4 {
		.rectangle-loading {
			&>.dot:nth-child(#{$i}) {
				animation: load-frame 1s infinite linear 0s+$i*0.12;
				background: #{nth($color, $i)};
			}
			@if $i==4 {
				&>.dot:nth-child(#{$i}) {	
					margin-right: 0;
				}
			}
		}
	}
	
	@keyframes load-frame {
		0% {height: 45px;background: palegoldenrod}
		50% {height: 12px;}
		100% {height: 45px;}
	}
</style>
