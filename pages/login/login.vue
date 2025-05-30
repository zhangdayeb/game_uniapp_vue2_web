<template>
	<view class="login" id="login" ref="loginRef">
		<view class="login-language" >
			<view class="" v-if="needLanguage">
				<view class="login-choice-flag" id="login-selected"  @click="showLocales()">
					<view class="login-flag" :class="selectedLocal.className"></view>
					<text>{{selectedLocal.title}}</text>
				</view>
				<view class="login-locales" id="login-locales" v-if="openLocalesPanel">
					<view class="login-choice-flag " @click="setLanguage(item)" v-for="(item, index) in languageData" :key="index">
						<view class="login-flag" :class="item.className"></view>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="login-section">
			<view class="login-log">
				<view class="login-sun">
					<image style="width: 280rpx; height: 280rpx;" src="/static/img/login/logo.png" ></image>
				</view>
				<view class="login-sun">
					<image src="/static/img/login/logo_2.png" ></image>
				</view>
				<view class="login-text">
					<view class="login-log-text">
						<!-- {{loginLocales.groupName}} -->
					</view>
					<view class="">
						<!-- GOLDEN HORSE CASINO -->
					</view>
					<!-- <image :src="logInfo.value" ></image> -->
				</view>
			</view>
			
			<view class="login-panel" >
				<view class="" v-if="showType=='register'">
					<view class="login-row">
						<view class="login-in login-account" >
							<input class="login-box" v-model="registerData.userName" type="text"  value="" :placeholder="loginLocales.userAccount" />
						</view>
					</view>
					<view class="login-row">
						<view class="login-in login-password" >
							<input class="login-box" :password="!registerPwsswordShow.firstPasswordShow" type="text" v-model="registerData.password" value="" :placeholder="loginLocales.inputPassword" />
							<image class="login-show-pwd" src="../../static/img/login/eye.svg" @click="handleRegisterPwsswordShwo('firstPasswordShow',true)" v-if="!registerPwsswordShow.firstPasswordShow"></image>
							<image class="login-show-pwd" src="../../static/img/login/shutEye.svg" mode="" @click="handleRegisterPwsswordShwo('firstPasswordShow',false)" v-if="registerPwsswordShow.firstPasswordShow"></image>
						</view>
					</view>
					<view class="login-row">
						<view class="login-in login-password" >
							<input class="login-box" :password="!registerPwsswordShow.confirmPasswordShow" type="text" v-model="registerData.confirmPassword" value="" :placeholder="loginLocales.confirmPassword" />
							<image class="login-show-pwd" src="../../static/img/login/eye.svg" @click="handleRegisterPwsswordShwo('confirmPasswordShow',true)" v-if="!registerPwsswordShow.confirmPasswordShow" ></image>
							<image class="login-show-pwd" src="../../static/img/login/shutEye.svg" @click="handleRegisterPwsswordShwo('confirmPasswordShow',false)"  v-if="registerPwsswordShow.confirmPasswordShow"></image>
						</view>
					</view>
					<view class="login-row">
						<view class="login-in" >
							<view class="login-mobile-bg">
							</view>
							<input class="login-box " v-model="registerData.mobile" type="text"  value="" :placeholder="loginLocales.mobile" />
							<text class="login-send" @click="showMobileLocales=true">{{selectedMobile.country}}</text>
							<view class="login-locales-mobile" v-if="showMobileLocales">
								<view class="" v-for="item in mobileLocales" :key="item.num"  @click="handleLocalesMobile(item)">
									{{item.country}}
								</view>
							</view>
						</view>
					</view>
					<view class="login-row">
						<view class="login-in login-account" >
							<view class="login-mobile-bg login-mobile-security">
							</view>
							<input class="login-box login-mobile" v-model="registerData.code" type="text"  value="" :placeholder="loginLocales.verificationCode" />
							<text class="login-send" @click="getLoginCaptcha()" v-if="sendCodeTime < 1">{{loginLocales.sendCode}}</text>
							<text class="login-send" v-if="sendCodeTime > 0">{{sendCodeTime}}s</text>
						</view>
					</view>
					<view class="login-row">
						<view class="login-in login-account" >
							<view class="login-mobile-bg login-mobile-recommend">
							</view>
							<input class="login-box" v-model="registerData.recommendId" type="text"  value="" :placeholder="loginLocales.referenceId" />
						</view>
					</view>
					<view class="login-row login-btns">
						<view class="login-btn login-login"  @click="switchType('login')">
							{{loginLocales.goLogin}}
						</view>
						<view class="login-btn login-trial" @click="loginTest()">
							{{loginLocales.visitorTry}}
						</view>
					</view>
				</view>
				
				<view class="" v-if="showType=='login'">
					<view class="login-row">
						<view class="login-in-box">
							<image class="login-in-img" src="../../static/img/login/user.svg" mode=""></image>
							<input class="login-box" v-model="loginform.phone" type="text" @input="cancelPwd()" value="" :placeholder="loginLocales.inputAccount" />
						</view>
						<!-- <view class="login-in login-account" >
							<input class="login-box" v-model="loginform.phone" type="text" @input="cancelPwd()" value="" :placeholder="loginLocales.inputAccount" />
						</view> -->
					</view>
					<view class="login-row">
						<view class="login-in-box">
							<image class="login-in-img" src="../../static/img/login/mima.svg" mode=""></image>
							<input class="login-box" :value="pwd_show" type="text" @input="handleInput($event)"
							 :placeholder="loginLocales.inputPassword" />
						</view>
						<!-- <view class="login-in login-password " >
							<input class="login-box" :value="pwd_show" type="text" @input="handleInput($event)"
							 :placeholder="loginLocales.inputPassword" />
							<image class="login-show-pwd" src="../../static/img/login/eye.svg" mode="" @click="openShowPwd()" v-if="!showPwd"></image>
							<image class="login-show-pwd" src="../../static/img/login/shutEye.svg" mode="" @click="closeShowPwd()" v-if="showPwd"></image>
						</view> -->
					</view>
					<view class="login-row login-btns">
						<view class="login-btn" :class="{'login-btn-width': availableRegisterData.value=='0'}" @click="loginFun()">
							{{loginLocales.login}}
						</view>
						<view class="login-btn" :class="{'login-btn-width': availableRegisterData.value=='0'}" @click="loginTest()">
							{{loginLocales.visitorTry}}
						</view>
					</view>
				</view>
				
				
				<!--#ifdef H5-->
					<!-- <view class="login-row" style="display: flex;">
						<view class="login-video" @click="download()">
							<view class="login-live" >
								{{loginLocales.download}}
							</view>
						</view>
						<view class="login-save" @click="openGuidance(true)">
							<view class="login-save-txt" >
								{{loginLocales.save1}}<br />{{loginLocales.save2}}
							</view>
						</view>
					</view> -->
				<!--#endif --> 
			</view>
<!-- 			<view class="login-sun" style="margin-top: 180rpx;">
				<image style="width: 380rpx; height: 380rpx;" src="/static/img/login/logo.gif" ></image>
			</view> -->
			<!-- <view class="login-panel login-maintain-panel" v-if="maintainData.web_maintain_status == WEB_MAINTAIN">
				<view class="login-maintain-title">
				</view>
				<view class="maintain-content">
					{{maintainData.content}}
				</view>
			</view> -->
		</view>
		
		
		<guidance :show="showGuidance" @close="showGuidance = false"></guidance>
	</view>
</template>

<script>
	import {mapActions} from "vuex"
	import Vue from 'vue'
	import api from "@/api/api"
	import gameApi from '@/api/game'
	import guidance from './guidance.vue'
	import md5 from "@/common/util/md5.js";
	
	import configService from '@/common/service/config.service.js';
	import customerService from '@/api/customer.js'
	export default {
		components:{
			guidance
		},
		data() {
			return {
				//登录信息
				loginform: {
					phone: '',
					pwd: ''
				},
				//展示的密码
				pwd_show: '',
				pwd_send:'',
				pwd_hide:'',
				pwd_number:0,
				//密码输入之前的内容
				pwd_before: '',
				//是否显示密码
				showPwd: false,
				//log
				logInfo:{},
				//是否打开语言选择板
				openLocalesPanel: false,
				//登录页语言
				loginLocales: this._i18n.messages[this.$storageLan].login,
				//语言数据
				languageData: [
					{
					className: 'login-flag-zh',
					title: '简体中文',
					type: 'zh',
					serviceValue: 'zh-cn'
					},
					{
						className: 'login-flag-en',
						title: 'English',
						type: 'en',
						serviceValue: 'en-us'
					},{
						className: 'login-flag-jp',
						title: '日本語',
						type: 'jpn',
						serviceValue: 'jpn'
					},{
						className: 'login-flag-kor',
						title: '한글',
						type: 'kor',
						serviceValue: 'kor'
					},{
						className: 'login-flag-tha',
						title: 'ภาษาไทย',
						type: 'tha',
						serviceValue: 'tha'
					},{
						className: 'login-flag-vnm',
						title: 'ViệtName',
						type: 'vnm',
						serviceValue: 'vnm'
				}],
				//国家电话段
				mobileLocales: [{
					country: this._i18n.messages[this.$storageLan].login.China,
					num: '86'
				},{
					country: this._i18n.messages[this.$storageLan].login.Thailand,
					num: '66'
				},{
					country: this._i18n.messages[this.$storageLan].login.Vietnam,
					num: '84'
				},{
					country: this._i18n.messages[this.$storageLan].login.Korea,
					num: '82'
				},{
					country: this._i18n.messages[this.$storageLan].login.Japan,
					num: '81'
				},{
					country: this._i18n.messages[this.$storageLan].login.Philippines,
					num: '63'
				},{
					country: this._i18n.messages[this.$storageLan].login.Cambodia,
					num: '855'
				}],
				//选择的语言
				selectedLocal: {
					// className: 'login-flag-zh',
					// title: '简体中文',
					// type: 'zh',
					// serviceValue: 'zh-cn'
				},
				// 下载地址
				appDownUrl:'',
				//维护信息数据 
				maintainData: {},
				//是否需要多语言 true: 需要 , false: 不需要
				needLanguage: true,
				//展示添加到桌面指导页
				showGuidance: false,
				//客服地址
				whatsAppUrl :  {},
				//登录 注册显示
				showType: 'login',
				//显示地区代码
				showMobileLocales: false,
				//选择的国家电话
				selectedMobile: {
					country: this._i18n.messages[this.$storageLan].login.Cambodia,
					num: '855'
				},
				//注册是否可用
				availableRegisterData: {},
				// 注册表单
				registerData: {
					userName: '',
					password: '',
					confirmPassword: '',
					mobile: '',
					code: '',
					recommendId: '',
				},
				//注册密码的展示隐藏
				registerPwsswordShow: {
					firstPasswordShow: false,
					confirmPasswordShow: false,
				},
				//60秒后发送
				sendCodeTime: 0,
			}
		},
		onLoad(option) {
			if(option.type) {
				this.showType = option.type
			}
			if(option.recommender) {
				this.registerData.recommendId = option.recommender
			}
			// console.log(uni.getStorageInfoSync())
			this.clearAllStorage()
			// uni.clearStorageSync()
		},
		mounted() {
			this.getConfigRegister()
			this.getNoticeList()
			//#ifdef H5
				this.setLoginLocales()
			//#endif
			this.getAppDownUrl()
			this.getCustomerService()
		},
		onShow() {
			this.getNoticeList()
			this.clearAllStorage()
			
			uni.setStorageSync('language',this.$storageLan)
			this.languageData.forEach(el => {
				if(el.type == this.$storageLan) {
					this.selectedLocal = el
				}
			})
			if(!this.needLanguage){
				this.selectedLocal = this.languageData[0]
				Vue.prototype.$storageLan = this.selectedLocal.type;
				this.loginLocales = this._i18n.messages[this.$storageLan].login,
				uni.setStorageSync('language',this.selectedLocal.type)
			}
			
		},
		onUnload() {
			this.clearAllStorage()
		},
		destroyed() {
			this.clearAllStorage()
		},
		methods: {
			...mapActions(["mLogin"]),
			/**
			 * 设置注册密码展示隐藏
			 * @param {key} 键 
			 * @param {b} true false 
			 * **/
			handleRegisterPwsswordShwo(key, b) {
				this.registerPwsswordShow[key] = b
			},
			/**
			 * 获取是否展示注册
			 * */
			getConfigRegister() {
				api.getConfig({name: "app_register"}).then(res => {
					if(res.data.code == 200) {
						this.availableRegisterData = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			},
			/**
			 * 获取验证码
			 * **/
			getLoginCaptcha() {
				let time = new Date().getTime().toString()
				let str = 'tyh'+ time
				str = (md5.hex_md5(str))
				gameApi.getLoginCaptcha({phone: this.registerData.mobile, 
				area_code: this.selectedMobile.num, 
				lang: this.selectedLocal.serviceValue,
				sign: str, timestamp: time}).then(res => {
					if (res.data.code == 200) {
						this.sendCodeTime = 60
						this.handleCodeTime()
						// this.registerData.code = res.data.data.captcha
					}
					this.$tip.alert(res.data.message)
				}).catch(err => {
					console.log(err)
				})
			},
			
			/**
			 * 处理倒计时
			 * */
			handleCodeTime() {
				if(this.sendCodeTime <= 0) {
					return
				}
				this.sendCodeTime -- 
				setTimeout(() => {
					this.handleCodeTime()
				},1000)
			},
			/**
			 * 注册
			 * **/
			handleRegister() {
				let data = {
					user_name: this.registerData.userName,
					phone: this.registerData.mobile,
					pwd: this.registerData.password,
					password: this.registerData.confirmPassword,
					captcha: this.registerData.code,
					codes: this.registerData.recommendId,
					area_code: this.selectedMobile.num,
					lang: this.selectedLocal.serviceValue
				}
				gameApi.loginRegister(data).then(res => {
					if (res.data.code == 200) {
						this.$tip.success(this.loginLocales.successRegister)
						this.switchType('login')
					} else {
						this.$tip.alert(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			/**
			 * 登录 注册切换
			 * @param {type} type 字符串 registe login
			 * **/
			switchType(type) {
				this.showType = type
				for(let k in this.registerData){
					this.registerData[k] = ''
				} 
			},
			/**
			 * 获取整站通知
			 * */
			getNoticeList(){
				this.$maintainState.getNoticeList().then(res => {
					//1 维护中
					let WEB_MAINTAIN = '1';
					this.maintainData = res
					if(this.maintainData.web_maintain_status == this.$WEB_MAINTAIN_STATE){
						uni.navigateTo({
							url: '/pages/maintain/maintain'
						})
					}
				})
			},
			
			/**
			 * 清除所有存储
			 */
			clearAllStorage(){
				let storage = uni.getStorageInfoSync()
				storage.keys.forEach(key => {
					if(!key.includes('storage_flag')) {
						uni.removeStorageSync(key)
					}
				})
			},
			/**
			 * 监听语言面板显示
			 * */
			setLoginLocales() {
				let dom = document.getElementById("login")
				dom.addEventListener('click',(e)=>{
					if(e.stopPropagation){
						e.stopPropagation();
					}
					let ev = e || window.event; //浏览器兼容性
					let elem = ev.target || ev.srcElement;
				   
					let b = false
					while (elem) { //循环判断至跟节点，防止点击的是div子元素
						if (elem.id && elem.id==='login-selected'||elem.id==='login-locales') {
							b =true
							return;
						}
						elem = elem.parentNode;
						if(elem&&elem.id && elem.id==='login-locales'){
							b = true
							  return
						}
					}
					if(!b){
						this.openLocalesPanel = false
					}
				})
			},
			
			/**
			 * 登录框输入的时候 取消密码
			 * 
			 */
			cancelPwd(){
				this.pwd_show = ''
				this.loginform.pwd = ''
			},
			
			/**
			 * 选择国家电话代码
			 * @param {item} 国家属性 
			 * **/
			handleLocalesMobile(item) {
				this.selectedMobile = item
				this.showMobileLocales =  false
			},
			/**
			 * 登录
			 * */
			loginFun() {
				this.loginform.pwd = this.pwd_send
				this.loginform.lang = this.selectedLocal.serviceValue
				this.mLogin(this.loginform).then((res) => {
					if (res.data.code == 200) {
						this.$tip.success(this.loginLocales.success)
						this.languageUpdate()
					} else {
						this.$tip.alert(res.data.message)
					}
				}).catch((err) => {
					this.$tip.alert('请求出现错误，请稍后再试');
				}).finally(() => {
				})
			},
			
			/**
			 * 设置语言
			 * **/
			languageUpdate() {
				api.languageUpdate({lang: this.selectedLocal.serviceValue}).then(res => {
					uni.navigateTo({
						url: '/pages/index/index'
					})
				}).catch(err => {
					console.log(err)
				})
			},
			
		
			/**
			 * 获取whatsApp地址
			 * **/
			getCustomerService() {
				api.getUserWhat({}).then(res => {
					if(res.data.code == 200) {
						this.whatsAppUrl = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			},
			
			/**
			 * 打开选择语言
			 * */
			showLocales() {
				this.openLocalesPanel = !this.openLocalesPanel
			},
			
			/**
			 * 获取logo
			 * **/
			getAppDownUrl() {
				customerService.getService({name: 'app_down_android'}).then(res => {
					if(res.data.code == 200) {
						//#ifdef APP-PLUS
							this.appDownUrl = ''
						//#endif
						//#ifdef H5
							this.appDownUrl = res.data.data.value
						//#endif
						
					}
				}).catch(err => {
					console.log(err)
				})
			},
			
			/**
			 * 设置语言
			 * @param {item} 选择的语言对象
			 * **/
			setLanguage(item) {
				uni.setStorageSync('language',item.type)
				this.selectedLocal = item
				this.loginLocales = this._i18n.messages[item.type].login
				this.openLocalesPanel = false
				Vue.prototype.$storageLan = item.type;
			},
			
			/**
			 * 试玩
			 * */
			loginTest() {
				api.loginTest({lang: this.selectedLocal.serviceValue}).then((res) => {
					if (res.data.code == 200) {
						uni.setStorageSync('login_user_info', res.data.data)
						uni.setStorageSync('Access-Token', res.data.data.token)
						this.languageUpdate()
					} else {
						this.$tip.alert(res.data);
					}
				})
			},
			openShowPwd(){
				this.showPwd = true
				this.pwd_show = this.pwd_send
			},
			closeShowPwd(){
				this.showPwd = false
				this.pwd_show = this.pwd_hide
			},
			/**
			 * 监听输入
			 * */
			handleInput(e){
				let miMa = e.target.value
				//*号密码
				let starPwd = miMa.substr(0, this.pwd_before.length)
				this.pwd_before = miMa.replace(starPwd,this.pwd_before)
				this.pwd_send = this.pwd_before
				// let lastPostion = miMa.length * 1 -1
				let pwd_number_now = miMa.length
				
				// // 第一步：隐藏特效
				if(this.pwd_number > pwd_number_now){
					// 缩减了
					this.pwd_send = this.pwd_send.substr(0,pwd_number_now)
					this.pwd_before = this.pwd_send
				}else{
					let pwd = this.pwd_before.substr(0 , this.pwd_before.length)
					this.pwd_before = pwd 
					// 增加了
					this.pwd_send = this.pwd_before
					
				}
				let arrStr = this.pwd_before.split("")
				//替换的*号密码
				let replaceWord = ''
				for(let i=0; i < arrStr.length; i++) {
					arrStr[i] = "*" 
				}
				replaceWord = arrStr.join("").replace(',','')
				//如果是明文
				if(this.showPwd) {
					this.pwd_show = this.pwd_send
				}else{
					this.pwd_show = replaceWord
				}
				this.pwd_hide = replaceWord
				this.pwd_number = pwd_number_now
			},
			// 显示文字
			showPwdText(showZuHeWenZi){
				this.pwd_show = showZuHeWenZi
			},
			// 文字重复
			repeat(target, n) {
				return (new Array(n + 1)).join(target);
			},
			/**
			 * 获取客服
			 * **/
			toCustomerService() {
				api.loginTest().then((res) => {
					if (res.data.code == 200) {
						uni.setStorageSync('login_user_info', res.data.data)
						uni.setStorageSync('Access-Token', res.data.data.token)
						uni.navigateTo({
							url: '/pages/service/service'
						})
					} else {
						this.$tip.alert(res.data);
					}
				})
			},
			
			/**
			 * 跳转客服
			 * */
			toService(url) {
				//#ifdef H5
				window.open(url, '_blank')
				//#endif
			},
			
			/**
			 * 下载
			 * */
			download() {
				//#ifdef H5
					window.location.href = this.appDownUrl
				//#endif
			},
			/**
			 * 打开指导页
			 * @param {b} true false true: 展示 
			 * **/
			openGuidance(b) {
				this.showGuidance = b
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		overflow: hidden; 
	}
	.login-section{
		position: absolute;
		height: calc(100% - 66rpx - 60rpx);
		width: 100%;
		top: 45%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.login-service-whatsapp{
		width: 102rpx;
	}
	
	.login-service-whatsapp image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
	.login{
		height: 100%;
		position: relative;
		padding-top:var(--status-bar-height);
		.login-language{
			height: 66rpx;
			position: relative;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			z-index: 99;
		}
		.login-in-box{
			display: flex;
			height: 80rpx;
			margin: 30rpx auto;
			border: 1px solid #c2c5d6;
			background-color: #283854;
			border-radius: 40rpx;
		}
		.login-in-img{
			width: 50rpx;
			height: auto;
			margin-left: 20rpx;
		}
		.login-choice-flag{
			width: 230rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 44rpx;
			color: white;
		}
		.login-flag{
			width: 32rpx;
			height: 22rpx;
			margin-right: 10rpx;
			background: url('/static/img/language/flags.png') no-repeat;
		}
		.login-flag-zh {
			background-position: -208px -22px;
		}
		.login-flag-en{
			background-position: -144px -154px
		}
		.login-flag-jp{
			background-position: -15px -77px;
		}
		.login-flag-kor{
			background-position: -144px -77px;
		}
		.login-flag-tha{
			background-position: -224px -118px;
		}
		.login-flag-vnm{
			background-position: -16px -165px;
		}
		.login-language{
			height: 66rpx;
			position: relative;
			display: flex;
			justify-content: flex-end;
			align-items: center
		}
		.login-locales{
			position: absolute;
			border: 1px solid #c3ad86;
			padding-left: 10rpx;
			border-radius: 10rpx;
			right: 0;
			top: 68rpx;
			display: flex;
			flex-direction: column;
			z-index: 999;
		}
		.login-log{
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			
		}
		.login-sun{
			text-align: center;
			image{
				width: 320rpx;
				height: 176rpx;
			}
		}
		.login-text{
			overflow: hidden;
			text-align: center;
			font-size: 16px;
			font-weight: 600;
			color: #bcaf95;
			image{
				width: 400rpx;
				height: 120rpx;
			}
		}
		.login-log-text{
			font-size: 37px;
			font-family: KaiTi;
		}
		.login-panel{
			width: 560rpx;
			margin: 0 auto;
			z-index: 99;
			max-height: calc(100% - 294rpx);
			overflow-y: auto;
			// border: 1px solid red;
			// max-height: 800rpx;
			// overflow-y: auto;
			// left: 50%;
			// transform: translateX(-50%);
			// position: absolute;
		}
		.login-maintain-panel{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #d3d4d3;
			border: 2rpx solid #72654d;
			border-radius: 20rpx;
			padding: 30rpx;
			margin-top: 30rpx;
		}
		.login-in{
			height: 98rpx;
			background: url('/static/img/login/mark.png') no-repeat;
			position: relative;
			background-size: 1720rpx;
		}
		.login-box{
			height: 100%;
			padding-left: 20rpx;
			width: 446rpx;
			color: white;
		}
		.login-mobile{
			width: 292rpx;
			// border: 1px solid red;
		}
		.login-mobile-bg{
			width: 88rpx;
			height: 90rpx;
			position: absolute;
			left: 4rpx;
			top: 2rpx;
			background-color: RGB(43,62,95);
			background-image: url('/static/img/login/mobile.svg');
			background-repeat: no-repeat;
			background-size: 50rpx 50rpx;
			background-position: center;
		}
		.login-locales-mobile{
			position: absolute;
			top: -8rpx;
			right: 0;
			color: white;
			padding: 0 8rpx;
			// width: 94rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			z-index: 999;
			background: #302b2b;
			height: 130rpx;
			overflow: auto;
		}
		.login-mobile-security{
			background-image: url('/static/img/login/security.svg');
		}
		.login-mobile-recommend{
			background-image: url('/static/img/login/recommend.svg');
		}
		.login-send{
			color: #fbfbfb;
			border: 1px solid white;
			border-radius: 5px;
			position: absolute;
			padding: 2px 3px;
			right: 3px;
			top: calc(50% - 14px);
		}
		.login-row{
			margin-top: 60rpx;
		}
		.login-account{
			background-position: 0px 0px;
		}
		.login-password{
			background-position: 0px -98rpx;
		}
		.login-btns{
			display: flex;
			justify-content: space-between;
		}
		.login-show-pwd{
			width: 52rpx;
			height: 52rpx;
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}
		.login-btn{
			width: 254rpx;
			height: 74rpx;
			text-align: center;
			line-height: 74rpx;
			border-radius: 37rpx;
			color: black;
			background-color: #dbd778;
		}
		.login-btn-width{
			width: calc((100% - 3px) / 2);
		}
		.login-login{
			background-color: #244FAE;
		}
		.login-trial{
			background-color: #C61B55;
		}
		.login-video{
			height: 96rpx;
			background: url('/static/img/login/mark.png') no-repeat;
			background-position: 0 37.4%;
			position: relative;
			background-size: 1720rpx;
			border-radius: 6rpx;
			width: 70%;
		}
		.login-live{
			position: absolute;
			height: 100%;
			line-height: 96rpx;
			color: white;
			right: 48rpx;
		}
		.login-save{
			height: 96rpx;
			position: relative;
			border-radius: 6rpx;
			width: 28%;
			display: flex;
			left: 8rpx;
			background-color: #222222;
		}
		.login-save-txt{
			position: absolute;
			height: 48%;
			line-height: 48rpx;
			color: white;
			left: 28rpx;
		}
		.login-service{
			width: 300rpx;
			height: 90rpx;
			// margin: 0 auto;
			border-radius: 6rpx;
			background-color: rgba(0,63,134,.7);
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
		.login-chat{
			width: 33px;
			   height: 33px;
		}
		.login-serv-text{
			color: white;
		}
		.login-copyright{
			color: white;
			text-align: center;
			position: fixed;
			width: 100%;
			bottom: 10px;
		}
	}
	.login::before{
		content: " ";
		width: 100%;
		height: 100%;
		content: " ";
		top: 0;
		position: absolute;
		background: url('/static/img/login/bg1.jpg') no-repeat center center fixed;
		background-size: 100% 100%;
		opacity: 0.2;
		z-index: 0;
	}
</style>
