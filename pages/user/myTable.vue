<template>
	<view class="myTable">
		<view class="tableTitle">
			<view class="th" v-for="(thItem, index) in thList" :key="index"
				:style="{width: thItem.label_width ? thItem.label_width + 'rpx' : '100rpx' }">
				{{ thItem.name }}
			</view>
		</view>
		<scroll-view scroll-y="true" class="tableBody" @scrolltolower="handleScrolltolower($event)">
			<view class="tr" v-for="(tdItem,inde) in tdList" :key="inde" @click="handleRow(tdItem)">
				<template v-if="userTabPage == 'note'">
					<view class="td"
						:style="{width: thList[0].label_width ? thList[0].label_width + 'rpx' : '100rpx' }">
						{{ tdItem.created_at }}
					</view>
					<view class="td"
						:style="{width: thList[1].label_width ? thList[1].label_width + 'rpx' : '100rpx' }">
						{{ tdItem.bet_amt}}
					</view>
					<view class="td"
						:style="{width: thList[2].label_width ? thList[2].label_width + 'rpx' : '100rpx' }">
						{{ tdItem.type_name }}
					</view>
					<view class="td"
						:style="{width: thList[3].label_width ? thList[3].label_width + 'rpx' : '100rpx' }">
						<view class="gameno" v-for="detail in tdItem.detailArr" :key="detail">
						     {{detail}}
						</view>
						<!-- {{ tdItem.detail }} -->
					</view>

					<view class="td"
						:style="{width: thList[4].label_width ? thList[4].label_width + 'rpx' : '100rpx' ,
						color:tdItem.win_amt >= 0 ? 'red' : 'green'}">
						{{ tdItem.win_amt }}
					</view>
				</template>
				<template v-if="userTabPage == 'loseLoss'">
					<view class="td"
						:style="{width: thList[0].label_width ? thList[0].label_width + 'rpx' : '100rpx' }">
						{{ tdItem.dates }}
					</view>
					<view class="td"
						:style="{width: thList[1].label_width ? thList[1].label_width + 'rpx' : '100rpx',
						color:tdItem.game_win_count > 0 ? 'red' : 'green' }">
						{{ tdItem.game_win_count }}
					</view>
					<!-- <view class="td"
						:style="{width: thList[0].label_width ? thList[0].label_width + 'rpx' : '100rpx' }">
						{{ tdItem.gold }}
					</view> -->
					<view class="td"
						:style="{width: thList[2].label_width ? thList[2].label_width + 'rpx' : '100rpx' ,
						color:tdItem.game_bet > 0 ? 'red' : 'green'}">
						{{ tdItem.game_bet }}
					</view>
				</template>
				<template v-if="userTabPage == 'wallet'">
					<view class="td"
						:style="{width: thList[0].label_width ? thList[0].label_width + 'rpx' : '180rpx' }">
						{{ tdItem.create_time }}
					</view>
					<view class="td"
						:style="{width: thList[1].label_width ? thList[0].label_width + 'rpx' : '180rpx' }">
						{{ tdItem.money }}
					</view>
					<view class="td"
						:style="{width: thList[1].label_width ? thList[0].label_width + 'rpx' : '60rpx' }" >
						{{ tdItem.status}}
					</view>
					<view class="td"
						:style="{width: thList[1].label_width ? thList[0].label_width + 'rpx' : '240rpx' }">
						{{ tdItem.money_end}}
					</view>
				</template>
			</view>
		</scroll-view>


	</view>
</template>

<script>
	export default {
		props: ['thList','tdList','userTabPage','height'],
		data() {
			return {

			};
		},
		watch: {
			'tdList'(val) {
				// console.log(val, 'watch')
			}
		},
		mounted() {
			this.height ? `${this.height}rpx` : '100%'
		},
		methods: {
			switchPage(pageName) {
				this.userTabPage = pageName
			},
			
			/**
			 * 拉到最底部
			 * */
			handleScrolltolower() {
				this.$emit("loadMore",{})
			},
			
			/**
			 * 单行点击
			 * @param {rowData} 单行数据  
			 * */
			handleRow(rowData){
				this.$emit("rowClick",rowData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myTable {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
		border: 2rpx solid #028FFE;
		padding: 0 16rpx;

		.tableTitle {
			height: 60rpx;
			border-bottom: 2rpx solid #ebd093;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.th {
				line-height: 60rpx;
				text-align: center;
				width: 100rpx;
				color: #FFFFFF;
				font-weight: 800;
			}
		}

		.tableBody {
			height: 90%;
			overflow: auto;

			.tr {
				border-bottom: 2rpx solid #ebd093;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.td {
					text-align: center;
					width: 100rpx;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
