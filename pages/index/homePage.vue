<template>
	<view class="home-page">
		<view class="home-panel">
			<Loading ref="loading" :custom="false" :shadeClick="false" :type="2" ></Loading>
			<view class="home-marquee">
				<view class="home-marquee-content" v-if="notice.length > 0">
					<image style="position: absolute;width: 60rpx;"  src="/static/img/index/horn.svg" mode=""></image>
					<marquee style="margin-left: 68rpx;">
						{{notice}}
					</marquee>
					<view class="" @click="handleShowNotice(true)">
						<image class="home-finger" src="/static/img/index/finger.svg" mode="" ></image>
					</view>
				</view>
			</view>
			<view class="">
				<view class="choose-game">
					<view class="choose-game-zh">
						{{indexLocales.selectGame}}
					</view>
					<view class="choose-game-en">
						CHOOSE GAME
					</view>
				</view>
			</view>
			<view class="home-list-content">
				<scroll-view scroll-y="true" class="home-games-block">
					<view class="home-list-itme">
						<!-- <view class="choose-game">
							<view class="choose-game-zh">
								{{indexLocales.selectGame}}
							</view>
							<view class="choose-game-en">
								CHOOSE GAME
							</view>
						</view> -->
						<view class="games">
							<view class="game-item" v-for="(gameItem, index) in gameList" :key="index"
								@tap="gotoGames(gameItem.id)">
								<image :src="gameItem.image" mode="" class="game-icon"></image>
								<view class="game-text">
									<view class="game-text-zh">
										{{ gameItem.type_name }}
									</view>
									<view class="game-text-en">
										{{ gameItem.name_EN }}
									</view>
								</view>
							</view>
							<view class="game-item"></view>
							<view class="game-item"></view>
							<view class="game-item"></view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="home-complete-notice" v-if="showNotice">
			<view class="home-not">
				<view class="home-not-txt">
					<view class="home-not-close" @click="handleShowNotice(false)">
						<image src="/static/img/index/close.svg" mode=""></image>
					</view>
					<view class="home-not-title">
						公告
					</view>
					<view class="home-not-content">
						{{notice}}
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/api/game"
	import Loading from '@/components/loading/loading.vue'
	export default {
		components:{
			Loading
		},
		data() {
			return {
				gameList: [
					// {
					// 	image: '/static/img/index/icon-bg.png',
					// 	name_zh: '百家乐',
					// 	name_EN: 'BACCARAT',
					// 	name_en: 'baccarat',
					// }
				],
				loginform: {},
				notice: '',
				//游戏列表页语言
				indexLocales: this._i18n.messages[this.$storageLan].index,
				//打开公告
				showNotice: false,
			}


		},
		mounted() {
			this.$refs.loading.open();
			setTimeout(() => {
				if(this.$refs.loading) {
					this.$refs.loading.close();
				}
			}, 1300)
			this.gameinfo();
			this.getNoticeList()
		},
		methods: {
			gameinfo() {
				api.gameType(this.loginform).then((res) => {
					this.loading = false;
					if (res.data.code == 200) {
						this.gameList=res.data.data
					} else {
						// this.$tip.alert(res.data.message);
					}
				})
			},
			gotoGames(game_type_id) {
				this.$emit("setPage", game_type_id);
			},
			/**
			 * 获取公告
			 * **/
			getNoticeList() {
				api.getTongZhi_v2().then(res => {
					if(res.data.code == 200 && res.data.data.length > 0){
						this.notice = res.data.data[0].content.replace('||', " ")
					}
				}) 
			},
			/**
			 * 设置打开关闭公告
			 * @param {b} true: 打开 false: 关闭 
			 * **/
			handleShowNotice(b) {
				this.showNotice = b
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home-page {
		height: 100%;
		position: relative;
		.choose-game {
			color: #edd2a3;
			// width: 240rpx;
			text-align: center;
			margin: 0 auto;
			margin-top: 32rpx;

			.choose-game-zh {
				font-family: '隶书';
				font-style: oblique;
				font-size: 60rpx;
			}

			.choose-game-en {
				font-weight: 500;
				font-size: 24rpx;
			}
		}
		.home-panel{
			position: relative;
			height: 100%;
		}
		.home-marquee{
			display: block;
			width: 95%;
			margin: 0 auto;
			margin-top: 30rpx;
			height: 62rpx;
			color: #d0c9c9;
			font-weight: bold;
			align-items: center;
			padding-bottom: 2rpx;
		}
		.home-marquee-content{
			position: relative;
			height: 100%;
			border: 1px solid #c3ad86;
			border-radius: 3px;
			display: flex;
			align-items: center;
			image{
				width: 50rpx;
				height: 50rpx;
			}
		}
		.home-games-block{
			height: 100%;
			overflow: scroll;
		}
		
		.home-list-content{
			width: 100%;
			height: calc(100% - 62rpx);
			overflow: auto;
		}
		.home-list-itme{
			width: 100%;
			height: 100%;
			overflow-x: hidden;
			overflow: auto;
		}
		.home-finger{
		}
		.home-complete-notice{
			position: fixed;
			width: 100%;
			height: 100%;
			z-index: 99999;
			top: 0;
			background-color: rgba(0,0,0,.85);
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.home-not{
			width: 80%;
			height: 50%;
		}
		.home-not-title{
			display: flex;
			justify-content: center;
			font-size: 22px;
			margin-bottom: 0rpx;
		}
		.home-not-txt{
			border: 1px solid #c3ad86;
			max-height: 70%;
			border-radius: 10rpx;
			padding: 0rpx 0rpx;
			color: white;
			overflow-y: auto;
		}
		.home-not-close{
			display: flex;
			height: 66rpx;
			align-items: center;
			justify-content: flex-end;
			image{
				width: 66rpx;
				height: 66rpx;
			}
		}
		.home-not-content{
			padding: 16rpx 20rpx;
		}
		.games {
			width: 100%;
			min-height: calc(100% - 100rpx);
			margin-top: 72rpx;
			padding: 0 40rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.game-item {
				width: 268rpx;
				height: 276rpx;
				// margin-right: calc((100% - (268rpx * 2)) / 2);
				// float: left;
				// margin-bottom: 90rpx;
				position: relative;

				.game-icon {
					width: 100%;
					height: 66%;
				}

				.game-text {
					width: 100%;
					text-align: center;
					position: absolute;
					bottom: 10rpx;
					color: #edd2a3;

					.game-text-zh {
						font-family: '隶书';
						font-weight: 900;
						font-style: oblique;
						font-size: 80rpx;
						margin: 0 auto;
					}

					.game-text-en {}
				}
			}
		}

	}
</style>
