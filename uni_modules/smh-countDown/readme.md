# smh-countDown

用于倒计时展示的动画 。QQ：577094253

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法

在 ``template`` 中使用组件

```html
<smh-countDown ref="countDown" :second="15" :radius="150" :fontSize="40" color="#0A84FF" bgcolor="#f2f2f2" :lineWidth="10" @end="end"></smh-countDown>

methods: {
	end(){
		console.log('结束事件')
		//重新执行
		this.$refs.countDown.refresh()
	},
	pause(){
		//暂停
		this.$refs.countDown.pause()
	},
	play(){
		//继续
		this.$refs.countDown.play()
	}
}
```


## API

### smh-countDown  Props

|属性名	|类型		|默认值	|说明				|
|:-:	|:-:		|:-:	|:-:				|
|seciond	|Number		|10		|倒计时时间			|
|radius	|Number		|100		|圆形半径(rpx)	|
|fontSize	|Number		|	30	|中间文字的字体大小(rpx)			|
|color	|String		|	#0A84FF	|线条倒计时颜色			|
|bgcolor	|String		|	#f2f2f2	|线条背景色			|
|lineWidth	|Number		|	5	|线条宽度(rpx)			|

### smh-countDown Events
|事件名	|说明			|返回值|
|:-:	|:-:			|:-:  |
|@end|倒计时结束事件|-    |
|@refresh|重新执行倒计时|-    |
|@pause|暂停倒计时|-    |
|@play|恢复倒计时|-    |
