import Vue from 'vue';
import maintainVue from './maintain.vue';
// 定义插件对象
const Maintain = {};
// vue的install方法，用于定义vue插件
Maintain.install = function(Vue, options) {
	const MessageTipInstance = Vue.extend(maintainVue);
	let currentInstance;
	const initInstance = () => {
		// 实例化vue实例
		currentInstance = new MessageTipInstance();
		document.body.appendChild(currentInstance.$mount().$el);
	};
	// 在Vue的原型上添加实例方法，以全局调用
	Vue.prototype.$maintainVue = {
		show(options) {
			if (!currentInstance) {
				initInstance();
			}
			if (typeof options === 'string') {
				currentInstance.content = options;
			} else if (typeof options === 'object') {
				Object.assign(currentInstance, options);
			}
			return currentInstance; // 为了链式调用
		}
	};
};
export default Maintain;