<template>
    <view class="user-header" >
        <view class="user-box">
            <view class="user-img-box">
                <view class="user-img" @click="goMember()">
					<image class="user-head-photo" :src="image" mode=""></image>
					<!-- <u-lazy-load class="user-head-photo" width="100%" height="100%" :image="image" :loading-img="loadingImg" :error-img="errorImg"></u-lazy-load> -->
                </view>
            </view>
            <view class="user-info">
                <view class="user-name-box">
                    <u-icon name="account" color="#bcbcbc" size="28"></u-icon>
                    <text class="user-name-text">{{user_info.user_name}}</text>
                </view>
                <view class="user-amount-box" style="position: relative;">
                    <!-- <u-icon name="rmb-circle-fill" color="#ebd093" size="28"></u-icon> -->
					<text class="amount">$</text>
                    <text class="amount">{{user_info.money_balance}}</text>
                    <u-icon class="zhuan" :class="{'user-animation': startAnimation}" style="right: 8rpx; position: absolute;" 
					name="reload" color="#bcbcbc"  size="36" @tap="userInfos()"></u-icon>
                </view>
            </view>
        </view>
        <view class="logo-box">
			<u-lazy-load width="100%" height="100%" :image="imageLogo" :loading-img="loadingImgLogo" :error-img="errorImgLogo"></u-lazy-load>
        </view>
    </view>
</template>

<script>
	import user from "@/api/api"
    export default {
        components: {
        },
        data() {
            return {
				// 懒加载 开始
				image:'',
				loadingImg:'/static/img/user/header.png',
				errorImg:'/static/img/user/header.png',
				imageLogo:'/static/img/login/yb12.png',
				loadingImgLogo:'/static/img/login/yb12.png',
				errorImgLogo:'/static/img/login/yb12.png',
				// 懒加载 结束
                current: 5,
                showRecord: false,
				user_name:'',
				user_money:'',
				//用户信息
				user_info: {},
				//刷新动画
				startAnimation: false
            };
        },
        mounted() {
			this.userInfos()
        },
        methods: {
			userInfos() {
				this.startAnimation = true
			    user.getUserInfo().then((res) => {
			        if (res.data.code == 200) {
			            this.user_info = res.data.data
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
						uni.removeStorage('account')
						uni.removeStorage('password')
						uni.removeStorage('login_user_info')
						uni.removeStorage('Access-Token')
						uni.redirectTo({
							url:"/pages/login/login"
						})
			        }
					setTimeout(() => {
						this.startAnimation = false
					},1000)
			    })
			},
			userinfo(){
				let user_info = uni.getStorageSync('login_user_info');
				this.user_name = 	user_info.user_name;
				this.user_money= 	user_info.money_balance;
			},
            // 组件跳转
            setPage(pageName) {
                this.pageName = pageName
            },
            // 加载组件的相关事件
            close: function() {
                this.$refs.loading.close();
            },
            open: function() {
				
                this.$refs.loading.open();
            },
            callback() {
                console.log("关闭后回掉");
            },
			goMember(){
				uni.redirectTo({
					url:'/pages/user/user'
				})
			},
			// app 中增加class
			addClass(){
				//#ifdef APP-PLUS
				// return "user-header_app"
				//#endif
			}
        }
    }
</script>

<style lang="scss" scoped>
	.u-wrap{
		background: none;
	}
	.user-animation{
		animation: refreshAnimation 1s;
	}
	@keyframes refreshAnimation
	{
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}
	.zhuan:hover{
		// transform: rotate(90deg);
	}
	// .user-header_app{
	// 	height: 176rpx;
	// 	padding-top:calc(var(--status-bar-height) + 40rpx);
	// }
    .user-header {
		// position: fixed;
		top: 0rpx;
		z-index: 1000;
        width: 100%;
        height: 136rpx;
        padding: 20rpx 20rpx 16rpx 16rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
		background-color: #1D1C22;
		overflow: hidden;
		.user-head-photo{
			border-radius: 50%;
			height: 100%;
		    width: 100%;
		}
        .user-box {
            height: 100%;
            display: flex;
            align-items: center;
    
            .user-img-box {
                width: 90rpx;
                height: 90rpx;
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
                margin-left: 48rpx;
    
                .user-name-box {
                    width: 236rpx;
                    height: 40rpx;
                    border-radius: 20rpx;
                    border: 2rpx solid #666;
                    padding-left: 8rpx;
					display: flex;
					align-items: center;
    
                    .user-name-text {
                        color: #bcbcbc;
                        font-size: 24rpx;
                        margin-left: 20rpx;
                    }
                }
    
                .user-amount-box {
                    width: 236rpx;
                    height: 40rpx;
                    border-radius: 20rpx;
                    border: 2rpx solid #666;
                    margin-top: 4rpx;
                    padding-left: 8rpx;
                    line-height: 40rpx;
                    display: flex;
                    align-items: center;
    
                    .amount {
                        margin-left: 20rpx;
                        margin-right: 20rpx;
                        color: #ebd093;
                        font-size: 24rpx;
                    }
                }
            }
        }
    
        .logo-box {
            width: 88rpx;
            height: 88rpx;
        }
    }
    
    
</style>
