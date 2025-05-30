<template>
	<view class="maintain">
		<view class="maintain-section">
			<view class="maintain-log">
				<view class="maintain-sun">
					<image src="/static/img/login/yb12.png" ></image>
				</view>
				<view class="maintain-text">
					<view class="maintain-log-text">
						{{loginLocales.groupName}}
					</view>
					<view class="">
						SUN CASINO
					</view>
					<!-- <image :src="logInfo.value" ></image> -->
				</view>
			</view>
			<view class="maintain-panel">
				<view class="maintain-title">
					<!-- 这是个标题 -->
				</view>
				<view class="maintain-content">
					<!-- {{content}} -->
					<view class="maintain-honorific">
						{{contentList[0]}}
					</view>
					<view class="maintain-txt">
						{{contentList[1]}}
					</view>
					<view class="maintain-department">
						{{contentList[2]}}
					</view>
				</view>
			</view>
		</view>
		<view class="maintain-footer">
			{{loginLocales.version}} {{$version}} {{loginLocales.group}}
		</view>
	</view>
</template>

<script>
	export default {
		props: ['content'],
		name: 'maintain',
		data() {
			return {
				//后台返回的维护数据
				maintainData: {},
				//登录页语言
				loginLocales: this._i18n.messages[this.$storageLan].login,
				//内容
				contentList: []
			}
		},
		watch:{
		},
		onShow(){
			this.getNoticeList()
		},
		mounted(){
		},
		methods:{
			/**
			 * 获取整站维护通知
			 * */
			getNoticeList(){
				let WEB_MAINTAIN = '1';
				this.$maintainState.getNoticeList().then(res => {
					this.maintainData = res
					this.contentList = this.maintainData.content.split('||')
					if(this.maintainData.web_maintain_status != this.$WEB_MAINTAIN_STATE){
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.maintain::before{
		content: " ";
		width: 100%;
		height: 100vh;
		content: " ";
		top: 0;
		position: absolute;
		background: url('/static/img/login/bg1.jpg') no-repeat center center fixed;
		background-size: 100% 100%;
		opacity: 0.2;
		z-index: 0;
	}
	.maintain{
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 99999;
		background-color: rgba(0,0,0,1);
		// display: flex;
		// align-items: center;
		// justify-content: center;
		color: #d3d4d3;
		top: 0;
		
		.maintain-section{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-60%);
		}
		.maintain-txt{
			text-align: start;
			text-indent:2em;
			margin: 20rpx;
		}
		.maintain-department{
			text-align: end;
			text-indent:4em;
		}
		.maintain-log{
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			
		}
		.maintain-sun{
			text-align: center;
			image{
				width: 160rpx;
				height: 160rpx;
			}
		}
		.maintain-honorific{
			text-align: start;
		}
		.maintain-text{
			overflow: hidden;
			text-align: center;
			font-size: 16px;
			font-weight: 600;
			color: #bcaf95;
			image{
				width: 400rpx;
				height: 120rpx;
			}
		}
		.maintain-log-text{
			font-size: 37px;
			font-family: KaiTi;
		}
		
		.maintain-title{
			margin-bottom: 16rpx;
		}
		.maintain-footer{
			color: white;
			text-align: center;
			position: fixed;
			width: 100%;
			bottom: 10px;
			font-size: 14px;
		}
		
		.maintain-panel{
			border: 2rpx solid #72654d;
			border-radius: 20rpx;
			width: 60%;
			min-height: 208rpx;
			margin: 0 auto;
			background-color: rgba(0,0,0,1);
			text-align: center;
			font-size: 14px;
			padding: 10rpx;
			word-break: break-all
		}
	}
</style>
