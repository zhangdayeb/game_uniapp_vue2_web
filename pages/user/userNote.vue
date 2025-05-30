<template>
    <view class="myNote" >
        <view class="search">
            <view class="search-state">
				<view>{{userLocales.date}}：</view>
				<view class="search-list">
					{{defaultStartTime}}
					<u-icon name="arrow-down-fill" size="32" color="#17C4FF" @click="selStart" class="record_arrow_down"></u-icon>
					<u-picker mode="time" :defaultTime="defaultStartTime" v-model="startShow" :params="params"
						end-year="2030" @confirm="confirmStart" confirm-color="#F6AB00" :show-time-tag="true">
					</u-picker>
				</view>
				<view class="zhi">-</view>
				<view class="search-list">
					{{defaultEndTime}}
					<u-icon name="arrow-down-fill" size="32" color="#17C4FF" @click="selEnd" class="record_arrow_down"></u-icon>
					<u-picker mode="time" :defaultTime="defaultEndTime" v-model="endShow" :params="params"
						end-year="2030" @confirm="confirmEnd" confirm-color="#F6AB00" :show-time-tag="true">
					</u-picker>
				</view>
            </view>
        </view>
		<view class="myNote_table">
			<mytable :thList="thList" :tdList="tdList" :userTabPage="userTabPage" @loadMore="handleMore()" @rowClick="handleRow($event)"></mytable>
		</view>
		<!-- 百家乐结果 开始 -->
		<view class="note-result" v-if="showResult && resultInfo.game_type == 3" @click="close()">
			<view class="note-result-panel">
				<view class="note-result-container">
					<view class="note-result-top note-result-blue">
						<view class="note-result-txt">
							<text class="">
								{{liveLocales.player}}
							</text>
							<text class="note-result-tally">
								{{resultInfo.result.xian_point}}
							</text>
						</view>
						<view class="note-result-t-card">
							<image v-if='resultInfo.info.xian[6]' class="note-result-card" :src="`/static/img/poker/${resultInfo.info.xian[6]}`" mode=""></image>
						</view>
					</view>
					<view class="note-result-bottom">
						<view class="">
							<image class="note-result-card" :src="`/static/img/poker/${resultInfo.info.xian[4]}`" mode=""></image>
						</view>
						<view class="">
							<image class="note-result-card" :src="`/static/img/poker/${resultInfo.info.xian[5]}`" mode=""></image>
						</view>
					</view>
				</view>
				<view class="note-result-middle">
					<text class="note-middle-he" v-if="resultInfo.result.zhuang_point == resultInfo.result.xian_point">{{liveLocales.peaceBureau}}</text>
					<text class="note-middle-zhuang" v-if="resultInfo.result.zhuang_point > resultInfo.result.xian_point">{{liveLocales.bankerWin}}</text>
					<text class="note-middle-xian" v-if="resultInfo.result.zhuang_point < resultInfo.result.xian_point">{{liveLocales.playerWin}}</text>
					<!-- <text class="note-middle-zhuang">庄赢</text> -->
					<!-- <text class="note-middle-xian">闲赢</text> -->
				</view>
				<view class="note-result-container">
					<view class="note-result-top note-result-red note-result-end">
						<view class="note-result-t-card">
							<image class="note-result-card" v-if="resultInfo.info.zhuang[1]" :src="`/static/img/poker/${resultInfo.info.zhuang[1]}`" mode=""></image>
						</view>
						<view class="note-result-txt">
							<text class="">
								{{liveLocales.banker}}
							</text>
							<text class="note-result-tally note-result-tally-r">
								{{resultInfo.result.zhuang_point}}
							</text>
						</view>
					</view>
					<view class="note-result-bottom note-result-c-end">
						<view class="">
							<image class="note-result-card" :src="`/static/img/poker/${resultInfo.info.zhuang[3]}`" mode=""></image>
						</view>
						<view class="">
							<image class="note-result-card" :src="`/static/img/poker/${resultInfo.info.zhuang[2]}`" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 百家乐结果 结束 -->
		<!-- 龙虎 结果 开始 -->
		<view class="note-result" v-if="showResult && resultInfo.game_type == 2" @click="close()">
			<view class="note-result-panel">
				<view class="note-result-container">
					<view class="note-result-top note-result-red">
						<view class="note-result-txt">
							<text class="">
								{{liveLocales.dragon}}
							</text>
							<text class="note-result-tally">
								{{resultInfo.result.dragon}}
							</text>
						</view>
					</view>
					<view class="note-result-bottom">
						<view class="" style="margin-left: 1rem;">
							<image class="note-result-card" :src="`/static/img/poker/${resultInfo.result.dragon_png}`" mode=""></image>
						</view>
					</view>
				</view>
				<view class="note-result-middle">
					<text class="note-middle-he" v-if="resultInfo.result.win == 3">{{liveLocales.peaceBureau}}</text>
					<text class="note-middle-zhuang" v-if="resultInfo.result.win == 1">{{liveLocales.dragonWin}}</text>
					<text class="note-middle-xian" v-if="resultInfo.result.win == 2">{{liveLocales.tigerWin}}</text>
				</view>
				<view class="note-result-container">
					<view class="note-result-top note-result-blue note-result-end">
						<view class="note-result-txt">
							<text class="">
								{{liveLocales.tiger}}
							</text>
							<text class="note-result-tally note-result-tally-r">
								{{resultInfo.result.tigger}}
							</text>
						</view>
					</view>
					<view class="note-result-bottom note-result-c-end">
						<view class="" style="margin-right: 1rem;">
							<image class="note-result-card" :src="`/static/img/poker/${resultInfo.result.tigger_png}`" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 龙虎 结果 结束 -->
		
		<!-- 牛牛 结果 开始 -->
		<view class="note-result" v-if="showResult && resultInfo.game_type == 6" @click="close()">
			<view class="note-result-panel" style="display: block; padding: 0rpx; height: 310rpx;">
				<view class="main_pok_top">
					<view class="main_pok_box">
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][0]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][1]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][2]}`"></image>
						</view>
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][3]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][4]}`"></image>
							<view class="main_pok_txt">
								<span>闲1</span>
								<span class="main_pok_res"></span>
							</view>
						</view>
					</view>
					<view class="main_pok_box">
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][0]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][1]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][2]}`"></image>
						</view>
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][3]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][4]}`"></image>
							<view class="main_pok_txt">
								<span>闲2</span>
								<span class="main_pok_res"></span>
							</view>
						</view>
					</view>
					<view class="main_pok_box">
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][0]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][1]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][2]}`"></image>
						</view>
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][3]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][4]}`"></image>
							<view class="main_pok_txt">
								<span>闲3</span>
								<span class="main_pok_res"></span>
							</view>
						</view>
					</view>
				</view>
				<view class="main_pok_bottom" style="margin-bottom: 2rpx;">
					<view class="main_pok_txt">
						<span>庄家</span>
						<span class="main_pok_res"></span>
					</view>
					<view class="main_pok_show" style="height: 100%;">
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][0]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][1]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][2]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][3]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][4]}`"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 牛牛 结果 结束 -->
		
		<!-- 三公 结果 开始 -->
		<view class="note-result" v-if="showResult && resultInfo.game_type == 8" @click="close()">
			<view class="note-result-panel" style="display: block; padding: 0rpx; height: 310rpx;">
				<view class="main_pok_top">
					<view class="main_pok_box">
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][0]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][1]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][2]}`"></image>
						</view>
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][3]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[2][4]}`"></image>
							<view class="main_pok_txt">
								<span>闲1</span>
								<span class="main_pok_res"></span>
							</view>
						</view>
					</view>
					<view class="main_pok_box">
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][0]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][1]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][2]}`"></image>
						</view>
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][3]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[3][4]}`"></image>
							<view class="main_pok_txt">
								<span>闲2</span>
								<span class="main_pok_res"></span>
							</view>
						</view>
					</view>
					<view class="main_pok_box">
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][0]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][1]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][2]}`"></image>
						</view>
						<view class="main_pok_show">
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][3]}`"></image>
							<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[4][4]}`"></image>
							<view class="main_pok_txt">
								<span>闲3</span>
								<span class="main_pok_res"></span>
							</view>
						</view>
					</view>
				</view>
				<view class="main_pok_bottom" style="margin-bottom: 2rpx;">
					<view class="main_pok_txt">
						<span>庄家</span>
						<span class="main_pok_res"></span>
					</view>
					<view class="main_pok_show" style="height: 100%;">
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][0]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][1]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][2]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][3]}`"></image>
						<image class="main_pok_show_img" :src="`/static/img/poker/${resultInfo.result[1][4]}`"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 三公 结果 结束 -->
		
    </view>
</template>

<script>
    import mytable from './myTable.vue'
	import api from "@/api/log"
    export default {
        components: {mytable},
		props: ['date', 'userTabPage'],
        data() {
            return {
                stateIndex: '1',
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
				defaultStartTime: '2019-01-01',
				defaultEndTime: '2030-12-31',
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
                    name: this._i18n.messages[this.$storageLan].user.bettingTime,
					label_width: 160
                }, {
                    name: this._i18n.messages[this.$storageLan].user.amount,                    
                }, {
                    name: this._i18n.messages[this.$storageLan].user.gameName,
                }, {
                    name: this._i18n.messages[this.$storageLan].user.content,
                    label_width: 120
                }, {
                    name: this._i18n.messages[this.$storageLan].user.winLose,
					label_width: 140
                }],
				sel:{},
				tdList: [],
				//分页条件
				pageCondition: {
					//当前页后台字段是这个名字
					page: 1,
					//每页条数
					limit: 50
				},
				//用户双语
				userLocales: this._i18n.messages[this.$storageLan].user, 
				//直播视频页语言
				liveLocales: this._i18n.messages[this.$storageLan].live, 	
				//展示结果
				showResult: false,
				//开牌结果信息
				resultInfo : {}
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
							this.sel.type = 1;
					}
					this.getData()
				}
			}
		},
		mounted() {
			this.sel.type = 1
			this.defaultStartTime = this.setDate('start');
			this.defaultEndTime = this.setDate('end');
			this.getData()
		},
		methods: {
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
				api.bet_list_log(this.sel).then((res) => {
					if (res.data.code == 200) {
						// this.tdList = res.data.data.data
						this.tdList.push.apply(this.tdList, res.data.data.data)
						this.tdList.forEach(el => {
							el.detailArr = el.detail.split('：')
						})
						if(res.data.data.data.length < 1 && this.pageCondition.page > 1) {
							this.pageCondition.page -= 1
						}
					}
				})
			},
			changeStatus(index) {
				this.current = index
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
					//开始时间提前30天      天数 * 24小/天 * 60分钟/时 * 60秒/分 * 1000毫秒/秒
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
			//关闭结果
			close(){
				this.showResult = false
			},
			/**
			 * 处理行点击事件
			 * @param {rowData} 单行数据 
			 * **/
			handleRow(rowData){
				api.getResultGamePoker({id: rowData.lu_zhu_id}).then(res => {
					if(res.data.code == 200){
						this.resultInfo = res.data.data
						this.showResult = true
					}else{
						this.$tip.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
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
	.myNote{
        color: white;
		height: 100%;
    }
	.note-result{
		position: fixed;
		top: 80rpx;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		background: black;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26px;
		font-weight: 800;
		font-family: '隶书';
		width: 100%;
		background-color: rgba(0, 0, 0, .7);
		display: flex;
		text-shadow:1px 1px 0px #b7b7c1, 1px 1px 0px #b7b7c1;
	}
	.note-result-container{
		flex: 1;
	}
	.note-result-middle{
		width: 120rpx;
		font-size: 22px;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.note-result-top{
		align-items: center;
		height: 140rpx;
		position: relative;
		display: flex;
		padding: 0 16rpx;
	}
	.note-result-txt{
		display: flex;
		flex-direction: column;
		width: 50rpx;
		margin-top: 78rpx;
	}
	.note-result-middle text{
		width: 60rpx;
		height: 136rpx;
		font-size: 17px;
		text-align: center;
		display: flex;
		font-weight: 400;
		align-items: center;
		justify-content: center;
		padding-bottom: 8rpx;
		border-radius: 32rpx;
	}
	.note-result-tally{
		margin-top: -10rpx;
		font-size: 20px;
	}
	.note-result-bottom{
		display: flex;
		padding: 0 42rpx;
	}
	.note-result-c-end{
		justify-content: flex-end;
	}
	.note-result-blue{
		color: #2643ff;
	}
	.note-result-red{
		color: #f0262c;
	}
	.note-result-end{
		justify-content: flex-end;
	}
	.note-result-tally-r{
		text-align: right;
	}
	.note-result-t-card{
		padding: 0 42rpx;
	}
	.note-result-t-card image{
		transform: rotate(90deg);
	}
	.note-result-card{
		width: 104rpx;
		height: 140rpx;
		margin: 0 8rpx;
		border-radius: 4rpx;
	}
	.note-middle-he{
		background-color: rgba(19,133,53,1);
	}
	.note-middle-zhuang{
		background-color: rgba(255,0,0,1);
	}
	.note-middle-xian{
		background-color: rgba(38,67,255,1);
	}
	.note-result-panel{
		border: 1px solid #dac193;
		height: 320rpx;
		width: 100%;
		display: flex;
		padding-top: 20rpx;
	}
	.record_arrow_down{
		margin-left: 12rpx;
	}
    .search {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        .search-state {
            display: flex;
            align-items: center;

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
        }

    }
	.myNote_table{
			height: calc(100% - 188rpx)
	}
	// 牛牛开牌结果
	.main_pok_top{
	    width: 100%;
	    height: calc(100% * 0.68);
		overflow: hidden;
		display: flex;
	}
	.main_pok_bottom{
		width: 100%;
		height: calc(100% * 0.3);
		overflow: hidden;
		display: flex;
	}
	.main_pok_box{
		width: 33%;
		height: 100%;
		overflow: hidden;
	}
	.main_pok_show{
		width: 100%;
		height: 48%;
		margin-top: 1%;
		float: left;
		overflow: hidden;
		display: flex;
	}
	.main_pok_show_img{
	    width: 74rpx;
		height: 90rpx;
		margin-left: 4rpx;
		margin-right: 4rpx;
	}
	.main_pok_txt {
	    display: flex;
	    justify-content: center;
	    color: #00BCFC;
	    font-size: 12px;
	    font-weight: bold;
	    font-family: sans-serif , "Helvetica" , "Microsoft Yahei";
	}
	.main_pok_res{
	    margin-left: 2rpx
	}
</style>
