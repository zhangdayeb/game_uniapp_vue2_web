<template>
	<view>
		<!-- 展示列表 开始  -->
		<u-popup style="height: 390rpx;" v-model="show" mode="right" @close="closeModel" :mask="false" width="324rpx"
			:custom-style="{top: '128rpx'}">
			<view class="settings-content">
				<view class="set-item" v-for="(setItem, index) in settingList" :key="index"
					@click="showMsg(setItem.is_msg,setItem.msgType,setItem)">
					<view class="set-item-tltle">
						<u-icon :name="setItem.name" size="46" color="#ebd093" style="margin: 0 20rpx;"></u-icon>
						<text class="set-item-tltle-text">{{ setItem.title }}</text>
					</view>
					<view class="set-item-switch" v-if="typeof(setItem.is_open) == 'boolean'">
						<u-switch v-model="setItem.is_open" size="40"></u-switch>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 展示列表 结束  -->
		
		<!-- 消息展示 开始  -->
		<u-popup v-model="show_message" mode="center" width="80%" border-radius="14" height="60%" top="40%">
			<view style="padding-top: 5%; padding-left: 5%; padding-right: 5%; padding-bottom: 1%; color: white;">
				<scroll-view scroll-y="true" style="height: 100%;" v-if="this.msgTypeNow == 'taihong'" >
					<view class="settings-msg" v-for="msg in msgContent" :key="msg.name">
						{{msg.title}}:   {{msg.content}}
					</view>
				</scroll-view>
				<scroll-view scroll-y="true" style="height: 100%;" v-if="this.msgTypeNow == 'guize'" >
					<template v-for="(rule, index) in rules" >
						<view class="settings-rule-type" v-if="rule.content.length > 0 && tableDataInfo.game_type == rule.id">
							<view class="settings-rule-title">
								{{rule.title}}
							</view>
							<view class="settings-rule-txt" v-for="(item,i) in rule.content" :key="`${index}-${i}`" v-html="item">
								
							</view>
						</view>
					</template>
					
				</scroll-view>
			</view>
		</u-popup>
		<!-- 消息展示 结束  -->
		
		<!-- 投注记录 开始  -->
		<record :showModel="showRecord" @closeRecord="handleCloseRecord()"></record>
		<!-- 投注记录 开始  -->
	</view>
</template>

<script>
	
	import gameTable from "@/api/game"
	import record from '../index/record.vue'
	import Bus from "@/common/util/bus.js"
	// import audioHandle from '@/common/service/audioHandle.js'
	
	//音乐类型 背景音乐  音效
	const MUSIC_TYPE = {
		backgroundMusicState: 'backgroundMusicState',
		musicEffectSate: 'musicEffectSate'
	}
	export default {
		components: {
		    record
		},
		props: ['showSetting','limitRed','tableDataInfo', 'user_info'],
		data() {
			return {
				// audioHandle:audioHandle,								// 初始化 音频项目导入
				msgTypeNow:'',
				settingList: [{
					name: 'volume',
					title: this._i18n.messages[this.$storageLan].live.soundEffect,
					is_open: uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? false : true ,
					is_msg: false,
					msgType: 'closeMusic'
				}, {
					name: 'volume-fill',
					title: this._i18n.messages[this.$storageLan].live.music,
					is_open: uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? false : true ,
					is_msg: false,
					msgType: 'closeBgMusic'
				}, 
				// {
				// 	name: 'moments',
				// 	title: this._i18n.messages[this.$storageLan].live.limitRed,
				// 	is_msg: true,
				// 	msgType: 'taihong'
				// }, 
				{
					name: 'order',
					title: this._i18n.messages[this.$storageLan].live.betHistory,
					is_msg: true,
					msgType: 'jilu'
				}, {
					name: 'calendar',
					title: this._i18n.messages[this.$storageLan].live.gamesRules,
					is_msg: true,
					msgType: 'guize'
				}, {
					name: 'home',
					title: this._i18n.messages[this.$storageLan].live.backHome, 
					is_msg: true,
					msgType: 'home'
				}],
				//选择的设置对象
				currentSettingItem: {},
				show: false,
				show_message: false,
				msgContent: [],
				showRecord:false,
				//直播视频页语言
				liveLocales: this._i18n.messages[this.$storageLan].live, 
				//规则
				rules: [],
			}
		},
		watch: {
			showSetting(val) {
				this.show = val
			},
			user_info(val){
				
			},
			tableDataInfo(val) {
				
			},
			limitRed() {
				if(this.user_info.is_xian_hong == 1) {
					switch(this.tableDataInfo.game_type) {
						//百家乐
						case 3: 
							this.msgContent = [
								{
									title: `${this.liveLocales.limitedRedPlayerPair}`,
									content: `${this.user_info.bjl_xian_hong_xian_dui_min} - ${this.user_info.bjl_xian_hong_xian_dui_max}`
								},
								{
									title: `${this.liveLocales.limitedRedLucky6}`,
									content: `${this.user_info.bjl_xian_hong_lucky6_min} - ${this.user_info.bjl_xian_hong_lucky6_max}`
								},
								{
									title: `${this.liveLocales.limitedRedBankerPair}`,
									content: `${this.user_info.bjl_xian_hong_zhuang_dui_min} - ${this.user_info.bjl_xian_hong_zhuang_dui_max}`
								},
								{
									title: `${this.liveLocales.limitedRedPlayer}`,
									content: `${this.user_info.bjl_xian_hong_xian_min} - ${this.user_info.bjl_xian_hong_xian_max}`
								},
								{
									title: `${this.liveLocales.limitedRedPeace}`,
									content: `${this.user_info.bjl_xian_hong_he_min} - ${this.user_info.bjl_xian_hong_he_max}`
								},
								{
									title: `${this.liveLocales.limitedRedBanker}`,
									content: `${this.user_info.bjl_xian_hong_zhuang_min} - ${this.user_info.bjl_xian_hong_zhuang_max}`
								}
							]
							break;
						//龙虎
						case 2: 
							this.msgContent = [
								{
									title: `${this.liveLocales.limitedDragon}`,
									content: `${this.user_info.lh_xian_hong_long_min} - ${this.user_info.lh_xian_hong_long_max}`
								},
								{
									title: `${this.liveLocales.limitedTiger}`,
									content: `${this.user_info.lh_xian_hong_hu_min} - ${this.user_info.lh_xian_hong_hu_max}`
								},
								{
									title: `${this.liveLocales.limitedRedPeace}`,
									content: `${this.user_info.lh_xian_hong_he_min} - ${this.user_info.lh_xian_hong_he_max}`
								}
							]
							break;
					}
					
				}else{
					this.msgContent = []
					this.limitRed.forEach(el => {
						this.msgContent.push({
							title: `${this.liveLocales.limited}${el.game_tip_name}`,
							content: `${el.xian_hong_min} - ${el.xian_hong_max}`
						})
					})
				}
			}
		},
		mounted() {
			if(this.settingList[0]['is_open']){
				uni.setStorageSync(MUSIC_TYPE.musicEffectSate,'on')
			}else{
				uni.setStorageSync(MUSIC_TYPE.musicEffectSate,'off')
			}
			if(this.settingList[1]['is_open']){
				uni.setStorageSync(MUSIC_TYPE.backgroundMusicState,'on')
			}else{
				uni.setStorageSync(MUSIC_TYPE.backgroundMusicState,'off')
			}
		},
		methods: {
			closeModel() {
				this.$emit("closeSetting",{})
			},
			getGameTable(id) {

				gameTable.gameTableInfo({
					id: id
				}).then((res) => {
					if (res.data.code == 200) {
						
						this.msgContent = [
						{
							title: this.liveLocales.limitedRedBankerPlayerUSD,
							content: res.data.data.xian_hong_zhuang_xian_usd
						},
						{
							title: this.liveLocales.limitedRedBankerPlayerCNY,
							content: res.data.data.xian_hong_zhuang_xian_cny,
						},
						{
							title: this.liveLocales.limitedRedPeaceUSD,
							content: res.data.data.xian_hong_he_usd,
						},
						{
							title: this.liveLocales.limitedRedPeaceCNY,
							content: res.data.data.xian_hong_he_cny,
						},
						{
							title: this.liveLocales.limitedRedPairUSD,
							content: res.data.data.xian_hong_duizi_usd,
						},
						{
							title: this.liveLocales.limitedRedPairCNY,
							content: res.data.data.xian_hong_duizi_cny,
						}]
					} else {
					}
				})
			},
			showMsg(isMsg, msgType,setItem) {
				this.currentSettingItem = setItem
				this.msgTypeNow = msgType
				if (isMsg) {
					// 游戏记录
					if (msgType == 'jilu') {
						this.showRecord = true
						return;
					}
					// 普通消息 
					
					// 限红
					if (msgType == 'taihong') {
						this.show_message = true
						// 台红的业务逻辑
						let routes = getCurrentPages();
						let curParam = routes[routes.length - 1].options;
						// console.log('curParam',curParam)
						// this.getGameTable(curParam.table_id);
					}
					// 规则介绍
					if (msgType == 'guize') {
						this.getGameType()
						// 规则的业务逻辑
						this.msgContent='';
					}
				}
				if (msgType == 'closeBgMusic') {
					// 关闭背景音乐  本质是 开关切换吧
					this.setBackgroundMusic(MUSIC_TYPE.backgroundMusicState)
				}
				if (msgType == 'closeMusic') {
					// 关闭音效  本质是 开关切换吧
					this.setBackgroundMusic(MUSIC_TYPE.musicEffectSate)
				}
				if(msgType == 'home') {
					uni.navigateTo({
						url: '/pages/index/index'
					})
				}
			},
			
			/**
			 * 获取游戏规则信息
			 * **/
			getGameType() {
				gameTable.gameType({}).then((res) => {
					if (res.data.code == 200) {
						this.rules = []
						if(res.data.data.length > 0) {
							res.data.data.forEach(el => {
								let content = el.explain ? el.explain.split('||') : [];
								if(content.length > 0) {
									content.forEach((str,index) => {
										content[index] = this.escape2Html(str)
									})
								}
								this.rules.push({
									id: el.id,
									title: el.type_name,
									content: content
								})
							})
						}
						this.show_message = true
					} else {
						console.log(res.data.message)
						// this.$tip.alert(res.data.message);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//转意符换成普通字符
			escape2Html(str) {
				let arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
				return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,(all,t) => {return arrEntities[t];});
			},
			/**
			 * 关闭记录
			**/
			handleCloseRecord() {
				this.showRecord = false
			},
			/**
			 * 开关背景音乐
			 * @param {key} 本地存储key 
			 * */
			setBackgroundMusic(musicType) {
				// 如果当前是开启状态
				if(this.currentSettingItem.is_open) {
					uni.setStorageSync(musicType, 'on')
					// 如果是 背景音乐，不单单要开开关，还要打开音乐
					// if(musicType == MUSIC_TYPE.backgroundMusicState) {
					// 	audioHandle.backgroundAudioContext.src = '/static/assets/audio/bg001.mp3'
					// 	audioHandle.backgroundAudioContext.loop = true
					// 	audioHandle.backgroundAudioContext.play()
					// }
				}else{
					// 否则 关闭对应的音效
					uni.setStorageSync(musicType, 'off')
					// 如果是 背景音乐，不单单要开开关，还要暂停音乐
					// musicType == MUSIC_TYPE.backgroundMusicState ? audioHandle.backgroundAudioContext.pause() : '';
				}
				Bus.$emit('setMusicType', musicType)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-mode-center-box {
		border: 2rpx solid #E7CA90;
		background-color: rgba(0, 0, 0, .5);
	}

	.u-drawer-content {
		border-radius: 20rpx 0 0 20rpx;
		// border: 2rpx solid #E7CA90;
		background-color: rgba(0, 0, 0, .8);
	}
	.settings-msg{
		border-bottom: 1px dashed #E7CA90;
		height: 50rpx;
		display: flex;
		align-items: center;
		padding-left: 10rpx;
		margin-bottom: 20rpx;
	}
	.settings-rule-type{
		border-bottom: 1px dashed #E7CA90 ;
	}
	.settings-rule-title{
		margin-bottom: 16rpx;
		font-size: 16px;
		text-align: center;
	}
	.settings-rule-txt{
		margin-bottom: 8rpx;
	}
	.settings-content {
		.set-item {
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 2rpx solid #E7CA90;

			.set-item-tltle {
				display: flex;
				align-items: center;

				.set-item-tltle-text {
					color: #FFFFFF;
				}
			}
		}
	}
</style>
