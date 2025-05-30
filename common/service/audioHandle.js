let AudioContextBackground = uni.createInnerAudioContext();
let AudioContextMusicEffec = uni.createInnerAudioContext();

// 背景音乐初始化 设置
AudioContextBackground.autoplay = true
AudioContextBackground.src = ''
AudioContextBackground.loop = false

// 音效初始化 设置
AudioContextMusicEffec.autoplay = true
AudioContextMusicEffec.src = ''
AudioContextMusicEffec.loop = false

//音乐类型 背景音乐  音效
const MUSIC_TYPE = {
	backgroundMusicState: 'backgroundMusicState',
	musicEffectSate: 'musicEffectSate',
	LivePageState:'LivePageState'
}

// 音频播放最重要的问题，需要人工手工触发一下，就是那个 welcome的触发按钮

let audioHandle = {
	// 变量定义
	audioPath:'bjl',
	backgroundMusicState:'on',
	musicEffectSate:'on',
	LivePageState:'show',
	backgroundAudioContext:AudioContextBackground,
	musicEffecAudioContext:AudioContextMusicEffec,
	// 函数定义
	/**
	 * 音效播放函数
	 */
	startSoundEffect(audioName) {
		audioHandle.musicEffectSate = uni.getStorageSync(MUSIC_TYPE.musicEffectSate) == 'off' ? 'off' : 'on'
		audioHandle.LivePageState = uni.getStorageSync(MUSIC_TYPE.LivePageState) == 'show' ? 'show' : 'hidden'

		// 不开启音效开关 
		if(audioHandle.musicEffectSate != 'on') {
			console.log("音效控制开关关闭，暂时无法播放")
			audioHandle.musicEffecAudioContext.pause()
			return
		}
		// 页面隐藏 不应该播放
		if(audioHandle.LivePageState != 'show') {
			console.log("页面隐藏 不应该播放")
			audioHandle.musicEffecAudioContext.pause()
			return
		}
		//音频
		audioHandle.musicEffecAudioContext.src = `/static/assets/audio/`+audioHandle.audioPath+`/${audioName}`
		audioHandle.musicEffecAudioContext.autoplay = true
		setTimeout(() => {
			audioHandle.musicEffecAudioContext.play()
		},150)
	},
	/**
	 * 音效播放函数
	 */
	startSoundBackground() {
		audioHandle.backgroundMusicState = uni.getStorageSync(MUSIC_TYPE.backgroundMusicState) == 'off' ? 'off' : 'on'
		
		// 不开启音效开关 
		if(audioHandle.backgroundMusicState != 'on') {
			// console.log("背景音乐控制开关关闭，暂时无法播放")
			audioHandle.backgroundAudioContext.pause()
			return
		}
		//音频
		audioHandle.backgroundAudioContext.src = `/static/assets/audio/bg001.mp3`
		audioHandle.backgroundAudioContext.autoplay = true
		setTimeout(() => {
			audioHandle.backgroundAudioContext.play()
		},150)
	},
}
// 句柄打印测试
// console.log('audioHandle.backgroundAudioContext:')
// console.log(audioHandle.backgroundAudioContext)
// console.log('audioHandle.musicEffecAudioContext:')
// console.log(audioHandle.musicEffecAudioContext)

// 导出
export default audioHandle
