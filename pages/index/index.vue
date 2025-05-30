<template>
    <view class="page-view">
        <Loading ref="loading" :custom="false" :shadeClick="false" :type="2" @callback="callback()"></Loading>
		<userHander></userHander>
		<view class="index-container">
			<homePage v-if="pageNo == -1" @setPage="setPage"></homePage>
			<gamesPage v-else :isOnPullDownRefresh="isOnPullDownRefresh" :pageNo="pageNo" :game_type_id="game_type_id" :isonReachBottom="isonReachBottom" ></gamesPage>
		</view>
		<u-tabbar class="index-tab" height="130rpx" v-model="current" :list="pageList" inactive-color="#F2F2F2" bg-color="#1d1c22" :active-color="tabActiveColor" @change="tabbarChange"></u-tabbar>
        <record :showModel="showRecord" @closeRecord="handleCloseRecord()"></record>
    </view>
</template>

<script>
    import Loading from '@/components/loading/loading.vue'
    import userHander from './components/userheader.vue'
    import record from './record.vue'
    import homePage from './homePage.vue'
    import gamesPage from './gamesPage.vue'
    export default {
        components: {
            Loading,
            record,
            userHander,
            homePage,
            gamesPage
        },
        data() {
            return {
				isOnPullDownRefresh:false,		// 是否下拉
				isonReachBottom:false,			// 是否上拉
                pageNo: 0,
				game_type_id:3, // 默认游戏类型
				//游戏列表页语言
				indexLocales: this._i18n.messages[this.$storageLan].index,
                pageList: [
					{
					    iconPath: "home",
					    selectedIconPath: "home-fill",
					    text: '首页',
					    customIcon: false,
						localName: 'home'
					},
                    
                    {
                        iconPath: "file-text",
                        selectedIconPath: "file-text",
                        text: '记录',
                        customIcon: false,
						localName: 'record'
                    },
      //               {
      //                   iconPath: "play-circle",
      //                   selectedIconPath: "play-circle-fill",
      //                   text: '客服',
      //                   customIcon: false,
						// localName: 'customService'
      //               },
					{
					    iconPath: "account",
					    selectedIconPath: "account-fill",
					    text: '我的',
					    customIcon: false,
						localName: 'mine'
					},
                ],
                current: 5,
                showRecord: false,
				//点击底部导航栏后的颜色 
				tabActiveColor: 'rgb(96, 98, 102)',
				//是否是safari浏览器
				isSafari: false,
				//维护数据 
				maintainData: {},
            };
        },
		onShow(){
			this.getNoticeList()
		},
		// 下拉
		onPullDownRefresh(){
			this.isOnPullDownRefresh = true
			this.isonReachBottom = false
		},
		// 上拉
		onReachBottom(){
			this.isOnPullDownRefresh = false
			this.isonReachBottom = true
		},
		mounted() {
			this.pageList.forEach(el => {
				el.text = this.indexLocales[el.localName]
			})
			// 每秒 重置上下拉的状态
			this.PullDownRefreshHandle = setInterval(() => {
				this.resetPullDownRefreshStatus()
			},1000)
		},
        onLoad(option) {
			clearTimeout(this.PullDownRefreshHandle)				// 清除定期 上下拉的状态
            if(option.pageNo){
                this.pageNo = option.pageNo
            }else{
                this.pageNo = -1
            }
			console.log("this.pageNo:"+this.pageNo)
        },
        methods: {
			/**
			 * 获取整站维护通知
			 * */
			getNoticeList(){
				this.$maintainState.getNoticeList().then(res => {
					this.maintainData = res
					if(this.maintainData.web_maintain_status == this.$WEB_MAINTAIN_STATE){
						uni.redirectTo({
							url: '/pages/maintain/maintain'
						})
					}
				})
			},
			
			resetPullDownRefreshStatus(){
				this.isOnPullDownRefresh = false
				this.isonReachBottom = false
			},
            // 组件跳转
            setPage(game_type_id) {
				this.pageNo = 0
                this.game_type_id = game_type_id
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
            // 底部tabbar切换
            tabbarChange(index){
				this.tabActiveColor =  'rgb(96, 98, 102)'
				setTimeout(() => {
					this.tabActiveColor = '#F2F2F2'
				} , 1500)
				uni.setStorageSync('tabbar',index)
                if(index == 2){
                    uni.redirectTo({
                        url: '/pages/user/user'
                    })
                }else if(index == 0){
					uni.redirectTo({
					    url: '/pages/index/index'
					})
                }else if(index == 1){
					url: '/pages/record/record'
					uni.redirectTo({
					    url: '/pages/record/record'
					})
                    // this.showRecord = true
                }else if(index == 3) {
					uni.redirectTo({
					    url: '/pages/service/service'
					})
				}
				
            },
			
			/**
			 * 关闭记录
			**/
			handleCloseRecord() {
				this.showRecord = false
			}
        }
    }
</script>

<style lang="scss">
	page{
		//不能在safari用hidden，不然底部导航不触底
		height: 100vh;
		// overflow: hidden;
	}
	.index-container{
		// margin-top: 136rpx;
		height: calc(100% - 264rpx );
	}
    .page-view {
        width: 100%;
        height: 100%;
        position: relative;
    }
	.index-tab{
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 999;
	}
	.page-view::before {
	    width: 100%;
	    height: 100%;
		content: " ";
		top: 0;
	    position: absolute;
	    // background: url(../../static/img/login/background.png) no-repeat;
		background: url('/static/img/login/bg1.jpg') no-repeat center center fixed;
		background-size: 100% 100%;
		opacity: 0.2;
	    // background-size: 100% 100%;
	}
	// .for_header_postion{
	// 	display: flex;
	// 	width: 100%;
	// 	height: 176rpx;
	// 	padding-top:var(--status-bar-height);
	// 	z-index: 1000;
	// }
</style>
