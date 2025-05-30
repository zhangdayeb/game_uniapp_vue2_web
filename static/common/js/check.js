(function(){
	console.log('App login state check.js: check user Login state is open')
	let checkTime = 1000 * 1 	// 多长时间检测一次
	setInterval("checkUserLoginState()",checkTime)
})()
function checkUserLoginState(){
	// console.log("App login state i am checking")
	// 备注说明 ，除了 login 页面，其它页面都会 只要是有点击，就会记录这个时间的
	let loginTimeStart = 0
	loginTimeStart = localStorage.getItem('loginStartTime')?localStorage.getItem('loginStartTime'):0
	if(loginTimeStart == 0){
		return
	}
	loginTimeStart = JSON.parse(loginTimeStart)
	loginTimeStart = loginTimeStart.data
	let userMaxStateTime = 1000 * 60 * 10	// 用户最大 不操作可以带着的 时间
	if(loginTimeStart){
		// 展示
		// console.log("App login state PKing")
		// console.log('App login state loginTimeStart time:',loginTimeStart)
		// console.log('App login state now time:',new Date().getTime())
		// console.log('App login state cha:',(new Date().getTime() - loginTimeStart))
		let Cha = Number(new Date().getTime() - loginTimeStart)
		// 计算 
		let maXTime = Number(Number(loginTimeStart)  + Number(userMaxStateTime))
		let NTime = Number(new Date().getTime())
		// 存储 方便调试
		localStorage.setItem('timeSub','{"type":"number","data":'+Cha+'}')
		// 比较
		if(maXTime < NTime){
			console.log("App login state exit!")
			window.location.href = "/";
		}else{
			console.log("App login state continue!")
		}
	}else{
		console.log("App login state in Loging vue")
	}
}
