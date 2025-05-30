//音乐类型 背景音乐  音效
const MUSIC_TYPE = {
	backgroundMusicState: 'backgroundMusicState',
	musicEffectSate: 'musicEffectSate',
	LivePageState:'LivePageState'
}

//音频
function AudioHandle() {
	//音频路径
	this.audioPath = ''
	//背景音乐状态
	this.backgroundMusicState = 'on'
	//音效状态
	this.musicEffectSate = 'on'
	//当前页面显示状态
	this.livePageState = 'show'
	//检测是否播放
	this.backgroundAudioPlayState = false
	this.backgroundAudioContext = uni.createInnerAudioContext()
	// 背景音乐初始化 设置
	
	this.backgroundAudioContext.src = '/static/assets/audio/bg001.mp3'
	this.backgroundAudioContext.loop = true
	
	this.musicEffecAudioContext = uni.createInnerAudioContext()
	this.musicEffecAudioContext.autoplay = true
	// 音效初始化 设置
	this.musicEffecAudioContext.src = ''
	
	//音效
	this.startSoundEffect = (audioName) => {
		this.musicEffectSate = uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
		this.livePageState = uni.getStorageSync(MUSIC_TYPE.LivePageState) == 'show' ? 'show' : 'hidden'
		
		// 不开启音效开关
		if(this.musicEffectSate != 'on') {
			console.log("音效控制开关关闭，暂时无法播放")
			console.log(this.musicEffecAudioContext)
			this.musicEffecAudioContext.pause()
			return false
		}
		// 页面隐藏 不应该播放
		if(this.livePageState != 'show') {
			console.log("页面隐藏 音效不应该播放")
			this.musicEffecAudioContext.pause()
			return false
		}
		//音频 重新创建
		if(this.musicEffecAudioContext){
			this.musicEffecAudioContext.destroy()
			this.musicEffecAudioContext = uni.createInnerAudioContext()
			this.musicEffecAudioContext.autoplay = true
			this.musicEffecAudioContext.src = `/static/assets/audio/`+this.audioPath+`/${audioName}`
		}

		setTimeout(() => {
			this.musicEffecAudioContext.play()
		},150)
	}
	//关闭音效
	this.closeSoundEffect = () => {
		this.musicEffecAudioContext.pause()
	} 
	
	//背景音乐
	this.startSoundBackground = () => {
		this.backgroundMusicState = uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on'
		// 不开启音效开关
		if(this.backgroundMusicState != 'on') {
			console.log("背景音乐控制开关关闭，暂时无法播放")
			this.backgroundAudioContext.pause()
			return
		}
		// 页面隐藏 不应该播放
		if(this.livePageState != 'show') {
			console.log("页面隐藏 背景不应该播放")
			this.backgroundAudioContext.pause()
			return
		}
		//音频 重新创建
		if(this.backgroundAudioContext){
			this.backgroundAudioContext.destroy()		
			this.backgroundAudioContext = uni.createInnerAudioContext()
			this.backgroundAudioContext.loop = true
			this.backgroundAudioContext.src = '/static/assets/audio/bg001.mp3'
		}
		
		
		// 背景音乐初始化 设置
		this.backgroundAudioPlayState = false
		let timer = null
		this.backgroundAudioPlay(timer)
	}
	/**
	 * 兼容苹果播放
	 * @param time 定时器  
	 **/
	this.backgroundAudioPlay = (timer) => {
		if(this.backgroundAudioPlayState) {
			clearTimeout(timer)
			return
		}
		timer = setTimeout(() => {
			this.backgroundAudioContext.play()
			this.backgroundAudioPlay(timer)
		}, 500)
		this.backgroundAudioContext.onPlay(() => {
			this.backgroundAudioPlayState = true
		});
	}
	/**
	 * 关闭背景音乐
	 */
	this.closeSoundBackground = () => {
		this.backgroundAudioContext.pause()
	}
	
}

export default AudioHandle