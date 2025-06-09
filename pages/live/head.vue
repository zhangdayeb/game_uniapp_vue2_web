<template>
    <view class="headbar" style="display: flex;">
		<view class="" style="width: 79%;">
			<view class="headbar-top">
				<view class="back-info">
					<view class="message-box" @tap="goback">
						<u-icon name="arrow-left" size="30" color="#ebd093" style="margin-left: -4rpx;"></u-icon>
					</view>
					<view class="user-name-box">
						<u-icon name="account" color="#bcbcbc" size="28"></u-icon>
						<text class="user-name-text">{{user_info.user_name}}</text>
					</view>
					<view class="user-amount-box">
						<text @click="handleRefresh()" style="color:#bcbcbc">$</text>
						<text class="amount">{{user_info.money_balance}}</text>
						<u-icon :class="{'user-animation': startAnimation}" style="right: 8rpx; position: absolute;"
						name="reload" color="#bcbcbc"  size="36" @tap="refreshUserInfo()"></u-icon>
					 </view>
				</view>
			</view>
			<view class="headbar-bot">
				<view class="tableName">{{table_info.localesTitle}}: {{limitRedDataShow.min}}-{{limitRedDataShow.max}}</view>
				<view class="onNo">{{$locales.live.bureau}}: {{tableRunInfo.bureau_number}}</view>
			</view>
		</view>
		<view class="change-btn" style="width: 20%; display: flex; justify-content: flex-end;">
			<view class="change-bun-container" @click="setShowTabs()">
				<image class="headbar-switch" src="/static/img/live/switch.svg" mode="" ></image>
			</view>
			<view class="change-bun-container" @tap="showSetting = true">
				<image class="headbar-setting" src="/static/img/live/setting.svg" mode=""  style=""></image>
			</view>
		</view>
        <switchTab :showModel="showTabs" @drawClose="handleDrawClose()" ></switchTab>
		<switchTabDiantou :showModel="showTabsDiantou" @drawClose="handleDrawClose()" ></switchTabDiantou>
        <setting :showSetting="showSetting" :tableDataInfo="tableDataInfo" :limitRed="limitRed" :user_info="user_info"  @closeSetting="handelCloseSetting()"></setting>
    </view>
</template>

<script>
	import table from "@/api/table"
    import api from "@/api/api"
	import gameTable from "@/api/game"
    import switchTab from './switchTable.vue'
	import switchTabDiantou from './switchTableDiantou.vue'
    import setting from './settings.vue'
	
    export default {
		props:['tableDataInfo','tableRunInfo','tableType'],
        components: {
            switchTab,
			switchTabDiantou,
            setting
        },
        data() {
            return {
                user_info: {},
                showTabs: false,
				showTabsDiantou:false,
                showSetting: false,
				table_info:{},
				gameTypeList:0,
				game_type_id:0,							// 游戏类型
				startAnimation: false,					// 刷新动画
				limitRed:{},							// 当前游戏类型的默认限红
				limitRedDataShow: {						// 展示限红数据  默认初始化一下，否则有问题
					'max':'',
					'min':''
				},
            };
        },
		watch:{
		},
		onLoad(option) {
			// 游戏展示列表ID 方便后退
			if(option.game_type_id == 3 ) {
				this.gameTypeList = 0
			}
			if(option.game_type_id == 2 ) {
				this.gameTypeList = 1
			}
		},
        mounted() {
			// 刷新 台桌 荷官 ，用户信息
			let routes = getCurrentPages(); 
			let curParam = routes[routes.length - 1].options;		// 获取参数的ID
			this.game_type_id = curParam.game_type_id
			this.getGameTable(curParam.table_id)
			this.gameLimitRedInfo(curParam.game_type_id,curParam.table_id)	// 会循环调用 是否有用户信息 处理限红
        },
        methods: {
			// 后退
            goback() {
				this.$emit('headerBack',{})
                uni.redirectTo({
                    url: '/pages/index/index?pageNo='+this.gameTypeList
                })
            },
			// 获取台桌信息 此处主要是为了 展示那个 荷官信息
			getGameTable(tableId){
				gameTable.gameTableInfo({id:tableId}).then((res) => {
				    if (res.data.code == 200) {
						// console.log('test .table_info',res.data.data)
						this.table_info = res.data.data
						if(this.table_info.table_explain.length == 0) {
							this.table_info.localesTitle = this.table_info.table_title
						}else {
							this.table_info.localesTitle = this.table_info.table_explain[this.$storageLan] 
						}
						console.log("this.table_info:",this.table_info)
				    }
				})
			},
			/**
			 * 获取台桌信息
			 * */
			gameLimitRedInfo(game_type_id,tableId) {
				table.desktopTable({type_id:game_type_id,table_id:tableId}).then((res) => {
					 if (res.data.code == 200) {
						//console.log('test limitRed',res.data.data)
						this.limitRed = res.data.data
						//  获取成功
						this.limitRed.forEach(el => {
							if(el.game_tip_name == '庄' 
							|| el.game_tip_name == '龙' 
							|| el.game_tip_name == '平倍闲1' 
							|| el.game_tip_name == '三公平倍闲1' ){
								this.limitRedDataShow.max = el.xian_hong_max
								this.limitRedDataShow.min = el.xian_hong_min
							}
						})
						// 调用用户函数
						this.userInfos()
					 }
				})
			},
			//点击刷新用户信息
			refreshUserInfo() {
				this.startAnimation = true
				this.userInfos()
				setTimeout(() => {
					this.startAnimation = false
				},1000)
			},
			// 获取用户信息
			userInfos() {
			    api.getUserInfo().then((res) => {
			        if (res.data.code == 200) {
			            this.user_info = res.data.data
						// 判断是否覆盖
						if(this.user_info.is_xian_hong == 1){
							// 百家乐 限红
							if(this.game_type_id == 3){
								this.limitRedDataShow.max = this.user_info.bjl_xian_hong_zhuang_max
								this.limitRedDataShow.min = this.user_info.bjl_xian_hong_zhuang_min
							}
							// 龙虎 限红
							if(this.game_type_id == 2){
								this.limitRedDataShow.max = this.user_info.lh_xian_hong_long_max
								this.limitRedDataShow.min = this.user_info.lh_xian_hong_long_min
							}
							// 牛牛 限红
							if(this.game_type_id == 6){
								this.limitRedDataShow.max = this.user_info.nn_xh_pingbei_max
								this.limitRedDataShow.min = this.user_info.nn_xh_pingbei_min
							}
							// 三公 限红
							if(this.game_type_id == 8){
								this.limitRedDataShow.max = this.user_info.sg_xh_pingbei_max
								this.limitRedDataShow.min = this.user_info.sg_xh_pingbei_min
							}
						}
			        } else {
			            this.$tip.alert(res.data.message);
						uni.removeStorage('account')
						uni.removeStorage('password')
						uni.removeStorage('login_user_info')
						uni.removeStorage('Access-Token')
						uni.removeStorage('user_id')
						uni.removeStorage('token')
						uni.redirectTo({
							url:"/pages/login/login"
						})
			        }
					
			    })
			},
			/**
			 * 设置打开抽屉列表
			 * */
			setShowTabs() {
				if (this.tableType == 'diantou'){
					this.showTabsDiantou = true
				}
				if (this.tableType == 'dianji'){
					this.showTabs = true
				}
			},
			/**
			 * 监听桌子列表关闭
			 * **/
			handleDrawClose() {
				this.showTabsDiantou = false
				this.showTabs = false

			},
			/**
			 * 关闭设置
			 * **/
			handelCloseSetting() {
				this.showSetting = false
			}
        },
    }
</script>

<style lang="scss" scoped>
	.headbar-animation {
		animation: refreshAnimation 1s;
	}
	.user-animation{
		animation: refreshAnimation 1s;
	}
	@keyframes refreshAnimation
	{
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}
    .headbar {
        height: 100rpx;
        background-color: #1d1c21;
		padding-top:var(--status-bar-height);
		
        .headbar-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64rpx;
            line-height: 64rpx;
            padding: 0 8rpx;

            .back-info {
                display: flex;
                align-items: center;

                .message-box {
                    height: 44rpx;
                    width: 44rpx;
                    border-radius: 50%;
                    line-height: 40rpx;
                    margin-right: 20rpx;
                    border: 2rpx solid #ebd093;
                    text-align: center;
                }

                .user-name-box {
                    width: 208rpx;
                    height: 40rpx;
                    border-radius: 20rpx;
                    border: 2rpx solid #666;
                    padding-left: 8rpx;
                    line-height: 40rpx;
                    display: flex;
                    align-items: center;

                    .user-name-text {
                        color: #bcbcbc;
                        font-size: 24rpx;
                        margin-left: 4rpx;
                    }
                }

                .user-amount-box {
                    width: 228rpx;
                    height: 40rpx;
                    margin-left: 12rpx;
                    border-radius: 20rpx;
                    border: 2rpx solid #666;
                    margin-top: 4rpx;
                    padding-left: 8rpx;
                    line-height: 40rpx;
                    display: flex;
                    align-items: center;
					position: relative;

                    .amount {
                        margin-left: 4rpx;
                        margin-right: 20rpx;
                        color: #ebd093;
                        font-size: 24rpx;
                    }
                }

            }

            .change-btn {
                display: flex;
				height: 100%;
                align-items: center;
            }
        }
		.change-bun-container{
			display: flex;
			height: 100%;
			align-items: center;
			justify-content: center;
		}
		.headbar-switch{
			width: 60rpx;
			height: 60rpx;
			margin-right: 14rpx;
		}
		.headbar-setting{
			height: 60rpx;
			width: 60rpx;
		}


        .headbar-bot {
            padding-left: 8rpx;
            color: #FFFFFF;
            display: flex;
			white-space:nowrap;
			word-break: keep-all;

            .tableName {
                font-size: 24rpx;
                transform: scale(.8);
                transform-origin: 0 0;
            }

            .limit {
                transform: scale(.8);
                transform-origin: 0 0;
            }

            .onNo {
                transform: scale(.8);
                transform-origin: 0 0;
            }
        }

    }
</style>