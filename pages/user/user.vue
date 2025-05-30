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
		<view class="user-section">
			<view class="user-panel">
				<view class="user-tabs">
					<view class="user-tab-item" :class="userPage.pageName == userTabPage ? 'user-tab-item-active' : ''"
						v-for="(userPage, index) in userTabPageList" :key="index" @tap="switchPage(userPage.pageName)">
						<view class="user-tab-item-body">
							<!-- <u-icon :name="userPage.icon" size="40"></u-icon> -->
							<view>{{ userPage.name }}</view>
							<view class="user-tab-line" v-if="userPage.pageName == userTabPage">
								
							</view>
						</view>
					</view>
				</view>
				
				<view class="user-info-body">
					<view class="info-btns" style="color: #FFFFFF; display: none;">
						{{timeSub}}
					</view>
					<view class="info-btns" v-if="userTabPage == 'account'">
						<view class="info-btn" :class="accountPage == 'baseSet' ? 'info-btn-active' : ''" v-if="loginUserInfo.is_fictitious == 0">
							<view class="btn-text" @click="accountPage = 'baseSet'">{{userLocales.accountSettings}}</view>
						</view>
						<view class="info-btn" :class="accountPage == 'safety' ? 'info-btn-active' : ''"  v-if="loginUserInfo.is_fictitious == 0">
							<view class="btn-text" @click="accountPage = 'safety'">{{userLocales.security}}</view>
						</view>
						<view class="info-btn" :class="accountPage == 'problem' ? 'info-btn-active' : ''" v-if="loginUserInfo.is_fictitious == 0">
							<view class="btn-text" @click="accountPage = 'problem'">{{userLocales.solution}}</view>
						</view>
						<view class="" :class="accountPage == 'baseSet' ? 'info-btn-out' : ''" v-if="loginUserInfo.is_fictitious != 0">
							<view class="btn-text" @click="logout()">{{userLocales.logOut}}</view>
						</view>
					</view>
					<view class="info-btns-date" v-if="showDateTab">
						<view class="info-btn-his" :class="date == 'today' ? 'info-btn-his-active' : ''">
							<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'today'">{{userLocales.today}}</view>
						</view>
						<view class="info-btn-his" :class="date == 'yesterday' ? 'info-btn-his-active' : ''">
							<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'yesterday'">{{userLocales.yesterday}}</view>
						</view>
						<view class="info-btn-his" :class="date == 'week' ? 'info-btn-his-active' : ''">
							<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'week'">{{userLocales.currentWeek}}</view>
						</view>
						<view class="info-btn-his" :class="date == 'month' ? 'info-btn-his-active' : ''">
							<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'month'">{{userLocales.currentMonth}}</view>
						</view>
						<view class="info-btn-his" :class="date == 'earlier' ? 'info-btn-his-active' : ''">
							<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'earlier'">{{userLocales.earlier}}</view>
						</view>
					</view>
					<userAccount :page="accountPage"  v-if="userTabPage == 'account' && loginUserInfo.is_fictitious == 0"></userAccount>
					<userWallet :date="date" :userTabPage="userTabPage" v-if="userTabPage == 'wallet'" @dateChange="setDate($event)"></userWallet>
					<userNote :date="date" :userTabPage="userTabPage" v-if="userTabPage == 'note'" @dateChange="setDate($event)"></userNote>
					<userLoseLoss :date="date" :userTabPage="userTabPage" v-if="userTabPage == 'loseLoss'" @dateChange="setDate($event)"></userLoseLoss>
				
				</view>
			</view>
		</view>
		<!-- <view class="user-tabs">
			<view class="user-tab-item" :class="userPage.pageName == userTabPage ? 'user-tab-item-active' : ''"
				v-for="(userPage, index) in userTabPageList" :key="index" @tap="switchPage(userPage.pageName)">
				<view class="user-tab-item-body">
					<u-icon :name="userPage.icon" size="40"></u-icon>
					<view>{{ userPage.name }}</view>
				</view>
			</view>
		</view>

		<view class="user-info-body">
			<view class="info-btns" style="color: #FFFFFF; display: none;">
				{{timeSub}}
			</view>
			<view class="info-btns" v-if="userTabPage == 'account'">
				<view class="info-btn" :class="accountPage == 'baseSet' ? 'info-btn-active' : ''" v-if="loginUserInfo.is_fictitious == 0">
					<view class="btn-text" @click="accountPage = 'baseSet'">{{userLocales.accountSettings}}</view>
				</view>
				<view class="info-btn" :class="accountPage == 'safety' ? 'info-btn-active' : ''"  v-if="loginUserInfo.is_fictitious == 0">
					<view class="btn-text" @click="accountPage = 'safety'">{{userLocales.security}}</view>
				</view>
				<view class="info-btn" :class="accountPage == 'problem' ? 'info-btn-active' : ''" v-if="loginUserInfo.is_fictitious == 0">
					<view class="btn-text" @click="accountPage = 'problem'">{{userLocales.solution}}</view>
				</view>
				<view class="info-btn" :class="accountPage == 'baseSet' ? 'info-btn-active' : ''" v-if="loginUserInfo.is_fictitious != 0">
					<view class="btn-text" @click="logout()">{{userLocales.logOut}}</view>
				</view>
			</view>
			<view class="info-btns-date" v-if="showDateTab">
				<view class="info-btn" :class="date == 'today' ? 'info-btn-active' : ''">
					<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'today'">{{userLocales.today}}</view>
				</view>
				<view class="info-btn" :class="date == 'yesterday' ? 'info-btn-active' : ''">
					<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'yesterday'">{{userLocales.yesterday}}</view>
				</view>
				<view class="info-btn" :class="date == 'week' ? 'info-btn-active' : ''">
					<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'week'">{{userLocales.currentWeek}}</view>
				</view>
				<view class="info-btn" :class="date == 'month' ? 'info-btn-active' : ''">
					<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'month'">{{userLocales.currentMonth}}</view>
				</view>
				<view class="info-btn" :class="date == 'earlier' ? 'info-btn-active' : ''">
					<view class="btn-text" :class="{'btn-text-en': $storageLan == 'en', 'btn-text-zh': $storageLan == 'zh'}" @click="date = 'earlier'">{{userLocales.earlier}}</view>
				</view>
			</view>
			<userAccount :page="accountPage"  v-if="userTabPage == 'account' && loginUserInfo.is_fictitious == 0"></userAccount>
			<userWallet :date="date" :userTabPage="userTabPage" v-if="userTabPage == 'wallet'" @dateChange="setDate($event)"></userWallet>
			<userNote :date="date" :userTabPage="userTabPage" v-if="userTabPage == 'note'" @dateChange="setDate($event)"></userNote>
			<userLoseLoss :date="date" :userTabPage="userTabPage" v-if="userTabPage == 'loseLoss'" @dateChange="setDate($event)"></userLoseLoss>

		</view> -->
		<headImg v-if="showHeadImg" @handleHadeImg="setHeadImg($event)"></headImg>
	</view>
</template>

<script>
	import userAccount from './userAccount.vue'
	import userWallet from './userWallet.vue'
	import userNote from './userNote.vue'
	import userLoseLoss from './userLoseLoss.vue'
	import headImg from './headImg.vue'
	import user from "@/api/api"


	export default {
		components: {
			userAccount,
			userWallet,
			userNote,
			userLoseLoss,
			headImg
		},
		data() {
			return {
				timeSub:0,
				image:'',
				loadingImg:'/static/img/user/header.png',
				errorImg:'/static/img/user/header.png',
				
				userTabPageList: [{
					id: 1,
					icon: 'account',
					name: this._i18n.messages[this.$storageLan].user.myAccountName,
					pageName: 'account',
				},  {
					id: 3,
					icon: 'order',
					name:  this._i18n.messages[this.$storageLan].user.myBet,
					pageName: 'note',
				}, {
					id: 4,
					icon: 'moments',
					name: this._i18n.messages[this.$storageLan].user.myWinLose,
					pageName: 'loseLoss',
				}, {
					id: 2,
					icon: 'calendar-fill',
					name: this._i18n.messages[this.$storageLan].user.myWallet,
					pageName: 'wallet',
				}],
				userTabPage: 'account',
				accountPage: 'baseSet',
				date: 'today', //today,yesterday,week,month
				user_name: '',
				user_money: 0,
				//用户登录信息
				loginUserInfo: uni.getStorageSync('login_user_info'),
				//显示时间tab
				showDateTab: false,
				//用户双语
				userLocales: this._i18n.messages[this.$storageLan].user, 
				//维护数据
				maintainData: {},
				//展示头部头像
				showHeadImg: false,
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
		},
		methods: {
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
			switchPage(pageName) {
				this.showDateTab = true
				if(pageName == 'account' ){
					this.showDateTab = false
				}
				this.userTabPage = pageName
				// 只要切换 就重置
				this.accountPage = 'baseSet'
				this.date = 'today'
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
			//退出登录
			logout(){
				uni.removeStorageSync('login_user_info')
				uni.removeStorageSync('Access-Token')
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			/**
			 * 设置日期
			 * @param e: 返回的数据 
			 * **/
			setDate(e){
				this.date = ''
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
	.user-section{
		height: calc(100% - 90rpx - 252rpx);
		position: relative;
		background-color: #313131;
	}
	.user-panel{
		height: 100%;
		width: 100%;
		top: -40rpx;
		padding-top: 60rpx;
		position: absolute;
		background-image: url(../../static/img/user/bgimg.png);
		background-size: 100% 100%;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.user-photo{
		height: 100%;
		width: 100%;
	}
	$gradientBackground: linear-gradient(to right, #af9a6e, #f5d89a);
	
	.info-btn-his{
		padding: 0 6rpx 4rpx 6rpx;
		color: #ffffff;
		height: 60rpx;
		border-radius: 30rpx;
		font-size: 12px;
		
		border: 1px solid #999999;
		.btn-text {
			width: 100%;
			height: 52rpx;
			line-height: 52rpx;
			white-space: nowrap;
			transform: scale(.9);
		}
	}
	.info-btn-his-active{
		background: linear-gradient(-90deg, #018DFE, #17C4FF);
	}
	.page-view {
		// position: absolute;
		// width: 100%;
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
						// border: 2rpx solid #666;
						margin-top: 8rpx;
						padding-left: 8rpx;
						line-height: 40rpx;
						
						color: #FFFFFF;
						//text-align: center;
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
		.info-btn-out{
			background-image: url(../../static/img/user/button.png);
			background-size:100% 100%;
			padding: 10rpx 20rpx;
			color: white;
			color: #ffffff;
			height: 60rpx;
			border-radius: 30rpx;
			font-size: 24rpx;
		}
		.user-tabs {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #ffffff;
			border-bottom:1px solid #666666 ;

			.user-tab-item {
				width: 25%;
				height: 88rpx;
				text-align: center;
				// border-right: 2rpx solid #555360;

				.user-tab-item-body {
					width: 100%;
					height: 100%;
					position: relative;
				}
			}

			.user-tab-item-active {
				color: #0392FE;

				.user-tab-item-body {
					// border-bottom: 6rpx solid;
					// border-image: linear-gradient(to right, #0392FE, #0392FE) 30 30;
				}
			}
			.user-tab-line{
				height: 6rpx;
				width: 90rpx;
				position: absolute;
				bottom: 0;
				left: 50rpx;
				background-color: #0392FE;
				border-radius: 3rpx;
			}
		}

		.user-info-body {
			padding: 40rpx 10rpx 0 8rpx;
			flex: 1;
			overflow: hidden;
			.info-btn {
				padding:0 10rpx 4rpx 10rpx;

				color: #ffffff;
				height: 60rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
				border: 1px solid #999999;

				.btn-text {
					width: 100%;
					height: 52rpx;
					line-height: 52rpx;
					white-space: nowrap;
					transform: scale(.9);
				}
			}

			.info-btn-active {
				background: linear-gradient(-90deg, #018DFE, #17C4FF);
				border: 1px solid #17C4FF;
				// color: #1D1C22;
			}

			.info-btns {
				display: flex;
				align-items: center;
				margin-bottom: 48rpx;

				.info-btn {
					margin-right: 20rpx;

					.btn-text {
						font-weight: 800;
					}

				}
			}

			.info-btns-date {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 36rpx;

				.btn-text {
					transform: none;
				}
				.btn-text-zh{
					padding: 0 40rpx;
				}
				.btn-text-en{
					padding: 0 20rpx;
				}
			}



		}

	}
</style>
