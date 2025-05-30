<template>
	<view class="chip-s" style="z-index: 25;">
		<view class="chip-s-panel">
			<view class="chip-s-title">
				{{liveLocales.useCommonChips}}
			</view>
			<view class="chip-block">
				<view class="chip-s-item" v-for="(chipItem, index) in chipList" :key="index" 
				:style="{backgroundColor: chipItem.color}" @tap="chooice(index)">
					<view class="chip-s-mask" v-if="!chipItem.active">
						
					</view>
					<view class="chip-s-item-bg">
					    {{ chipItem.text}}
					</view>
				</view>
				<view class="chip-s-controll">
					<view class="chip-s-btn chip-s-determine" @click="handleSubmit()">
					    <view class="chip-s-box">
					        <u-icon name="checkmark-circle" size="24" color="#fff"></u-icon>
					    </view>
					    <view class="chip-btn-text" v-html="liveLocales.ok">
					    </view>
					</view>
					<view class="chip-s-btn chip-s-cancel" @tap="handleCancel()">
					    <view class="chip-s-box">
					        <u-icon name="checkmark-circle" size="24" color="#fff"></u-icon>
					    </view>
					    <view class="chip-btn-text" v-html="liveLocales.cancel">
					    </view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import apiService from '@/api/game.js'
	import allChips from './allChipList.js'
    export default {
		props:['choiceChips'],
        data() {
            return {
				//已选筹码
				selectChips: [],
				//筹码列表
                chipList: allChips.allChips,
				//直播视频页语言
				liveLocales: this._i18n.messages[this.$storageLan].live, 
            };
        },
        mounted() {
			this.selectChips = JSON.parse(JSON.stringify(this.choiceChips))
			this.selectChips.forEach(el => {
				this.chipList[el.index].active = true
			})
        },
        methods: {
			/**
			 * 选择筹码  
			 * @param {index} 选择的筹码索引 
			 * */
			chooice(index) {
				let j = -1
				for(let i=0; i<this.selectChips.length;i++) {
					if(this.selectChips[i].index == index) {
						j = i
						this.chipList[this.selectChips[i].index].active = false
						break
					}
				}
				//删除重复选择
				if(j > -1) {
					this.selectChips.splice(j, 1)
					return
				}
				
				if(this.selectChips.length >= 5) {
					let deleteChip = this.selectChips.pop()
					this.chipList[deleteChip.index].active = false
				}
				this.chipList[index].active = true
				this.selectChips.unshift(this.chipList[index])
			},
			
			/**
			 * 确定
			 * */
			handleSubmit() {
				if(this.selectChips.length < 5) {
					this.$tip.alert(this.liveLocales.useCommonChips)
					return
				}
				this.selectChips.sort((x, y) => {
					if(x.index > y.index){
						return 1;
					}else if(x.index < y.index){
						return -1;
					}else{
						return 0;
					}
				})
				this.saveChips()
				this.$emit('confirm', this.selectChips)
			},
			/**
			 * 保存筹码
			 * **/
			saveChips() {
				let data = {chip: this.selectChips}
				apiService.saveChips(data).then(res => {
				}).catch(err => {
					console.log(err)
				})
			},
			
			/**
			 * 取消
			 * */
			handleCancel() {
				this.$emit('cancel',false)
			}
			
        }
    }
</script>


<style lang="scss" scoped>
	.chip-s{
		position: absolute;
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 11;
		background-color: rgba(0,0,0,.5);
		display: flex;
		align-items: center;
		
		.chip-s-panel{
			border: 2rpx solid #72654d;
			border-radius: 20rpx;
			width: 85%;
			height: 520rpx;
			margin: 0 auto;
			background-color: rgba(0,0,0,1);
		}
		.chip-s-item{
		    width: 84rpx;
		    height: 72rpx;
		    line-height: 72rpx;
		    text-align: center;
		    border-radius: 50%;
		    position: relative;
			margin: 0px 7px;
			font-size: 13px;
		}
		.chip-block{
			height: 420rpx;
			margin: 20rpx 0;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 0 64rpx;
		}
		.chip-s-item-bg {
		    background: url(/static/img/index/chip_all.png) no-repeat;
		    background-size: 98% 100%;
		    font-weight: 600;
		}
		.chip-s-title{
			color: white;
			text-align: center;
			margin-top: 20rpx;
			font-size: 15px;
		}
		.chip-s-mask{
			width: 86rpx;
			height: 76rpx;
			border-radius: 50%;
			position: absolute;
			top: -2rpx;
			left: -2rpx;
			background-color: rgba(0,0,0,.5);
		}
		.chip-s-controll{
			display: flex;
			align-items: center;
		}
		.chip-s-btn {
		    display: flex;
		    align-items: center;
		    height: 48rpx;
		    line-height: 48rpx;
		    width: 180rpx;
		    border-radius: 28rpx;
		    margin-left: 24rpx;
		    padding: 4rpx;
		}
		.chip-s-box {
		    width: 40rpx;
		    height: 40rpx;
		    line-height: 30rpx;
		    text-align: center;
		    border-radius: 50%;
		    border: 4rpx solid rgba(0, 0, 0, .4);
		    border-left: none;
		    border-bottom: none;
		}
		.chip-btn-text{
			width: calc(100% - 44rpx);
			text-align: center;
			font-size: 12px;
			transform: scale(0.8);
		}
		.chip-s-determine{
			background-image: linear-gradient(to right, #3BDF4B, #4DBA73);
			color: #FFFFFF;
		}
		.chip-s-cancel{
			background-image: linear-gradient(to right, #D54449, #C1655B);
			color: #FFFFFF;
			margin-left: 54rpx;
		}
	}
</style>
