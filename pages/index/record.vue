<template>
    <u-popup 
	v-model="show" 
	mode="center" 
	border-radius="32" 
	:mask="false" 
	:closeable="true" 
	close-icon="close-circle"
	close-icon-color="#ff0000" 
	close-icon-size="40" 
	width="98%"
    height="1200" 
	@close="closeModel">
        <view class="record_pop daxigua">
            <view class="record_title">
                {{indexLocales.history}}
            </view>
            <view class="members_info">
                <text>{{indexLocales.member}}: {{user_info.user_name}}</text>
                <text style="margin: 0 20rpx;">|</text>
                <text>{{indexLocales.number}}: {{user_info.phone}}</text>
            </view>
            <view class="date_select">
                <view class="date_item" @click="setDate(1)" :class="getDate == 1 ? 'date_item_active' : ''">
                    {{indexLocales.today}}
                </view>
                <view class="date_item" @click="setDate(2)" :class="getDate == 2 ? 'date_item_active' : ''">
                    {{indexLocales.yesterday}}
                </view>
                <view class="date_item" @click="setDate(3)" :class="getDate == 3 ? 'date_item_active' : ''">
                    {{indexLocales.currentWeek}}
                </view>
				<view class="date_item" @click="setDate(4)" :class="getDate == 4 ? 'date_item_active' : ''">
				    {{indexLocales.currentMonth}}
				</view>
                <view class="date_item" @click="setDate(0)" :class="getDate == 0 ? 'date_item_active' : ''">
                    {{indexLocales.earlier}}
                </view>
            </view>
			<view class="record_date">
				<view class="">
					{{userLocales.date}}：
				</view>
				<view class="record_search_list">
					{{defaultStartTime}}
					<u-icon name="arrow-down-fill" size="32" color="#ebd093" @click="selStart" class="record_arrow_down"></u-icon>
					<u-picker mode="time" :defaultTime="defaultStartTime" v-model="startShow" :params="params"
						end-year="2030" @confirm="confirmStart" confirm-color="#F6AB00" :show-time-tag="true">
					</u-picker>
				</view>
				<view class="zhi">-</view>
				<view class="record_search_list">
					{{defaultEndTime}}
					<u-icon name="arrow-down-fill" size="32" color="#ebd093" @click="selEnd" class="record_arrow_down"></u-icon>
					<u-picker mode="time" :defaultTime="defaultEndTime" v-model="endShow" :params="params"
						end-year="2030" @confirm="confirmEnd" confirm-color="#F6AB00" :show-time-tag="true">
					</u-picker>
				</view>
			</view>
            <view class="total_info">
                <view class="total_info_item">
                    <view class="total_title">
                        {{indexLocales.currentDaySettlement}}
                    </view>
                    <text class="total_text">{{total_info.date}}</text>
                </view>
				
               <!-- <view class="total_info_item">
                    <view class="total_title">
                        {{indexLocales.kind}}
                    </view>
                    <text class="total_text">{{indexLocales.game}}</text>
                </view> -->
				
                <view class="total_info_item">
                    <view class="total_title">
                        {{indexLocales.transaction}}
                    </view>
                    <text class="total_text">{{total_info.water}}</text>

                </view>
                <view class="total_info_item">
                    <view class="total_title">
                        {{indexLocales.profit}}
                    </view>
                    <text class="total_text">{{total_info.profit}}</text>

                </view>
                <!-- <view class="total_info_item">
                    <view class="total_title">
                        佣金
                    </view>
                    <text class="total_text">0</text>
                </view> -->
            </view>
            <view class="record_table">
                <view class="tableTitle">
                    <view class="th">
                        {{indexLocales.billNo}}
                    </view>
                    <view class="th">
                        {{indexLocales.time}}
                    </view>
                    <view class="th" style="margin-left: 12rpx;">
                        {{indexLocales.betType}}
                    </view>
                    <view class="th" style="width: 120rpx;">
                        {{indexLocales.content}}
                    </view>
                    <view class="th" style="width: 120rpx;">
                        {{indexLocales.amount}}
                    </view>
                    <view class="th" style="width: 120rpx;">
                        {{indexLocales.actualProfit}}
                    </view>
                </view>
                <scroll-view scroll-y="true" class="tableBody" @scrolltolower="handleMore()">
                    <view class="tr" v-for="(userPage, index) in tdList" :key="index">
                        <view class="td" style="width: 100rpx;">
                            <view class="order">{{userPage.id}}</view>
                            <view class="winLose">
                                <view class="role">{{userPage.lz_result.main}}</view>
                                <view v-if="userPage.win_amt > 0" style="color:red">{{indexLocales.win}}</view>
                                <view v-if="userPage.win_amt < 0" style="color:green">{{indexLocales.lost}}</view>
								<!-- <view v-if="userPage.win_amt == 0 && " style="color:green">待</view> -->
                            </view>
                        </view>
                        <view class="td" style="width: 100rpx;">
                            <view class="date">{{userPage.created_at.split(' ')[0]}}</view>
                            <view class="time">{{userPage.created_at.split(' ')[1]}}</view>
                        </view>
                        <view class="td" style="width: 100rpx;margin-right: 0rpx;">
                            <view class="colorof">
                               {{indexLocales.bjl}}
                            </view>
                        </view>
                        <view class="td" style="width: 100rpx;display: flex;justify-content: center;">
                            <view class="body">
                                <!-- <view class="gameno">
                                     {{userPage.detail}}
                                </view> -->
								<!-- <view class="gameno" v-for="detail in userPage.detailArr" :key="detail">
								     {{detail}}
								</view> -->
                                <!-- <view class="">
                                    
                                </view> -->
                                <view class="">
                                    [{{indexLocales.odds}}:{{userPage.game_peilv}}]
                                </view>
                            </view>
                        </view>
                        <view class="td" style="width: 100rpx;">
                            <view class="amount-red" :class="{'amount-green':userPage.win_amt<0}">
                                 {{userPage.bet_amt}}
                            </view>
                        </view>
                        <view class="td" style="width: 100rpx;">
                            <view class="amount-red" :class="{'amount-green':userPage.win_amt<0}" >
                                {{userPage.win_amt}}
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </u-popup>
</template>

<script>
	import api from "@/api/log"
    export default {
        props: ['showModel'],
        data() {
            return {
                show: false,
				getDate: 1,
				sel:{},
				total_info:[],
				tdList:[],
				user_info:[],
				//显示开始时间
				startShow: false,
				//显示结束时间
				endShow: false,
				//开始时间
				defaultStartTime: '2019-01-01',
				//结束时间
				defaultEndTime: '2030-12-31',
				//时间选择配置
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				//分页条件
				pageCondition: {
					//当前页后台字段是这个名字
					page: 1,
					//每页条数
					limit: 50
				},
				//游戏列表页语言
				indexLocales: this._i18n.messages[this.$storageLan].index,
				//用户双语
				userLocales: this._i18n.messages[this.$storageLan].user, 
            }
        },
		watch:{
            showModel(val) {
                this.show = val
				this.pageCondition.page = 1
				this.tdList = []
				this.getLog()
				this.getLogby()
            }
        },
		mounted(){
			this.user_info = uni.getStorageSync('login_user_info');
			this.sel.type= this.getDate;
			this.defaultStartTime = this.setInitDate('start');
			this.defaultEndTime = this.setInitDate('end');
			this.getLog();
			this.getLogby();
		},
        methods: {
            closeModel() {
				this.$emit("closeRecord", {})
                this.$parent.current = 5
            },
			/**
			 * 加载更多
			 * **/
			handleMore() {
				this.pageCondition.page ++ 
				this.getLog()
			},
			getLog(){
				this.sel.page = this.pageCondition.page
				this.sel.limit = this.pageCondition.limit
				api.bet_list_log(this.sel).then((res) => {
					if (res.data.code == 200) {
						// this.tdList = res.data.data.data
						this.tdList.push.apply(this.tdList, res.data.data.data)
						if(this.tdList.length > 0) {
							this.tdList.forEach(el => {
								el.detailArr = el.detail.split('：')
								 
								if(el.lz_result.main == '和') {
									el.lz_result.main = 'T'
								}
								if(el.lz_result.main == '庄') {
									el.lz_result.main = 'B'
								}
								if(el.lz_result.main == '闲') {
									el.lz_result.main = 'P'
								}
							})
						}
						if(res.data.data.data.length < 1 && this.pageCondition.page > 1) {
							this.pageCondition.page -= 1
						}
					}
				})
			},
			getLog_v1(){
				this.sel.page = this.pageCondition.page
				this.sel.limit = this.pageCondition.limit
				api.betlog(this.sel).then((res) => {
					if (res.data.code == 200) {
						// this.tdList = res.data.data.data
						this.tdList.push.apply(this.tdList, res.data.data.data)
						if(this.tdList.length > 0) {
							this.tdList.forEach(el => {
								el.detailArr = el.detail.split('：')
							})
						}
						if(res.data.data.data.length < 1 && this.pageCondition.page > 1) {
							this.pageCondition.page -= 1
						}
					}
				})
			},
			// 调用统计
			getLogby(){
				api.betlogby(this.sel).then((res) => {
					if (res.data.code == 200) {
						this.total_info = res.data.data
					}
				})
			},
			setDate(val) {
				this.getDate = val
				this.sel.type=val;
				this.pageCondition.page = 1
				this.tdList = []
				this.sel.start = ''
				this.sel.end = ''
				this.getLog();
				this.getLogby();
			},
			/**
			 * 设置初始化时间
			 * @param {type} start开始时间 end结束时间 
			 * **/
			setInitDate(type) {
				let date = new Date()
				let time = date.getTime()
				
				if(type == 'start'){
					//开始时间提前30天
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
			//开始时间确定
			confirmStart(e) {
				this.sel.type = 0
				// this.defaultStartTime = e.hour + ':' + e.minute + ':' + e.second;
				this.defaultStartTime = `${e.year}-${e.month}-${e.day}`
				this.sel.start = this.defaultStartTime;
				this.sel.end = this.defaultEndTime
				this.tdList = []
				this.pageCondition.page = 1
				this.getDate = -1
				this.getLog()
				this.getLogby()
			},
			//结束时间确定
			confirmEnd(e) {
				this.sel.type = 0
				// this.defaultEndTime = e.hour + ':' + e.minute + ':' + e.second;
				this.defaultEndTime = `${e.year}-${e.month}-${e.day}`
				this.sel.start = this.defaultStartTime
				this.sel.end = this.defaultEndTime
				this.tdList = []
				this.pageCondition.page = 1
				this.getDate = -1
				this.getLog()
				this.getLogby()
			}
        }
    }
</script>

<style lang="scss" scoped>
    .u-mode-center-box {
        background-color: rgba(0, 0, 0, .8);

        .u-close--top-right {
            right: 8rpx;
            top: 8rpx;
        }
    }
	.record_arrow_down{
		margin-left: 20rpx;
	}
	.record_date{
		display: flex;
	}
	.record_search_list {
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
    .record_pop {
        width: 100%;
        height: 100%;
        padding: 32rpx 20rpx 20rpx 20rpx;
        color: #FFFFFF;
        border: 2rpx solid #635847;
        border-radius: 32rpx;
        .record_title {
            text-align: center;
            font-size: 40rpx;
        }

        .members_info {
            font-size: 28rpx;
            text-align: center;
            margin-top: 36rpx;
            margin-bottom: 22rpx;
        }

        .date_select {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 52rpx;
            margin-bottom: 24rpx;

            .date_item {
                width: 136rpx;
                color: #7f7f7f;
                height: 52rpx;
                border-radius: 30rpx;
                font-size: 28rpx;
                border: 2rpx solid #666;
                line-height: 52rpx;
                text-align: center;
            }

            .date_item_active {
                background: linear-gradient(to right, #af9a6e, #f5d89a);
                color: #1D1C22;
            }
        }

        .total_info {
            width: 100%;
            height: 92rpx;
            background-color: #000;
            border-radius: 16rpx;
            display: flex;
            padding: 4rpx 0;
            margin-bottom: 8rpx;
			justify-content: space-between;

            .total_info_item {
                width: 220rpx;
                position: relative;
                text-align: center;
                font-size: 24rpx;

                .total_title {
                    text-align: center;
                    font-size: 26rpx;
                    margin-bottom: 14rpx;
                }

                .total_text {
                    color: #7f7f7f;
                    white-space: nowrap;
                    transform: scale(.9);
                }
            }

            .total_info_item:not(:last-child)::after {
                position: absolute;
                content: '　';
                top: 20rpx;
                right: 0;
                width: 2rpx;
                height: 48rpx;
                background: linear-gradient(#af9a6e, #f5d89a);
            }
        }

        .record_table {
            width: 100%;
            height: 668rpx;
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
                    font-size: 24rpx;
                    transform: scale(.9);
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
                    // justify-content: space-between;
                    align-items: center;
                    // padding: 0 0 12rpx 0;
                    width: 100%;

                    .td {
                        font-size: 24rpx;
                        text-align: center;
                        // width: 100rpx;
                        color: #FFFFFF;
                        margin-right: 14rpx;
                        .order {
                            transform: scale(.7);
                            transform-origin: 10% 20%;
                        }

                        .winLose {
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            .role {
                                width: 44rpx;
                                height: 44rpx;
                                line-height: 44rpx;
                                text-align: center;
                                border-radius: 50%;
                                background-color: #f1141b;
                                margin-right: 8rpx;
                            }
                        }

                        .date {
                            transform: scale(.8);
                            transform-origin: 0 0;
                            white-space: nowrap;
                        }

                        .time {
                            transform: scale(.8);
                        }

                        .colorof {
                            transform: scale(.9);
                            // transform-origin: 0 0;
                            color: #ebd093;
                        }
                        .body{
                            width: 148rpx;
                            transform: scale(.9);
                            line-height: 24rpx;
                            .gameno{
                                width: 100%;
                                transform: scale(.88); 
                                word-wrap:break-word;
								margin-bottom: 6rpx;
                            }
                            // transform-origin: 0 0;
                        }
						.amount-red{
							color: #ff0000;
							width: 100rpx;
						}
						.amount-green{
							color: green;
						}
                    }
                }
            }
        }
		
    }
	
</style>
