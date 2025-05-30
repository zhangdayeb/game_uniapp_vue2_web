<template>
    <view class="myWallet">
		<view class="search">
			<view class="search-label">{{userLocales.date}}：</view>
			<view class="search-list">
				{{defaultStartTime}}
				<u-icon name="arrow-down-fill" size="32" color="#17C4FF" @click="selStart" class="record_arrow_down"></u-icon>
				<u-picker mode="time" :defaultTime="defaultStartTime" v-model="startShow" :params="params"
					end-year="2030" @confirm="confirmStart" confirm-color="#F6AB00" :show-time-tag="true">
				</u-picker>
			</view>
			<view class="zhi"> - </view>
			<view class="search-list">
				{{defaultEndTime}}
				<u-icon name="arrow-down-fill" size="32" color="#17C4FF" @click="selEnd" class="record_arrow_down"></u-icon>
				<u-picker mode="time" :defaultTime="defaultEndTime" v-model="endShow" :params="params"
					end-year="2030" @confirm="confirmEnd" confirm-color="#F6AB00" :show-time-tag="true"></u-picker>
			</view>
		</view>
        <view class="search">
            <view class="search-state">
                <view class="search-label">
                    {{userLocales.state}}：
                </view>
                <view class="search-list">
                    <u-dropdown border-radius="0" :border-bottom="false" active-color="#ebd093" inactive-color="#ffffff" >
                        <u-dropdown-item v-model="stateIndex" @change="changeStatus"
                            :title="stateList.filter(el=> stateIndex == el.value)[0].label" :options="stateList">
                        </u-dropdown-item>
                    </u-dropdown>
                </view>
            </view>
        </view>
		<view class="myWallet_table" >
			<mytable :thList="thList" :tdList="tdList" :userTabPage="userTabPage" @loadMore="handleMore()" ></mytable>
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
                stateList: [
					{
						label: this._i18n.messages[this.$storageLan].user.all,
						value: 1,
					}, 
					{
					    label: this._i18n.messages[this.$storageLan].user.recharge,
					    value: 101,
					}, {
					    label: this._i18n.messages[this.$storageLan].user.withdrawal,
					    value: 102,
					}					
				],

                startShow: false,
                endShow: false,
                defaultStartTime: '2019-01-01',
                defaultEndTime: '2030-12-31',
                defaultSelector: [0],
				sel:{
				},
				tdList: [],
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
					label_width: 180
                }, 
				{
                    name: this._i18n.messages[this.$storageLan].user.amount,
					label_width: 180
                }, {
                    name: this._i18n.messages[this.$storageLan].user.content,
					label_width: 60
                }, {
                    name: this._i18n.messages[this.$storageLan].user.remain,
                    label_width: 240
                } ],
				//分页条件
				pageCondition: {
					//当前页后台字段是这个名字
					page: 1,
					//每页条数
					limit: 50
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
					this.sel.start = ''
					this.sel.end = ''
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
        onLoad() {
            // this.defaultStartTime = this.getDate();
            // this.defaultEndTime = this.getDate();
			
        },
		mounted() {
			this.sel.type = 1
			this.defaultStartTime = this.setDate('start');
			this.defaultEndTime = this.setDate('end');
			this.getData()
		},
        methods: {
            changeStatus(index) {
				if(index ==1){
					index =0;
				}
				//选择的时候清空时间
				this.sel.end = '';
				this.sel.start = '';
				this.sel.status = index;
				this.pageCondition.page = 1
				this.tdList = []
				this.getData()
            },
			/**
			 * 加载更多
			 * **/
			handleMore() {
				this.pageCondition.page ++ 
				this.getData()
			},
			getData() {
				
				this.sel.page = this.pageCondition.page
				this.sel.limit = this.pageCondition.limit
				api.money_out_log(this.sel).then((res) => {
					if (res.data.code == 200) {
						// this.tdList  = res.data.data.data
						this.tdList.push.apply(this.tdList, res.data.data.data)
						if(res.data.data.data.length < 1 && this.pageCondition.page > 1) {
							this.pageCondition.page -= 1
						}
					}
				})
			},
            /**
             * 设置时间
             * @param {type} start开始时间 end结束时间 
             * **/
            setDate(type) {
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
            confirmStart(e) {
                this.$emit('dateChange',{})
                this.sel.type = 0
                // this.defaultStartTime = e.hour + ':' + e.minute + ':' + e.second;
                this.defaultStartTime = `${e.year}-${e.month}-${e.day}`
                this.sel.start = this.defaultStartTime;
				this.sel.end = this.defaultEndTime;
                this.tdList = []
                this.pageCondition.page = 1
				this.getData()
            },
            confirmEnd(e) {
                this.$emit('dateChange',{})
				this.sel.type = 0
				// this.defaultEndTime = e.hour + ':' + e.minute + ':' + e.second;
				this.defaultEndTime = `${e.year}-${e.month}-${e.day}`
				this.sel.start = this.defaultStartTime;
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
	.record_arrow_down{
		margin-left: 12rpx;
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
	        height: 200rpx !important;
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
	.myWallet_table{
		height: calc(100% - 258rpx)
	}
</style>
