<template>
	<view class="page-view">
		<u-navbar :is-back="true" :title="userLocales.myAccount" :background="{ background: '#000000' }" height="42" title-color="#fff"
			back-icon-color="#ebd093" :border-bottom="false">
			<view class="navbar-right" slot="right" @click="pageIndexEnd">
				<view class="message-box right-item" @click="pageIndexEnd">
					<u-icon name="close-circle-fill" size="58" color="#ebd093" style="margin-right: 20rpx;"></u-icon>
				</view>
			</view>
		</u-navbar>

		<view class="user-head" style="">
			<view class="user-box">
				<view class="user-img-box" @click="handleHeadImg()">
					<view class="user-img">
						<image class="user-photo" :src="image" mode=""></image>
					</view>
				</view>
				<view class="user-info">
					<view class="user-name-box">
						<text class="accouct">{{userLocales.account}}:</text>
						<text class="user-name-text"> {{user_name}}</text>
					</view>
					<view class="user-amount-box">
						<text class="accouct">{{userLocales.balance}}:</text>
						<text class="amount"> {{user_money}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 功能按钮区域 -->
		<view class="function-actions">
		  <!-- 第一行：充值、提现 -->
		  <view class="action-row">
		    <view class="action-btn charge-btn" @click="goToCharge">
		      <text class="action-icon">💰</text>
		      <text class="action-text">充值</text>
		    </view>
		    <view class="action-btn withdraw-btn" @click="goToWithdraw">
		      <text class="action-icon">💸</text>
		      <text class="action-text">提现</text>
		    </view>
		  </view>
		  
		  <!-- 第二行：提现列表、Telegram -->
		  <view class="action-row">
		    <view class="action-btn withdraw-list-btn" @click="goToWithdrawList">
		      <text class="action-icon">📋</text>
		      <text class="action-text">提现列表</text>
		    </view>
		    <view class="action-btn telegram-btn" @click="openTelegram">
		      <text class="action-icon">📱</text>
		      <text class="action-text">Telegram</text>
		    </view>
		  </view>
		  
		  <!-- 第三行：在线客服、账户管理 -->
		  <view class="action-row">
		    <view class="action-btn service-btn" @click="openOnlineService">
		      <text class="action-icon">💬</text>
		      <text class="action-text">在线客服</text>
		    </view>
		    <view class="action-btn settings-btn" @click="goToSettings">
		      <text class="action-icon">⚙️</text>
		      <text class="action-text">账户管理</text>
		    </view>
		  </view>
		  
		  <!-- 第四行：交易记录 -->
		  <view class="action-row">
		    <view class="action-btn records-btn" @click="goToRecords">
		      <text class="action-icon">📊</text>
		      <text class="action-text">交易记录</text>
		    </view>
		    <view class="action-btn-placeholder"></view>
		  </view>
		</view>
		
		<!-- 头像选择组件 -->
		<headImg v-if="showHeadImg" @handleHadeImg="setHeadImg($event)"></headImg>
	</view>
</template>

<script>
	import headImg from './headImg.vue'
	import user from "@/api/api"

	export default {
		components: {
			headImg
		},
		data() {
			return {
				timeSub: 0,
				image: '',
				loadingImg: '/static/img/user/header.png',
				errorImg: '/static/img/user/header.png',
				user_name: '',
				user_money: 0,
				//用户登录信息
				loginUserInfo: uni.getStorageSync('login_user_info'),
				//用户双语
				userLocales: this._i18n.messages[this.$storageLan].user, 
				//维护数据
				maintainData: {},
				//展示头部头像
				showHeadImg: false,
				// ========== 客服地址配置 ==========
				appKeFuUrl: {},             // 客服地址
				appFeiJiUrl: {},            // 飞机地址
			};
		},
		onShow(){
			let this_ = this
			this.getNoticeList()
			let runTimer = setInterval(function(){
				this_.timeSub = '退出倒计时：'+ parseInt( Number((600000 -  uni.getStorageSync('timeSub')) / 1000) )+ ' 秒'
			},1000)
		},
		mounted() {
			this.getUserinfo();
			this.getCustomerService();  // 获取客服信息
		},
		methods: {
			/**
			 * 跳转到充值页面
			 */
			goToCharge() {
				uni.navigateTo({
					url: '/pages/user/chongzhi'
				})
			},
		
			/**
			 * 跳转到提现页面
			 */
			goToWithdraw() {
				uni.navigateTo({
					url: '/pages/user/tixian'
				})
			},
			
			/**
			 * 跳转到提现列表页面
			 */
			goToWithdrawList() {
				uni.navigateTo({
					url: '/pages/user/tixianlist'
				})
			},
		
			/**
			 * 打开Telegram
			 */
			openTelegram() {
				this.toService(this.appFeiJiUrl)
			},
		
			/**
			 * 打开在线客服
			 */
			openOnlineService() {
				this.toService(this.appKeFuUrl)
			},
			
			/**
			 * 跳转到账户管理页面
			 */
			goToSettings() {
				uni.navigateTo({
					url: '/pages/user/settings'
				})
			},
			
			/**
			 * 跳转到交易记录页面
			 */
			goToRecords() {
				uni.navigateTo({
					url: '/pages/user/records'
				})
			},
			
			/**
			 * 获取客服信息
			 */
			getCustomerService() {
				user.getUserWhat({})
					.then(res => {
						if (res.data.code == 200) {
							this.appKeFuUrl = res.data.data.appKeFuUrl
							this.appFeiJiUrl = res.data.data.appFeiJiUrl
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			
			/**
			 * 打开外部链接（仅H5）
			 * @param {string} url - 要打开的URL
			 */
			toService(url) {
				//#ifdef H5
				window.open(url, '_blank')
				//#endif
				//#ifndef H5
				// 非H5平台的处理
				if (url) {
					uni.showToast({
						title: '正在打开...',
						icon: 'none'
					})
					// 可以使用 plus.runtime.openURL(url) 在App中打开
				} else {
					uni.showToast({
						title: '服务暂不可用',
						icon: 'none'
					})
				}
				//#endif
			},
			
			/**
			 * 获取整站维护通知
			 * */
			getNoticeList(){
				this.$maintainState.getNoticeList().then(res => {
					this.maintainData = res
					if(this.maintainData.web_maintain_status == this.$WEB_MAINTAIN_STATE){
						uni.navigateTo({
							url: '/pages/maintain/maintain'
						})
					}
				})
			},
			
			pageIndexEnd(){
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			
			/**
			 * 获取用户信息
			 * **/
			getUserinfo() {
				user.getUserInfo().then((res) => {
					if (res.data.code == 200) {
						this.user_name = res.data.data.user_name
						this.user_money = res.data.data.money_balance
						let length = res.data.data.head_img ? res.data.data.head_img.length : 0
						if(length > 0) {
							this.image = res.data.data.head_img
						}else{
							this.image = '/static/img/user/header.png'
						}
					} else {
						this.$tip.alert(res.data.message);
					}
				})
			},
			
			/**
			 * 打开展示头像
			 * **/
			handleHeadImg(){
				this.showHeadImg = true
			},
			
			/**
			 * 设置头像
			 * **/
			setHeadImg(imgData){
				this.image = imgData.url
				this.showHeadImg = false
				user.userImgUpdate({img: imgData.url}).then(res => {
					if(res.data.code == 200) {
						console.log(res)
					}
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100vh;
		overflow: hidden;
	}
	
	.page-view {
		height: 100%;
		background-color: #1D1C22;
		position: relative;
		display: flex;
		flex-direction: column;

		.user-head {
			height: 252rpx;
			background-image: url(../../static/img/user/card.png);
			background-size:100% 100%;
			width: calc(100% - 40rpx);
			color: white;
			margin: 0 auto;
			
			.user-box {
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				.user-img-box {
					width: 136rpx;
					height: 136rpx;
					border-radius: 50%;
					border: 2rpx solid #ebd093;
					display: flex;
					justify-content: center;
					padding: 4rpx;

					.user-img {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						overflow: hidden;
					}
				}

				.user-info {
					margin-left: 28rpx;
					.user-name-box,.user-amount-box{
						width: 340rpx;
						height: 40rpx;
						border-radius: 20rpx;
						margin-top: 8rpx;
						padding-left: 8rpx;
						line-height: 40rpx;
						color: #FFFFFF;
						font-size: 16px;
						font-weight: bold;
					}
					.user-name-box {
						.user-name-text {
							margin-left: 12rpx;
						}
						.accouct{
							margin-left: 12rpx;
						}
					}

					.user-amount-box {
						.amount {
							margin-left: 12rpx;
						}
						.accouct{
							margin-left: 12rpx;
						}	
					}
				}
			}
		}
		
		.user-photo{
			height: 100%;
			width: 100%;
		}
	}
	
	/* ========== 功能按钮区域样式 ========== */
	.function-actions {
	  width: calc(100% - 40rpx);
	  margin: 30rpx auto;
	  padding: 40rpx;
	  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
	  backdrop-filter: blur(10rpx);
	  border-radius: 24rpx;
	  border: 1rpx solid rgba(255, 255, 255, 0.2);
	  flex: 1;
	  overflow-y: auto;
	}
	
	.action-row {
	  display: flex;
	  justify-content: space-between;
	  margin-bottom: 30rpx;
	  
	  &:last-child {
	    margin-bottom: 0;
	  }
	}
	
	.action-btn {
	  flex: 1;
	  height: 100rpx;
	  margin: 0 15rpx;
	  border-radius: 20rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  position: relative;
	  overflow: hidden;
	  transition: all 0.3s ease;
	  border: 2rpx solid rgba(255, 255, 255, 0.1);
	  
	  &:first-child {
	    margin-left: 0;
	  }
	  
	  &:last-child {
	    margin-right: 0;
	  }
	  
	  &:active {
	    transform: scale(0.95);
	  }
	  
	  .action-icon {
	    font-size: 36rpx;
	    margin-bottom: 8rpx;
	  }
	  
	  .action-text {
	    font-size: 26rpx;
	    font-weight: 600;
	  }
	}
	
	/* 占位元素，用于最后一行的布局平衡 */
	.action-btn-placeholder {
	  flex: 1;
	  margin: 0 15rpx;
	  
	  &:last-child {
	    margin-right: 0;
	  }
	}
	
	/* 不同按钮的渐变色 */
	.charge-btn {
	  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	  color: #ffffff;
	  box-shadow: 0 6rpx 20rpx rgba(16, 185, 129, 0.3);
	}
	
	.withdraw-btn {
	  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	  color: #ffffff;
	  box-shadow: 0 6rpx 20rpx rgba(245, 158, 11, 0.3);
	}
	
	.withdraw-list-btn {
	  background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
	  color: #ffffff;
	  box-shadow: 0 6rpx 20rpx rgba(132, 204, 22, 0.3);
	}
	
	.telegram-btn {
	  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
	  color: #ffffff;
	  box-shadow: 0 6rpx 20rpx rgba(59, 130, 246, 0.3);
	}
	
	.service-btn {
	  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	  color: #ffffff;
	  box-shadow: 0 6rpx 20rpx rgba(239, 68, 68, 0.3);
	}
	
	.settings-btn {
	  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
	  color: #ffffff;
	  box-shadow: 0 6rpx 20rpx rgba(139, 92, 246, 0.3);
	}
	
	.records-btn {
	  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
	  color: #ffffff;
	  box-shadow: 0 6rpx 20rpx rgba(6, 182, 212, 0.3);
	}
</style>