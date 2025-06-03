<template>
	<view class="switch-panel" id="switch-panel" :class="{'switch-run-draw': show, 'switch-close-draw':closePanelState=='close'}" @click="closeModel($event)">
		<view class="switch-popup">
			<scroll-view scroll-y="auto" style="padding-top: 10rpx;">
				<view class="tableItem" v-for="(item, index) in get_table" :key="index" @tap="intoTable(item)">
					<view class="tableTitle">
						<view class="title-text">
							{{item.localesTitle}}
						</view>
					</view>
					<view class="web-box">
						<iframe class="games-iframe" v-if="item.game_type == 2" :src="configService.lzLhUrl+ indexLocales.lzurl+'/list_lh.html?tableId=' + item.id" scrolling="yes" ></iframe>
						<iframe class="games-iframe" v-if="item.game_type == 3" :src="configService.lzBjlUrl + indexLocales.lzurl+'/list_bjl_678.html?tableId=' + item.id" scrolling="yes" ></iframe>
						<iframe class="games-iframe" v-if="item.game_type == 6" :src="`${configService.lzNnUrl}?table_id=${item.id}&game_type=${item.game_type}&user_id=${userInformation.id}&show_type=list`" scrolling="yes" ></iframe>
						<iframe class="games-iframe" v-if="item.game_type == 8" :src="`${configService.lzThreeUrl}?table_id=${item.id}&game_type=${item.game_type}&user_id=${userInformation.id}&show_type=list`" scrolling="yes" ></iframe>
						<view class="cover">
							<view class="state countDown" :style='item.countDownWenzi'>
								{{ item.showCoverText }}
								<image src="/static/img/index/start.png" style="width: 108rpx;height: 96rpx; display: none;" :style='item.showImg'></image>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import gameTable from "@/api/game"
	import configService from '@/common/service/config.service.js'
	
	export default {
		props: ['showModel'],
		data() {
			return {
				indexLocales: this._i18n.messages[this.$storageLan].index,
				//用户信息
				user: uni.getStorageSync('login_user_info'),
				show: false,
				//游戏桌定时器
				tableTimer: null,
				//需要的
				needToken: '',
				//游戏桌列表
				get_table: [],
				// 初始化 服务配置项目
				configService: configService,
				//关闭面板状态
				closePanelState: 'init',
				userInformation: uni.getStorageSync('login_user_info')
			}
		},
		watch: {
			'showModel'(val) {
				this.show = val
				if (val) {
					this.closePanelState = 'open'
					this.getGameTable()
				} else {
					clearTimeout(this.tableTimer)
					this.get_table = []
				}
			}
		},
		mounted() {
			this.getGameTable()
			this.needToken = uni.getStorageSync('Access-Token')
		},
		destroyed() {
			clearTimeout(this.tableTimer)
		},
		methods: {
			/**
			 * 获取游戏桌列表
			 */
			getGameTable() {
				if (this.tableTimer != null) {
					clearTimeout(this.tableTimer)
				}
				
				let routes = getCurrentPages()
				let curParam = routes[routes.length - 1].options
				
				gameTable.gameTable({
					type_id: curParam.type_id
				}).then((res) => {
					if (res.data.code == 200) {
						this.get_table = res.data.data
						
						// 处理多语言标题
						this.get_table.forEach(el => {
							if (el.table_explain.length == 0) {
								el.localesTitle = el.table_title
							} else {
								el.localesTitle = el.table_explain[this.$storageLan]
							}
						})
						
						this.sortTableList()
						this.getTableState()
					} else {
						console.error('获取游戏桌列表失败:', res.data.message)
					}
				}).catch(error => {
					console.error('获取游戏桌列表异常:', error)
				})
			},

			/**
			 * 遍历台桌状态
			 */
			getTableState() {
				this.get_table.forEach((tabItem, index) => {
					let showCoverText_temp = ''
					let countDownWenzi_temp = ''
					let showImg_temp = ''

					if (tabItem.status == 1) {
						if (tabItem.run_status == 0) {
							// 暂停状态
							countDownWenzi_temp = { border: 'none', background: "none" }
							showCoverText_temp = this.$locales.index.pause
						}
						if (tabItem.wash_status != 1) {
							if (tabItem.end_time >= 0 && tabItem.run_status != 2) {
								// 倒计时显示 开始 
								countDownWenzi_temp = {}
								showImg_temp = {}
								// 倒计时显示 结束 
								showCoverText_temp = tabItem.end_time
								this.$set(tabItem, 'showCoverText', showCoverText_temp)
							} else {
								countDownWenzi_temp = { border: 'none', background: "none" }
								showImg_temp = { display: 'block' }
							}
						}
						if (tabItem.wash_status == 1) {
							// 开牌中，非倒计时 状态
							countDownWenzi_temp = { border: 'none', background: "none" }
							showImg_temp = { display: 'none' }
							showCoverText_temp = this.$locales.index.shuffle
						}
					} else {
						// 维护状态
						countDownWenzi_temp = { border: 'none', background: "none" }
						showCoverText_temp = this.$locales.index.maintenance
					}
					this.$set(tabItem, 'showCoverText', showCoverText_temp)
					this.$set(tabItem, 'countDownWenzi', countDownWenzi_temp)
					this.$set(tabItem, 'showImg', showImg_temp)
				})
			},

			/**
			 * 进入台桌
			 */
			intoTable(index) {
				// 正常状态 进入台桌
				if (index.status == 1) {
					// 如果百家乐
					if (index.game_type == 3) {
						uni.redirectTo({
							url: '/pages/live/gameBjlAndLh?table_id=' + index.id + '&game_type_id=' + index.game_type
						})
					}
					// 如果龙虎
					if (index.game_type == 2) {
						uni.redirectTo({
							url: '/pages/live/gameBjlAndLh?table_id=' + index.id + '&game_type_id=' + index.game_type
						})
					}
					// 如果牛牛
					if (index.game_type == 6) {
						uni.redirectTo({
							url: '/pages/live/niuniu?table_id=' + index.id + '&game_type_id=' + index.game_type
						})
					}
					// 如果三公
					if (index.game_type == 8) {
						uni.redirectTo({
							url: '/pages/live/sangong?table_id=' + index.id + '&game_type_id=' + index.game_type
						})
					}
					return
				} else if (index.status > 1) {
					this.$tip.alert(this.$locales.index.underMaintenance + '...')
					return
				}
				// 异常状态 退出台桌
				this.$tip.alert(this.$locales.index.underMaintenance + '...')
			},

			/**
			 * 桌子列表排序
			 */
			sortTableList() {
				this.get_table.sort((x, y) => {
					if (x.id > y.id) {
						return 1
					} else if (x.id < y.id) {
						return -1
					} else {
						return 0
					}
				})
			},

			/**
			 * 关闭面板
			 */
			closeModel(e) {
				if (e.target.id != 'switch-panel') {
					return
				}
				this.closePanelState = 'close'
				this.$emit('drawClose', {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-drawer-content {
		background-color: #1D1C22;
		border-radius: 20rpx 0 0 20rpx;
		border: 2rpx solid #E7CA90;
		border-right: none;
	}
	
	$drawWidth: 80%;
	
	.switch-panel {
		position: fixed;
		top: 0;
		width: 100%;
		right: -100%;
		bottom: 0;
		z-index: 99;
		padding-top: 60rpx;
	}
	
	.games-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
	
	.switch-popup {
		border: 1px solid #ebd093;
		border-bottom-left-radius: 10rpx;
		border-top-left-radius: 10rpx;
		width: $drawWidth;
		background-color: black;
		height: 100%;
		border-right: none;
		float: right;
		overflow: auto;
	}
	
	.switch-run-draw {
		animation: drawOpenAnimation 1s forwards;
	}
	
	@keyframes drawOpenAnimation {
		from {
			right: -100vw;
		}
		to {
			right: 0;
		}
	}
	
	.switch-close-draw {
		animation: drawCloseAnimation 1s forwards;
	}
	
	@keyframes drawCloseAnimation {
		from {
			right: 0;
		}
		to {
			right: -100vw;
		}
	}
	
	.cover {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		z-index: 99;
	}
	
	.state {
		position: absolute;
		right: 60rpx;
		top: 4rpx;
		z-index: 999;
	}
	
	.countDown {
		text-align: center;
		width: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 44rpx;
		font-weight: 600;
		background-color: rgba(0, 0, 0, .6);
		border-radius: 50%;
		border: 4rpx solid;
		border-color: #FB5D56;
		color: #FB5D56;
		display: block;
	}
	
	.tableItem {
		width: 98%;
		height: 232rpx;
		overflow: hidden;
		background-color: #FFFFFF;
		margin: 6rpx auto;
		position: relative;

		.tableTitle {
			background-color: #000000;
			margin: 0 auto;
			height: 20rpx;
			line-height: 20rpx;

			.title-text {
				color: #E7CA90;
				font-size: 24rpx;
				transform: scale(.8);
				transform-origin: 0 0;
			}
		}

		.web-box {
			width: 100%;
			height: calc(100% - 20rpx);
			position: relative;
		}
		
		.table-time {
			position: absolute;
			z-index: 1000;
			color: #ACD290;
			font-size: 16px;
			width: 50rpx;
		}
	}
</style>