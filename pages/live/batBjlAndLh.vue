<template>
    <view class="bet-panel" style="z-index: 22;">
		<!-- 投注金额显示 开始 确认投注后显示 -->
		<view class="bet-notice" v-if="showBetMoney">
			{{liveLocales.currentBureau}}：{{betMoney}}
		</view>
		<!-- 投注金额显示 结束 确认投注后显示 -->
		
		<!-- 免佣按钮 开始-->
        <view v-if="this.game_type_id == 3" class="freeAddress" :class="noFree ? 'noFree' : ''" @click="setMianYongButton()">
			<image src="@/static/img/live/free.png" mode="" v-if="!noFree" style="height: 56rpx;"></image>
			<image src="@/static/img/live/free3.png" mode="" v-if="noFree" style="height: 56rpx;"></image>
        </view>
        <!-- 免佣按钮 开始-->
		
		<!-- 投注区域 显示 桌布 开始-->
		<view class="bet-box" :class="{'bet-box2': noFree}">
            <!-- 上半部分桌面 庄对 幸运6 闲对-->
            <view v-if="this.game_type_id == 3" class="row" style="border-bottom:1px solid #556688 ;">
                <view :class="[target.className,target.flashClass]" v-for="(target,targetIndex) in betTargetList.slice(0,3)" 
				:key="targetIndex" @click="bet(target)">
                    <!-- 
					默认显示 标题，为了 效果，采用了 img 图片了 不用文字了，先保留此处
					<view class="title" >{{target.label}}</view> 
					-->
					<!-- 展示 下注文字的 图片信息 开始 -->
                    <view class="odds">
						<image :src="target.imgUrl" mode="" style="width: 80rpx;height: 90rpx;"></image>
					</view>
					<!-- 展示 下注文字的 图片信息 结束 -->
					
					<!-- 筹码展示 开始 -->
                    <view class="chip"
                        :style="{transform: target.className=='bet-big' ? 'skew(20deg)' : target.className=='bet-small' ? 'skew(-20deg)' : 'none'}">
                        <!-- 投注筹码 -->
						<view class="chip-item" v-for="(chip,chipIndex) in target.showChip"
                            :key="chip.color+'0'+chipList + chipIndex"
                            :style="{backgroundColor: chip.color, bottom: chipIndex*8+'rpx',zIndex: chipIndex}">
							<!-- 投注背景 -->
                            <view class="chip-item-bg">
                                {{ chip.val }}
                            </view>
							<!-- 投注钱数  总钱数 -->
                            <view class="betAmount" v-if="target.showChip.length -1 == chipIndex"
                                >{{ target.betAmount }}</view>
                        </view>
                    </view>
					<!-- 筹码展示 结束 -->
					
					<!-- 
					此处为 统计当前位置的 投注人数 跟 投注金额，根据老板的需求，卸载了
                    <view class="total_amount" v-if="target.total_amount">
                        <u-icon name="rmb-circle-fill" size="24" color="#ebd093"></u-icon> 
                        <text>{{ target.total_amount }}</text> 
                    </view>
                    <view class="total_population" v-if="target.total_population">
                        <u-icon name="account" size="24" color="#ebd093"></u-icon> 
                        <text>{{ target.total_population }}</text> 
                    </view>
					 -->
                </view>
            </view>
            <!-- 下半部分桌面  庄 闲 和-->
            <view v-if="this.game_type_id == 3" class="row">
                <view :class="[target.className,target.flashClass]" v-for="(target,targetIndex) in betTargetList.slice(3,6)"
                    :key="targetIndex" @click="bet(target)">
					<!-- 免佣 提示内容 开始 -->
					<view class="odds">
						<image :src="target.imgUrl" :class="{'bet-zhuang-sizi':targetIndex==2}" mode="" style="width: 80rpx;height: 90rpx;"></image>
						<view class="" v-if="targetIndex==2 && noFree">
							1:0.95
						</view>
						<view class="" v-if="targetIndex==2 && !noFree">
							1:1
						</view>
					</view>
					<view class="bat-zhuang-six" v-if="targetIndex == 2&&!noFree">
						<view class="">
							{{liveLocales.zhuangWins}}
						</view>
						<view class="">
							1:0.5
						</view>
					</view>
					<!-- 免佣 提示内容 结束 -->

					<!-- 筹码展示区域 开始 -->
                    <view class="chip">
						<!-- 开始数值 -->
                        <view class="chip-item" v-for="(chip,chipIndex) in target.showChip"
                            :key="chip.color+'0'+chipList + chipIndex"
                            :style="{backgroundColor: chip.color, bottom: chipIndex*8+'rpx'}">
							<!-- 值 -->
                            <view class="chip-item-bg">
                                {{ chip.val }}
                            </view>
							<!-- 钱数 -->
                            <view class="betAmount" v-if="target.showChip.length -1 == chipIndex"
                                >{{ target.betAmount }}</view>
                        </view>
                    </view>
					<!-- 筹码展示区域 结束 -->
					
					<!-- 
					此处为 统计当前位置的 投注人数 跟 投注金额，根据老板的需求，卸载了
                    <view class="total_amount" v-if="target.total_amount">
                        <u-icon name="rmb-circle-fill" size="24" color="#ebd093"></u-icon>
                        <text>{{ target.total_amount > 1000 ? `${target.total_amount / 1000}k` :  target.total_amount}}</text>
                    </view>
                    <view class="total_population" v-if="target.total_population">
                        <u-icon name="account" size="24" color="#ebd093"></u-icon>
                        <text>{{ target.total_population }}</text>
                    </view>
					 -->
                </view>
            </view>
			<!-- 下半部分结束 -->
			<!-- 龙虎投注区域 开始 -->
			<view v-if="this.game_type_id == 2" class="row">
			    <view style="height: 276rpx" :class="[target.className,target.flashClass]" v-for="(target,targetIndex) in betTargetList.slice(0,3)" :key="targetIndex" @click="bet(target)">
					<!-- 免佣 提示内容 开始 -->
					<view class="odds">
						<image :src="target.imgUrl" mode="" style="width: 80rpx;height: 90rpx;"></image>
					</view>
					<!-- 免佣 提示内容 结束 -->
					
					<!-- 筹码展示区域 开始 -->
			        <view class="chip">
						<!-- 开始数值 -->
			            <view class="chip-item" v-for="(chip,chipIndex) in target.showChip"
			                :key="chip.color+'0'+chipList + chipIndex"
			                :style="{backgroundColor: chip.color, bottom: chipIndex*8+'rpx'}">
							<!-- 值 -->
			                <view class="chip-item-bg">
			                    {{ chip.val }}
			                </view>
							<!-- 钱数 -->
			                <view class="betAmount" v-if="target.showChip.length -1 == chipIndex"
			                    >{{ target.betAmount }}</view>
			            </view>
			        </view>
					<!-- 筹码展示区域 结束 -->
					
					<!-- 
					此处为 统计当前位置的 投注人数 跟 投注金额，根据老板的需求，卸载了
			        <view class="total_amount" v-if="target.total_amount">
			            <u-icon name="rmb-circle-fill" size="24" color="#ebd093"></u-icon>
			            <text>{{ target.total_amount > 1000 ? `${target.total_amount / 1000}k` :  target.total_amount}}</text>
			        </view>
			        <view class="total_population" v-if="target.total_population">
			            <u-icon name="account" size="24" color="#ebd093"></u-icon>
			            <text>{{ target.total_population }}</text>
			        </view>
					 -->
			    </view>
			</view>
			<!-- 龙虎投注区域 结束 -->
        </view>
		<!-- 投注区域 显示 桌布 结束-->
		
		<!-- 筹码选择 重复下注 确认 取消 开始-->
        <view class="bet-select">
			<!-- 默认的筹码 开始 -->
            <view class="chip-list">
                <view class="chip-item" v-for="(chipItem, index) in chipList" :key="index"
                    :style="{backgroundColor: chipItem.color}"
                    :class="nowSelect == chipItem.val ? 'chip-item-avtive' : ''" @click="nowSelect = Number(chipItem.val)">
					<view class="bat-chip-mask" v-if="nowSelect != chipItem.val" >
					</view>
                    <view class="chip-item-bg">
                        {{ chipItem.text }}
                    </view>
                </view>
            </view>
			<!-- 默认的筹码 结束 -->
			
			<!-- 筹码功能按钮 开始 -->
            <view class="bet-btns">
                <view class="btn reset">
                    <view class="icon-box">
                        <u-icon name="reload" color="#ebd093" size="24"></u-icon>
                    </view>
                    <view class="btn-text-4" @click="repeatBet">
                        {{liveLocales.repeatBet}}
                    </view>
                </view>
                <view class="btn determine" @click="confirm">
                    <view class="icon-box">
                        <u-icon name="checkmark-circle" size="24" color="#fff"></u-icon>
                    </view>
                    <view class="btn-text-2" v-html="liveLocales.ok">
						
                    </view>
                </view>
                <view class="btn cancel" @click="cancel">
                    <view class="icon-box">
                        <u-icon name="close-circle" size="24" color="#fff"></u-icon>
                    </view>
                    <view class="btn-text-2" v-html="liveLocales.cancel">
                        
                    </view>
                </view>
                <view class="logo" @tap="handleChoice()"></view>
            </view>
			<!-- 筹码功能按钮 结束 -->
        </view>
		<!-- 筹码选择 重复下注 确认 取消 结束-->
	</view>
</template>

<script>
    import api from "@/api/table"
    import user from "@/api/api"
	import chips from './allChipList.js'
	
	const allChips = chips.allChips
	
    export default {
		props:['choiceChips','betState','endState','tableDataInfo','resultInfo'],
        data() {
            return {
				tablePre:'',											// 不同台桌存信息前缀不一样 类型 + ID
				game_type_id:3,											// 默认游戏类型
				// 投注信息  投注可选集合
				betTargetList:[],
				betTargetListBjl: [{
				    id: 2,
				    label: '闲对',
				    value: 'idle-Pair',
				    className: 'bet-idle-Pair',
					color:'white',
					imgUrl: '/static/img/live/xian_pair.png',
					textShadow: '0 0 blue',
				    odds: '',
				    betAmount: 0,
				    showChip: [],
				    total_amount: 0,
				    total_population: 0,
				}, 
				{
				    id: 3,
				    label: '幸运6',
				    value: 'lucky',
				    className: 'bet-lucky',
					imgUrl: '/static/img/live/lucky.png',
					color:'white',
					textShadow: '0 0 blue',
				    odds: '',
				    betAmount: 0,
				    showChip: [],
				}, 
				{
				    id:4,
				    label: '庄对',
				    value: 'zhuang-Pair',
				    className: 'bet-zhuang-Pair',
					color:'white',
					textShadow: '0 0 blue',
					imgUrl: '/static/img/live/zhuang_pair.png',
				    odds: '',
				    betAmount: 0,
				    showChip: [],
				    total_amount: 0,
				    total_population: 0,
				}, 
				{
				    id: 6,
				    label: '闲',
				    value: 'idle',
				    className: 'bet-idle',
					color:'',
				    odds: '',
				    betAmount: 0,
					imgUrl: '/static/img/live/xian.png',
				    showChip: [],
				    total_amount: 0,
				    total_population: 0,
				}, 
				{
				    id: 7,
				    label: '和',
				    value: 'peace',
				    className: 'bet-peace',
					color:'',
				    odds: '',
					imgUrl: '/static/img/live/he.png',
				    betAmount: 0,
				    showChip: [],
				    total_amount: 0,
				    total_population: 0,
				}, 
				{
				    id: 8,
				    label: '庄',
				    value: 'zhuang',
				    className: 'bet-zhuang',
					color:'',
					imgUrl: '/static/img/live/zhuang.png',
				    odds: '',
				    betAmount: 0,
				    showChip: [],
				    total_amount: 0,
				    total_population: 0,
				}],
                betTargetListLongHu: [
				{
				    id: 20,
				    label: '龙',
				    value: 'zhuang',
				    className: 'bet-idle',
					color:'',
					imgUrl: '/static/img/live/dragon.png',
				    odds: '',
				    betAmount: 0,
				    showChip: [],
				    total_amount: 0,
				    total_population: 0,
				},
				{
                    id: 22,
                    label: '和',
                    value: 'peace',
                    className: 'bet-peace',
					color:'',
                    odds: '',
					imgUrl: '/static/img/live/lh_he.png',
                    betAmount: 0,
                    showChip: [],
                    total_amount: 0,
                    total_population: 0,
                },
				{
				    id: 21,
				    label: '虎',
				    value: 'idle',
				    className: 'bet-idle',
					color:'',
				    odds: '',
				    betAmount: 0,
					imgUrl: '/static/img/live/tigger.png',
				    showChip: [],
				    total_amount: 0,
				    total_population: 0,
				}],
                chipList: [],			// 投注选择 列表  默认的选择后的效果
				info: {}, 				// 台桌信息
				user_info: {}, 			// 个人信息
				total_money: 0, 		// 总钱数
                nowSelect: 10, 			// 当前选中项目
                repeat: [], 			// 重复下注项目
                noFree: true, 			// 免佣是否开启
				startBet: false, 		// 是否 开启下注
				sendFlag:0, 			// 发送结果到后台次数 
				betSuccess: false,		//下注状态  当局投注的状态 
				showBetMoney:false,		//展示投注金额
				betMoney: 0,			//下注金额
				repeatState: false,		//重复下注执行的 标志位
				liveLocales: this._i18n.messages[this.$storageLan].live, //直播视频页语言
				
            };
        },
		// 监听事件 
		watch:{
			// 筹码选择事件
			choiceChips(val, oldVal) { 
				this.chipList = val
				let b = false
				//如果用户选择了筹码并且在可选筹码中
				for(let chip of this.chipList) {
					if(this.nowSelect == Number(chip.val)) {
						b = true
						this.nowSelect = Number(chip.val)
						break
					}
				}
				//如果用户选择了筹码不在可选筹码中默认选中第一个
				if(!b) {
					this.nowSelect = Number(this.chipList[0].val)
				}
			},
			//开牌结果信息
			resultInfo(newVal){
				this.betTargetList.forEach(item =>{
					item.flashClass = ''
				})
				if(newVal.pai_flash && newVal.pai_flash.length > 0){
					newVal.pai_flash.forEach(el => {
						this.betTargetList.forEach(item =>{
							if(el == item.id){
								item.flashClass = 'bet-win-green-bg'
							}
						})
					})
				}
				this.$forceUpdate()
			},
			// 默认 免佣标记
			tableDataInfo(val){
				this.setNofreeState(val)
				// // 设置 缓存前缀
				// this.tablePre = val.game_type + '_' + val.id + '_'
				// // 根据 is_exempt 获取是否免佣
				// let is_play_now = uni.getStorageSync(this.tablePre+'is_play_now')
				// if(is_play_now == '1') {
				// 	this.noFree = val.is_exempt < 1 ? true : false
				// }
			},
			// 开始投注的时候 开局 清理台桌
			betState(val){
				if(val){
					this.cancel(1) // 1 代表新开局消失 清除全部
				}
			},
			// 结束下注 这里传入的是倒计时的时间
			endState(val){
				// console.log('倒计时时间：',val)
				if(val == 0){
					// 清除一些 当局的标志位
					this.removeStorageInfo()
				}				
			}
		},
		// 数据挂载
        mounted() {
			// 获取当前的参数
			let routes = getCurrentPages();
			let curParam = routes[routes.length - 1].options;		// 获取参数的ID
			this.game_type_id = curParam.game_type_id
			this.tablePre = curParam.game_type_id + '_' + curParam.table_id + '_storage_flag_'
			// 根据游戏类型 配置 投注数据
			if(this.game_type_id == 3){ // 百家乐
				this.betTargetList = this.betTargetListBjl
			}
			if(this.game_type_id == 2){ // 龙虎
				this.betTargetList = this.betTargetListLongHu
			}
			// 清理台桌
			let bureauNumber = uni.getStorageSync(this.tablePre+'bureauNumber')?uni.getStorageSync(this.tablePre+'bureauNumber'):0
			if(this.tableDataInfo.bureau_number != bureauNumber) {
				this.removeStorageInfo()
				this.clearAll()
			}
			this.setNofreeState(this.tableDataInfo)
			// 是否已发送数据
			let sendFlag_temp = uni.getStorageSync("sendFlag") 						// 是否当局已经投注 发送后台
			this.sendFlag = sendFlag_temp ? Number(sendFlag_temp) : 0				// 是否当局已经投注 发送后台 标志位
			this.chipList = JSON.parse(JSON.stringify(this.choiceChips)) 			// 数据传递
			this.initTableChipsInfo(); 												// 获取台桌信息
            this.userInfos(); 														// 获取个人信息  如果获取不到，直接跳转重新登录
        },
		onShow(){
			this.getGameTableInfoInitOnShow()
			this.showChouMa()
		},
        methods: {
			//移除缓存
			removeStorageInfo(tablePreTemp = 0){
				if(tablePreTemp != 0){
					this.tablePre = tablePreTemp
				}
				// console.log('test 当铺号变化的时候 2','执行一些清除'+this.tablePre)
				// 清除一些 当局的标志位
				uni.removeStorageSync(this.tablePre+'is_play_now');
				uni.removeStorageSync(this.tablePre+'sendFlag');
				uni.removeStorageSync(this.tablePre+'betMoneyBefore');
				uni.removeStorageSync(this.tablePre+'betRepeatTargetList');
				uni.removeStorageSync(this.tablePre+'betTargetList');
				uni.removeStorageSync(this.tablePre+'isBetSuccessInOneGame');
			},
			/**
			 *设置免俑状态
			 * **/
			setNofreeState(val) {
				this.tablePre = val.game_type + '_' + val.id + '_storage_flag_'
				// 根据 is_exempt 获取是否免佣
				let is_play_now = uni.getStorageSync(this.tablePre+'is_play_now')
				if(is_play_now == '1') {
					this.noFree = val.is_exempt < 1 ? true : false
				}
			},
			/**
			 * 就是为了判断 铺号是否变化的
			 * **/
			getGameTableInfoInitOnShow(){
				let this_ = this
				// 之前存储的数据
				let bureauNumberStore =  uni.getStorageSync(this.tablePre+'bureauNumber')
			
				// console.log('当铺号变化的时候 0 start')
				// console.log('当铺号变化的时候 0 bureauNumberStore',bureauNumberStore)
				
				// 后台获取数据
				apiService.gameTableInfo({id: this.tableId}).then(res => {
					if(res.data.code === 200) {
						// 先存 
						let numberNow = Number(res.data.data.bureau_number)
						uni.setStorageSync(this.tablePre+'bureauNumber',numberNow)
						// console.log('当铺号变化的时候 0 numberNow',numberNow)
						// 后判断
						if(bureauNumberStore > 0 && numberNow != bureauNumberStore){
							// 非初始化，有变化
							// console.log('当铺号变化的时候 1',numberNow)
							// 执行子组件的清理函数
							// setTimeout(() => {
								this_.removeStorageInfo(this.tablePre)
							// },200)
						}
						this.$forceUpdate()
					}
				})
			},
			/**
			 * 设置免佣开
			 * 点击切换效果
			 * */
			setMianYongButton(){
				// 如果新局开始，并且没有投注记录
				let sendFlag_temp = uni.getStorageSync(this.tablePre+'sendFlag')
				if(sendFlag_temp == 0){
					this.noFree = !this.noFree
					let length = this.betTargetList.length
					this.betTargetList[1].imgUrl = !this.noFree ?  '/static/img/live/lucky.png' : '/static/img/live/lucky2.png'
				}
			},
			/**
			 * 初始化台桌 筹码信息
			 * */
            initTableChipsInfo() {
                let betTargetListStorage = uni.getStorageSync(this.tablePre+'betTargetList')
                if(betTargetListStorage) {
                	this.betTargetList = betTargetListStorage
                }
            },
			/**
			 * 设置模拟人数跟钱数 变成 k 单位
			 * 暂时没用了 
			 * */
			setTotal() {
				if(this.betState) {
					this.betTargetList.forEach(el => {
						el.total_population = el.total_population + Math.floor(Math.random() * (100 - 1)) + 1
						el.total_amount = el.total_amount + Math.floor(Math.random() * (10000 - 1)) + 1
					})
				}
				setTimeout(() => {
					this.setTotal()
				}, 1000)
			},
			/**
			 * 检测用户信息
			 * */
            userInfos() {
                user.getUserInfo().then((res) => {
                    if (res.data.code == 200) {
                        this.user_info = res.data.data
                    } else {
                        this.$tip.alert(res.data.message);
						uni.navigateTo({
							url:'/pages/login/login'
						})
                    }
                })
            },
            // 追加筹码-显示
            oddChip(val, num, list) {
                for (let i = 1; i <= num; i++) {
                    this.chipList.forEach((item, index) => {
                        if (val == item.val) list.push(this.chipList[index])
                    })
                }
            },
            // 获取每种筹码个数
            conversionChip(money) {
				let tem_chip_list = []
				let temChips = this.findMaxChip(money)
                return temChips
            },
			/**
			 * 找出最大筹码
			 * 筛选最大筹码：例：[1,2,10,20,50,100]  总金额：60 那么最大金额为 50
			 * 1 如果总金额等于最大的筹码 选择最大筹码
			 * 2 如果总金额大于最大筹码  总金额-最大的筹码 = 剩余 (用剩余金额 继续第1步）
			 * 3 如果剩余金额等于当前选择的筹码 就用当前选择的筹码
			 * @param {amount} 总金额
			 * @param {tempChips} 选出的筹码列表 
			 * **/
			findMaxChip(amount = 0, tempChips = []) {
				if (amount == 0){
					return
				}
				let chip = {}
				let restAmount = 0
				for(let i = 0; i < allChips.length - 1; i++) {
					if(allChips[i].val <=  Number(amount) && allChips[i + 1].val > Number(amount)) {
						chip = allChips[i]
						break
					}else{
						chip = allChips[i + 1]
					}
				}
				restAmount = amount - chip.val
				tempChips.push(chip)
				//如果剩下金额大于最大筹码还得继续找最大筹码
				if(restAmount > 0) {
					this.findMaxChip(restAmount, tempChips)
				}else{
					return tempChips
				}
				return tempChips
			},
			// 当前投注判断
            bet(target) {
                this.userInfos()				// 下注前 更新用户数据 点击就更新
				this.betSuccess = false			// 只要重新点击台面 就可以投注	
				// 非下注时间 禁止投注 
				if(!this.betState) {
					this.$tip.alert(this.liveLocales.nonBettingTime)
					return
				}
				// betTargetList 为投注列表 数据集合  庄对 幸运6 闲对 庄 和 闲
                this.betTargetList.forEach(item => {
					// 增加对 非免佣台的过滤 结论 就是 ： 幸运6 正常的，不能压
					if(item.className == 'bet-lucky' && this.noFree == true){
						// 什么都不做了
					}else if (item.value == target.value) {//限制由 后台决定 添加验证，获取用户金额（判断是否小于下注金额）,或者限额的判断
						// 加钱
						this.total_money += Number(this.nowSelect)				// 累计 总钱数
						item.betAmount += Number(this.nowSelect)				// 累计 当前投注的金额
						// 获取最大的展示 筹码
                        item.showChip = []										// 重置 显示 效果 0
                        item.showChip = this.conversionChip(item.betAmount)		// 把钱数 转化为 筹码 数据
						// 触发声音
						this.$emit('betting',{audiName: 'bet.mp3'})
                    }
                })
				// 强制渲染视图
				this.$forceUpdate()
            },
			// 发送 数据到 后台
            confirm() {
				// 如果已经 成功发送了， 防止手抖
				if(this.betSuccess) {
					return
				}
				// 遍历投注选项数据集 生成发送至后台的数据 开始
                let confirmData = [];
                this.betTargetList.forEach(item => {
                    if (item.betAmount > 0 && item.id > 0) {
                        confirmData.push({
                            money: item.betAmount,
                            rate_id: item.id,
                        })
                    }
                })
				// 遍历投注选项数据集 生成发送至后台的数据 结束
				
				// 免佣状态 获取
				let is_exempt = this.noFree ? 0:1;
                // 发送请求，结束后清空数据
				let routerParams = uni.getStorageSync('routerParams')
				let game_type = routerParams.game_type_id		// 游戏类型 百家乐 默认 3号类型
				let table_id = routerParams.table_id
				// console.log('confirmData-----------------------:',confirmData)
                api.orderTable({
                    'bet': confirmData,			// 投注数据 含钱数 跟 投注的ID
                    'game_type': game_type,		// 游戏类型 百家乐 默认 3号类型
                    'table_id': table_id,		// 台桌ID
					'is_exempt':is_exempt		// 是否免佣
                }).then((res) => {
                    if (res.data.code == 200) {
						uni.setStorageSync(this.tablePre+'is_play_now','1')								  // 设置 存储过了  跟 sendFlag 类似
						this.$emit('betSuccess',{})														  // 触发 投注成功
						this.$emit('betLoadAudi',{audiName: 'betsuccess.mp3'})							  // 触发 投注成功 音乐
						this.betMoney = res.data.data.money_spend										  // 投注 后台返回后的数据
						this.showBetMoney = true														  // 展示投注结果 显示投注数据
						uni.setStorageSync(this.tablePre+'betMoneyBefore',this.betMoney)				  // 存储 之前是钱数
						uni.setStorageSync(this.tablePre+'betRepeatTargetList',this.betTargetList)		  // 存储 重复投注的结果
						uni.setStorageSync(this.tablePre+'betTargetList',this.betTargetList)			  // 存储 当前的投注结果
						uni.setStorageSync(this.tablePre+'bureauNumber',this.tableDataInfo.bureau_number) //保存局号

						setTimeout(() => {																// 1秒以后 那个 投注金额展示 消失
							this.showBetMoney = false
						},1000)
						
						this.betSuccess = true															// 投注成功 标志位 
						uni.setStorageSync(this.tablePre+'isBetSuccessInOneGame',true)					// 存入 当局是否有投注状态 
                    
						// 记录当局铺 向后台发送的次数 默认关于免佣的配置  发送成功后 才能发送
						let sendFlag_temp = uni.getStorageSync(this.tablePre+'sendFlag')
						sendFlag_temp++
						uni.setStorageSync(this.tablePre+'sendFlag',sendFlag_temp)
					} else {
                        this.cancel()													// 清除投注信息
						this.$emit('betSuccess',{})										// 触发投注成功处理函数
                        this.$tip.alert(res.data.message);								// 提示异常信息
                    }
                })
            },
			// 重复当前局的结果(可能投注2-3次后，继续点击那个)，不清零
            repeatBet() {

				// 非下注时间 判断
				if(!this.betState){
					this.$tip.alert(this.liveLocales.nonBettingTime)
					return
				}
				// 重复下注执行的 标志位 默认 false
				if(this.repeatState) {
					return
				}
				// 标记重复下注 执行中
				this.repeatState = true			
				this.repeat = uni.getStorageSync(this.tablePre+'betRepeatTargetList')		// 获取重复下注数据
                if (this.repeat.length != 0) {		// 增加当下重复 后的 合并
					// 这里的 item 0，1，2，3，4，5
					for(var item in this.repeat){
						let repeat = this.repeat[item]			// 上一次存储的投注数据
						let temp = this.betTargetList[item]		// 当期投注的数据
						temp['betAmount'] = (Number(temp['betAmount']) + Number(repeat['betAmount']))*1		// 钱数累计
						this.betTargetList[item]['betAmount'] = temp['betAmount']							// 重新赋值
						this.betTargetList[item]['showChip'] = this.conversionChip(temp['betAmount'])		// 重新计算筹码
					}
                }

				// 标记，可以投注 到后台
				this.betSuccess = false
				// 防止 重复点击过快，估计这个要取消了
				setTimeout(() => {			
					this.repeatState = false
				},1000)
            },
			/**
			 * 打开选择筹码
			 * 父组件 响应事件
			 * **/
			handleChoice() {
				this.$emit('openMoreChip',true)
			},
			// 取消
            cancel(kaiju = 0) {
				
				let isBetSuccessInOneGame = uni.getStorageSync(this.tablePre+'isBetSuccessInOneGame')
				let sendFlag_temp = uni.getStorageSync(this.tablePre+'sendFlag')
				
				// 新开局 | 新进入页面 如果没有投注记录的情况  全清理
				if(kaiju == 1 && isBetSuccessInOneGame != true){
					this.clearAll()
				}
				// 投注状态内 并且有投注记录  部分清理 恢复之前的存储
				if(this.betState && sendFlag_temp > 0){
					// 清除刚刚新增的筹码
					let betTargetListBefore =  uni.getStorageSync(this.tablePre+'betRepeatTargetList')
					let betMoneyBefore = uni.getStorageSync(this.tablePre+'betMoneyBefore')
					if(betMoneyBefore  && betTargetListBefore ){
						this.total_money = betMoneyBefore
						this.betTargetList = betTargetListBefore
					}else{
						this.betTargetList.forEach(item => {
							item.showChip = []
							item.betAmount = 0
						})
					}
				}
				// 如果在 非投注时间段 
				if(this.betState == false){
					this.clearAll()
				}else{
					if(!sendFlag_temp){
						this.clearAll()
					}
				}
            },
			/**
			 * 清楚全部
			 */
			clearAll(){
				// 清除桌面筹码
				this.betSuccess = false
				this.repeatState = false
				this.total_money = 0
				this.betTargetList.forEach(item => {
				    item.betAmount = 0
				    item.showChip = []
				})
			},
			/**
			 * 开桌展示筹码
			 */
			showChouMa(){
				let betTargetListBefore =  uni.getStorageSync(this.tablePre+'betRepeatTargetList')
				let betMoneyBefore = uni.getStorageSync(this.tablePre+'betMoneyBefore')
				if(betMoneyBefore  && betTargetListBefore ){
					this.total_money = betMoneyBefore
					this.betTargetList = betTargetListBefore
				}
				// 强制渲染视图
				this.$forceUpdate()
			}
        }
    }
</script>

<style lang="scss" scoped>
    .bet-panel{
        position: relative;
		z-index: 9;
    }
    .freeAddress{
        width: 160rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        padding: 8rpx;
        position: absolute;
        z-index: 8;
        right: 0;
        top: -40rpx;
	 
        .free_address_text{
            color: #FFFFFF;
            margin-left: 10rpx;
            font-weight: 800;
        }
    }
    .noFree{
        background-position: 11490rpx -10120rpx;
    }
    
	.bat-chip-mask{
		width: 86rpx;
		height: 76rpx;
		border-radius: 50%;
		position: absolute;
		top: -2rpx;
		left: -2rpx;
		background-color: rgba(0,0,0,.5);
	}
	.bet-zhuang-sizi{
		width: 72rpx !important;
		height: 64rpx !important;
		margin-top: 0rpx;
	}
	.bet-notice{
		position: fixed;
		padding: 0 20rpx;
		padding-left: 76rpx;
		height: 86rpx;
		background-size: 100% 100%;
		width: calc(86rpx * 4.14117);
		top: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		word-break: normal;
		white-space: nowrap;
		padding-left: 98rpx;
		z-index: 99;
		color: #dac193;
		display: flex;
		align-items: center;
		background-image: linear-gradient(to right, black, #454141) ;
		animation:betMoneyNote 500ms;
		-webkit-animation:betMoneyNote 500ms;
		background-image: url(/static/img/live/noticeLogo.png);
	}
	
	@keyframes betMoneyNote{
		from {top:500rpx;}
		to {top:200rpx;}
	}
	
	@-webkit-keyframes betMoneyNote{
		from {top:500rpx;}
		to {top:200rpx;}
	}
    .bet-box {
        height: 276rpx;
		/* background-color: #004939;27503b;29533d*/
		background-color: #22453a;

		.bat-zhuang-six{
			position: absolute;
			right: 10rpx;
			top: 32rpx;
			font-size: 12px;
			color: white;
			transform: scale(0.78);
		}
		.row_for_longhu{
			height: 100%;
		}
        .row {
            display: flex;
            justify-content: space-between;

            .title,
            .odds {
                font-weight: 800;
                font-family: '隶书';
            }

            .odds {
                // transform: scale(.8);
            }

            .chip {
                position: absolute;
                bottom: 26%;
                width: 100%;
				display: flex;
				justify-content: center;

                .chip-item {
                    width: 84rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    text-align: center;
                    border-radius: 50%;
                    color: #000000;
                    transform: scale(.5);
                    transform-origin: 50% 100%;
                    position: absolute;

                    .chip-item-bg {
                        background: url(/static/img/index/chip_all.png) no-repeat;
                        background-size: 98% 100%;
                        font-weight: 600;
                    }

                    .betAmount {
                        width: 100%;
                        font-size: 90rpx;
                        font-weight: bolder;
                        color: #FA3534;
                        text-align: center;
						display: flex;
						justify-content: center;
                    }
                }
            }

            .total_amount {
                position: absolute;
                bottom: 0;
                left: 10rpx;
                color: #ebd093;
                font-size: 24rpx;
                transform: scale(.8);
                transform-origin: 0 0;
            }

            .total_population {
                position: absolute;
                bottom: 0;
                right: 0;
                color: #ebd093;
                font-size: 24rpx;
                transform: scale(.8);
                transform-origin: 0 0;
            }

            .bet-big,
            .bet-idle-Pair,
            .bet-lucky,
            .bet-zhuang-Pair,
            .bet-small {
                // border: 2rpx solid #CEBAA0;
                text-align: center;
                height: 80rpx;
                line-height: 24rpx;
                font-size: 30rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .bet-idle,
            .bet-peace,
            .bet-zhuang {
                //border: 2rpx solid #CEBAA0;
                text-align: center;
                height: 150rpx;
                font-size: 40rpx;
                line-height: 40rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .bet-big {
                width: 68rpx;
                border-radius: 16rpx;
                transform: skew(-20deg);
                margin-right: 24rpx;
                color: #2643ff;
            }

            .bet-idle-Pair {
                // width: 180rpx;
				flex: 1;
                // border-radius: 0 16rpx 16rpx 0;
				
                position: relative;
                border-left: none;
                color: #2643ff;
				height: 120rpx;
				border-right: 1px solid #556688;

                .total_amount {
                    left: 0rpx;
                }

                .total_population {
                    right: 10rpx;
                }
            }

            .bet-idle-Pair::before {
                width: 40rpx;
                height: 80rpx;
                border-radius: 16rpx 0 0 16rpx;
                // border: 2rpx solid #CEBAA0;
                // border-bottom: 3.6rpx solid #CEBAA0;
                border-right: none;
                border-top: none;
                position: absolute;
                left: -24rpx;
                top: -4rpx;
                transform: skew(-20deg);
                content: '　';
            }

            .bet-lucky {
                // width: 200rpx;
				flex: 1;
                    /* border-radius: 8px; */
				color: #ff3939;
				height: 120rpx;
				border-right: 1px solid #556688;
            }

            .bet-zhuang-Pair {
                // width: 180rpx;
				flex: 1;
				height: 120rpx;
                // border-radius: 16rpx 0 0 16rpx;
                position: relative;
                border-right: none;
                color: #ff3939;
				.odds{
					margin-top: 20rpx;
				}
				.total_amount {
                    left: 20rpx;
                }
                .total_population {
                    // right: -20rpx;
                }
            }

            .bet-zhuang-Pair::after {
                width: 40rpx;
                height: 80rpx;
                border-radius: 0 16rpx 16rpx 0;
                // border: 2rpx solid #CEBAA0;
                // border-bottom: 3.6rpx solid #CEBAA0;
                border-left: none;
                border-top: none;
                // position: absolute;
                right: -24rpx;
                top: -4rpx;
                transform: skew(20deg);
                content: '　';
            }

            .bet-small {
                width: 68rpx;
                border-radius: 16rpx;
                transform: skew(20deg);
                margin-left: 24rpx;
                color: #ff3939;
            }

            .bet-idle {
				flex: 1;
                // width: 288rpx;
                // border-radius: 16rpx 16rpx 16rpx 43%;
				border-right:1px solid #556688 ;
                // transform: skew(-2deg);
                // color: #2643ff;
                .total_amount {
                    left: 80rpx;
                }

                .total_population {
                    // right: 18rpx;
                }
            }

            .bet-peace {
                // width: 200rpx;
				flex: 1;
                // border-radius: 16rpx;
                // color: #78C868;
				border-right:1px solid #556688;
                .total_amount {
                    left: 4rpx;
                }

                .total_population {
                    // right: -4rpx;
                }
            }

            .bet-zhuang {
                // width: 288rpx;
				flex: 1;
                // border-radius: 16rpx 16rpx 43% 16rpx;
                transform: skew(2deg);
                // color: #ff3939;
				color: #eaf4ee;
				font-size: 17px;

                .total_amount {
                    left: 20rpx;
                }

                .total_population {
                    // right: 80rpx;
                }
            }

        }
    }
	.bet-box2{
		background-position: -2982rpx -968rpx;
	}
    .bet-select {
        // height: 164rpx;
        background-color: #2E2E2E;
		background: linear-gradient(to right, #2E2E2E,  black);
        padding: 2rpx;

        .chip-list {
            width: 520rpx;
			height: 80rpx;
            margin: 16rpx auto;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .chip-item {
                width: 84rpx;
                height: 72rpx;
                line-height: 72rpx;
                text-align: center;
                border-radius: 50%;
				position: relative;

                .chip-item-bg {
                    background: url(/static/img/index/chip_all.png) no-repeat;
                    background-size: 98% 100%;
                    font-weight: 600;
                }
            }

            .chip-item-avtive {
                box-sizing: content-box;
                border: 4rpx solid #FBF200;
            }
        }
    }

    .bet-btns {
        display: flex;
        align-items: center;
        margin-top: 12rpx;

        .btn {
            display: flex;
            align-items: center;
            height: 48rpx;
            line-height: 48rpx;
            width: 180rpx;
            border-radius: 28rpx;
            margin-left: 24rpx;
            padding: 4rpx;

            .icon-box {
                width: 40rpx;
                height: 40rpx;
                line-height: 30rpx;
                text-align: center;
                border-radius: 50%;
                border: 4rpx solid rgba(0, 0, 0, .4);
                border-left: none;
                border-bottom: none;
            }
        }
        .reset {
            border: 2rpx solid #ebd093;
            color: #ebd093;
        }

        .determine {
            background-image: linear-gradient(to right, #3BDF4B, #4DBA73);
            color: #FFFFFF;
        }

        .cancel {
            background-image: linear-gradient(to right, #D54449, #C1655B);
            color: #FFFFFF;
        }

        .logo {
			width: 70rpx;
			height: calc(70rpx * 1.0184);
            margin-left: 20rpx;
			background: url(/static/img/live/bet.jpg) no-repeat;
            background-size: 100% 100%;
			filter: brightness(450%);
			transform: rotate(135deg);
        }
    }
	.btn-text-4 {
		width: calc(100% - 26rpx);
		text-align: center;
		font-size: 16px;
		transform: scale(0.8);
	}
	.btn-text-2 {
		width: calc(100% - 44rpx);
		text-align: center;
		font-size: 20px;
		transform: scale(0.8);
	}
	.bet-win-green-bg{
		animation: backGreenFlicker 1000ms infinite;
		-webkit-animation:backGreenFlicker 1000ms infinite;
	}
	@keyframes backGreenFlicker{
		from {background-color: rgba(19,133,53,1);}
		to {background-color: rgba(19,133,53,.1);}
	}
	
	@-webkit-keyframes backGreenFlicker 
	{
		from {background-color: rgba(19,133,53,1);}
		to {background-color: rgba(19,133,53,.1);}
	}
</style>
