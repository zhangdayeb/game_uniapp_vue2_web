<template>
    <view class="myAccount">
        <view class="formTitle" v-if="pageName != 'problem'">
            {{ title }}
        </view>
        <view class="form-view">
            <view class="formLabel" v-if="pageName == 'baseSet'">
                <view class="formLabelItem">
                    {{userLocales.loginAccount}}:
                </view>
                <view class="formLabelItem">
                    {{userLocales.mobileNumber}}:
                </view>
                <view class="formLabelItem">
                    {{userLocales.password}}:
                </view>
                <view class="formLabelItem">
                    {{userLocales.confirmPassword}}:
                </view>
                <!-- <view class="formLabelItem">
                    {{userLocales.loginURL}}:
                </view> -->
            </view>
            <view class="formLabel" v-if="pageName == 'safety'">
                <view class="formLabelItem">
                    {{userLocales.prove}}:
                </view>
				<view class="formLabelItem">
				    {{userLocales.userName}}:
				</view>
				<view class="formLabelItem">
				    {{userLocales.bankName}}:
				</view>
				<view class="formLabelItem">
				    {{userLocales.bankAddress}}:
				</view>
				<view class="formLabelItem">
				    {{userLocales.bankNumber}}:
				</view>
				
                <!-- <view class="formLabelItem" style="margin-top: 40rpx;">
                    谷歌绑定:
                </view> -->
            </view>
            <view class="informationOut" :style="pageName == 'problem' ? {width: '90%', marginTop: '0'} : {}">
                <u-form :model="baseLoginForm" ref="uForm" v-if="pageName == 'baseSet'">
                    <u-form-item label="" prop="name" >
                        <u-input  v-model="baseLoginForm.user_name" disabled :placeholder="userLocales.placeholderAccount" />
                    </u-form-item>
                    <u-form-item label="" prop="name">
                        <u-input v-model="baseLoginForm.phone" disabled :placeholder="userLocales.placeholderMobile" />
                    </u-form-item>
                    <u-form-item label="" prop="name">
                        <u-input class="form_input" v-model="baseLoginForm.pwd" type="password" :placeholder="userLocales.placeholderPassword"
                            :password-icon="true" />
                    </u-form-item>

                    <u-form-item label="" prop="name">
                        <u-input class="form_input" v-model="baseLoginForm.pwd_copy" type="password" :placeholder="userLocales.placeholderConfirmPassword"
                            :password-icon="true" />
                    </u-form-item>
                    <!-- <view class="formLabelItem" style="color: #ebd093;">
						{{host}}
                    </view> -->
                </u-form>

                <u-form :model="baseLoginForm" ref="uForm" v-if="pageName == 'safety'">
                    <u-form-item label="" prop="name" style="height: 72rpx;">
                        <u-input v-model="baseLoginForm.phone" :placeholder="userLocales.mobileBind" />
                        <view class="bind" @click="updateUserPhone()">{{userLocales.bind}}</view>
                    </u-form-item>
					<u-form-item label="" prop="name" style="height: 72rpx;">
					    <u-input v-model="bankInfo.userName" :placeholder="userLocales.userName" />
					</u-form-item>
					<u-form-item label="" prop="name" style="height: 72rpx;">
					    <u-input v-model="bankInfo.bank" :placeholder="userLocales.bankName" />
					</u-form-item>
					<u-form-item label="" prop="name" style="height: 72rpx;">
					    <u-input v-model="bankInfo.address" :placeholder="userLocales.bankPlaceholderAddress" />
					</u-form-item>
					<u-form-item label="" prop="name" style="height: 72rpx;">
					    <u-input v-model="bankInfo.bankNumber" :placeholder="userLocales.bankPlaceholderNumber" />
					</u-form-item>
					
                   <!-- <u-form-item label="" prop="name" style="height: 94rpx;margin-top: 20rpx;">
                        <u-input v-model="baseLoginForm.name" placeholder="谷歌绑定" />
                        <view class="bind">绑定</view>
                    </u-form-item> -->
                </u-form>
				
				<scroll-view class="myAccount-guid" scroll-y="auto"  scroll-x="auto" v-if="pageName == 'problem'">
					<image class="my-guid-img" src="../../static/img/user/tip.png" mode=""></image>
				</scroll-view>
            </view>
        </view>
		<view class="form-post" v-if="pageName == 'safety'">
			<view class="save-user-form save-user-save" @click="saveBankInfo()"  style="margin-right: 20rpx;">
			    {{userLocales.preserve}}
			</view>
		</view>
        <view class="form-post" v-if="pageName == 'baseSet'">
            <view class="save-user-form save-user-save" @click="updatepwd()"  style="margin-right: 20rpx;">
                {{userLocales.preserve}}
            </view>
			<view class="save-user-form save-user-out" @click="goOut()" >
			    {{userLocales.logOut}}
			</view>
        </view>
    </view>
</template>

<script>
	import api from "@/api/api"
	import configService from '@/common/service/config.service.js'
    export default {
        props: ['page'],
        data() {
            return {
                pageName: 'baseSet',
				title: this.$locales.user.accountTitle,
                baseLoginForm: {},
				//网址
				host: configService.websiteUrl,
				//银行卡信息
				bankInfo: {
					bank: '',
					bankNumber: '',
					userName: '',
					address: ''
				},
				//用户双语
				userLocales: this._i18n.messages[this.$storageLan].user, 
            };
        },
        watch: {
            'page': function(val) {
                if (val) {
                    this.pageName = val
                    if (this.pageName == 'baseSet') {
                        this.title = this.userLocales.accountTitle
                    } else if (this.pageName == 'safety') {
                        this.title = this.userLocales.safetyCertification
                    }

                }
            }
        },
		mounted() {
			//#ifdef APP-PLUS
				this.host = configService.websiteUrl
			//#endif
			//#ifdef H5
				this.host = window.location.host
			//#endif
			this.userinfo();
		},
		methods: {
			// 更新用户手机
			updateUserPhone(){
				let phoneObj =  {};
				phoneObj.phone = this.baseLoginForm.phone
				api.updateUserPhone(phoneObj).then((res) => {
					if (res.data.code == 200) {
						this.$tip.success(res.data.message)
					}else{
						this.$tip.error(res.data.message)
					}
				})
			},
			// 更新 密码
			updatepwd() {
				let pwds =  {};
				pwds.pwd = this.baseLoginForm.pwd
				pwds.pwd_copy = this.baseLoginForm.pwd_copy
				
				if(pwds.pwd  != pwds.pwd_copy){
					this.$tip.error(this.userLocales.differentPwd)
					return;
				}
				
				api.updatePwd(pwds).then((res) => {
					if (res.data.code == 200) {
						this.$tip.success(res.data.message)
						uni.removeStorageSync('login_user_info')
						uni.removeStorageSync('Access-Token')
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}else{
						this.$tip.error(res.data.message)
					}
				})
			},
			// 退出 
			goOut(){
				uni.removeStorageSync('login_user_info')
				uni.removeStorageSync('Access-Token')
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			// 获取用户信息 
			userinfo() {
				api.getUserInfo().then((res) => {
					if (res.data.code == 200) {
						this.baseLoginForm = res.data.data
						if(!this.baseLoginForm.back){
							return
						}
						this.bankInfo.bankNumber = this.baseLoginForm.back.card
						this.bankInfo.bank = this.baseLoginForm.back.name
						this.bankInfo.userName = this.baseLoginForm.back.user_name
						this.bankInfo.address = this.baseLoginForm.back.address
					} else {
						this.$tip.alert(res.data.message);
					}
				})
			},
			/**
			 * 保存银行信息
			 * */
			saveBankInfo(){
				let data = {
					card: this.bankInfo.bankNumber,
					name: this.bankInfo.bank,
					user_name: this.bankInfo.userName,
					address: this.bankInfo.address
				}
				api.saveBankInfo(data).then(res => {
					if(res.data.code == 200) {
						this.$tip.success(this.userLocales.saveBankSuccess)
					}else{
						this.$tip.alert(res.data.message)
					}
				})
			}
		}
    }
</script>

<style lang="scss" scoped>
    .formTitle {
        color: #FFFFFF;
        margin-left: 12rpx;
    }
    .form-view {
        display: flex;

        .formLabelItem {
            height: 72rpx;
            line-height: 72rpx;
            font-size: 28rpx;
            color: #FFFFFF;
        }

        .formLabel {
            margin-left: 60rpx;
            width: 18%;
            padding: 8rpx 0;
            margin-top: 25px;
        }

        .informationOut {
            width: 74%;
            margin: auto;
            border: 1px solid #028FFE;
            border-radius: 8px;
            margin-top: 25px;
            padding: 8rpx 20rpx;

            .u-form-item {
                padding: 0;
            }
        }
    }

    .form-post {
        display: flex;
        justify-content: flex-end;
        margin-top: 40rpx;

        .save-user-form {
            width: 260rpx;
            height: 64rpx;
			line-height: 64rpx;
            border-radius: 32rpx;
			// border: 1px solid #d8bf88;
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
        }
		.save-user-save{
			background-image: url(../../static/img/user/btn.png);
			background-size:100% 100%;
		}
		.save-user-out{
			background-image: url(../../static/img/user/button.png);
			background-size:100% 100%;
		}
    }
	.myAccount-guid{
		height: 690rpx;
		// display: flex;
		.my-guid-img{
			width: 620rpx;
			height: calc(620rpx * 4.24525);
		}
	}
    .bind {
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        border-radius: 40rpx;
        border: 2rpx solid #028FFE;
        color: #028FFE;
    }
	
	.u-input .u-input__input{
		color: white;
	}
</style>
