<template>
	<view class="myWallet">
		<!-- <view class="search">
			<view class="search-label">{{userLocales.date}}：</view>
			<view class="search-list">
				{{defaultStartTime}}
				<u-icon name="arrow-down-fill" size="32" color="#ebd093" @click="selStart"></u-icon>
				<u-picker mode="time" :defaultTime="defaultStartTime" v-model="startShow" :params="params"
					end-year="2030" @confirm="confirmStart" confirm-color="#F6AB00" :show-time-tag="true">
				</u-picker>
			</view>
			<view class="zhi"> - </view>
			<view class="search-list">
				{{defaultEndTime}}
				<u-icon name="arrow-down-fill" size="32" color="#ebd093" @click="selEnd"></u-icon>
				<u-picker mode="time" :defaultTime="defaultEndTime" v-model="endShow" :params="params"
					end-year="2030" @confirm="confirmEnd" confirm-color="#F6AB00" :show-time-tag="true"></u-picker>
			</view>
		</view> -->
		<view class="search">
			<view class="search-date">
				<view class="">
					<text>{{userLocales.totalWinLose}}：</text><text >{{countData.count_win_amt}}</text>
				</view>
				<view >
					<text>{{userLocales.totalBet}}：</text><text >{{countData.count_bet_amt}}</text>
				</view>
			</view>
		</view>
		<view class="myLose_table">
			<mytable :thList="thList" :tdList="tdList" :userTabPage="userTabPage" @loadMore="handleMore()"></mytable>
		</view>
		
	</view>
</template>

<script>
	import mytable from './myTable.vue'
	import api from "@/api/log"
	export default {
		components: {
			mytable
		},
		props: ['date', 'userTabPage'],
		data() {
			return {
				stateIndex: '1',
				mydate: 'today',
				stateList: [{
					label: '全部',
					value: 1,
				}, {
					label: '存款',
					value: 2,
				}, {
					label: '取款',
					value: 3,
				}, {
					label: '下注',
					value: 3,
				}, {
					label: '派奖',
					value: 3,
				}],

				startShow: false,
				endShow: false,
				defaultStartTime: '',
				defaultEndTime: '',
				defaultSelector: [0],
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},

				thList: [{
					name: this._i18n.messages[this.$storageLan].user.time,
					label_width:300
				}, {
					name: this._i18n.messages[this.$storageLan].user.totalWinLoseTable,
					label_width: 120
				}, 
				// {
				// 	name: '总赢',
				// 	label_width: 120
				// }, 
				{
					name: this._i18n.messages[this.$storageLan].user.totalBetTable,
					label_width: 120
				}, ],
				sel: {},
				tdList: [],
				//分页条件
				pageCondition: {
					//当前页后台字段是这个名字
					page: 1,
					//每页条数
					limit: 50
				},
				//总数据
				countData: {
					count_win_amt: 0,
					count_bet_amt: 0
				},
				//用户双语
				userLocales: this._i18n.messages[this.$storageLan].user, 
			}
		},
		watch: {
			'date': function(val) {
				if (val) {
					this.mydate = val
					this.pageCondition.page = 1
					this.tdList = []
					this.sel.end = ''
					this.sel.start = ''
					switch (this.date) {
						case 'today':
							this.sel.type = 1;
							break;
						case 'yesterday':
							this.sel.type = 2;
							break;
						case 'week':
							this.sel.type = 3;
							break;
						case 'month':
							this.sel.type = 4;
							break;
						case 'earlier':
							this.sel.type = 0;
							break;
						default:
							this.sel.type = 1;;
					}
					this.getData()
				}
			}
		},
		mounted() {
			// this.defaultStartTime = this.getDate();
			// this.defaultEndTime = this.getDate();
			this.sel.type = 1
			this.sel.start = this.defaultStartTime;
			this.sel.end = this.defaultEndTime;
			this.getData()
		},
		methods: {
			getData() {
				this.sel.page = this.pageCondition.page
				this.sel.limit = this.pageCondition.limit
				
				api.betlog(this.sel).then((res) => {
					if (res.data.code == 200) {
						this.countData = res.data.data.count
						this.tdList.push.apply(this.tdList, res.data.data.data.data)
						if(res.data.data.data.length < 1 && this.pageCondition.page > 1) {
							this.pageCondition.page -= 1
						}
					}
				})
			},
			changeStatus(index) {
				if(index ==1){
					index =0;
				}
				this.current = index
				this.sel.end = '';
				this.sel.start = '';
				this.sel.status = index;
				this.pageCondition.page = 1
				this.tdList = []
			},
			/**
			 * 设置时间
			 * @param {type} start开始时间 end结束时间 
			 * **/
			setDate(type) {
				let date = new Date()
				let time = date.getTime()
				
				if(type == 'start'){
					time = date.getTime() - (30 * 24 * 60 * 60 * 1000)
				}
				let typeDate = new Date(time)
				// let hour = date.getHours();
				// let minute = date.getMinutes();
				// let second = date.getSeconds();
				let year = typeDate.getFullYear()
				let month = typeDate.getMonth() + 1
				month = month < 10 ? `0${month}` : month
				let fullDate = typeDate.getDate()
				fullDate = fullDate < 10 ? `0${fullDate}` : fullDate
				return year + '-' + month + '-' + fullDate;
					
			},
			selStart() {
				this.startShow = true;
			},
			selEnd() {
				this.endShow = true;
			},
			confirmStart(e) {
				this.$emit('dateChange',{})
				this.sel.type = 0
				// this.defaultStartTime = e.hour + ':' + e.minute + ':' + e.second;
				this.defaultStartTime = `${e.year}-${e.month}-${e.day}`
				this.sel.start = this.defaultStartTime;
				this.tdList = []
				this.pageCondition.page = 1
				this.getData()
			},
			confirmEnd(e) {
				this.$emit('dateChange',{})
				this.sel.type = 0
				// this.defaultEndTime = e.hour + ':' + e.minute + ':' + e.second;
				this.defaultEndTime = `${e.year}-${e.month}-${e.day}`
				this.sel.end = this.defaultEndTime;
				this.tdList = []
				this.pageCondition.page = 1
				this.getData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myWallet {
		color: white;
		height: 100%;
	}
	.search-label{
		margin-left: 20rpx;
	}
	.search-list {
		height: 52rpx;
		width: 280rpx;
		border: solid 2rpx #7f7f7f;
		color: #666666;
		border-radius: 26rpx;
		padding: 4rpx 12rpx;
		display: flex;
		align-items: center;
	
		.u-dropdown__content {
			width: 160rpx;
			height: 500rpx !important;
			left: -20rpx;
			.u-cell-item-box {
				background-color: rgba(0, 0, 0, 0);
	
				.u-cell {
	
					padding: 4rpx 24rpx;
	
					.u-cell__value {
						display: none;
					}
				}
			}
			.u-border-bottom:after {
				display: none;
			}
		}
	}
	.search {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;

		.search-state {
			display: flex;
			align-items: center;

			
		}

		.search-date {
			display: flex;
			align-items: center;
			margin-left: 20rpx;
			width: 100%;
			justify-content: space-between;
			color: white;
			.search-list {
				height: 52rpx;
				width: 280rpx;
				border: solid 2rpx #7f7f7f;
				color: #666666;
				border-radius: 26rpx;
				padding: 4rpx 12rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
	.myLose_table{
		height: calc(100% - 174rpx)
	}
</style>
