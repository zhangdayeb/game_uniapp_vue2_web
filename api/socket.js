import configService from '@/common/service/config.service.js'

/**
 * 默认 socket 连接任务
 */
class SocketTask {
	url = ''
	header = {
		'content-type': 'multipart/form-data',
	}
	method = 'POST'
	//谁创建谁使用，保证独立性
	socket = null
	//socket是否打开连接
	socketOpen = false
	constructor(url, method) {
		this.url = url
		this.method = method
	}
	//
	setHader(header) {
		this.header = header
	}
	
	/**
	 * 连接socket
	 **/
	connect() {
		this.socket = uni.connectSocket({
			url: this.url,
			header: this.header,
			method: this.method,
			success: (res) => {
			},
			fail: (res) => {
			}
		})
	}
	
	/**
	 * 监听打开socket
	 **/
	onOpen(callback) {
		this.socket.onOpen((res) => {
			this.socketOpen = true;
			callback(res)
			this.heartCheck()
			this.onClose(() => {
				this.socketOpen = false
			})
		});
	}
	
	//监听关闭socket
	onClose(callback) {
		this.socket.onClose((res) => {
			console.log('ws close',this.url)
			this.socketOpen = false
			callback(res)
		});
	}
	
	//监听socket出错
	onError(callback) {
		this.socket.onError((res) => {
			this.socketOpen = false
			callback(res)
			console.log('WebSocket连接打开失败，请检查！',this.url);
		});
	}
	
	/**
	 * 发送消息
	 * @param {msg} 消息内容 
	 */
	sendMsg(msg) {	
		this.socket.send({
			data: JSON.stringify(msg)
		});
	}
	
	/**
	 * 接收消息
	 */
	receiveMsg(callback) {
		this.socket.onMessage((res) => {
			callback(res)
		})
	}
	
	heartCheck() {
		setTimeout(() => {
			if(this.socketOpen) {
				this.socket.send({
					data: `{use_target:'heartbeat',post_position:'game'}`
				});
			}
			this.heartCheck()
		}, 30000) 
	}
	/**
	 * 关闭
	 */
	close() {
		this.socket.close({})
	}
}


export {
	SocketTask
}