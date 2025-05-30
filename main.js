import Vue from 'vue';
import App from './App';
import store from './store';
import tip from'./common/util/tip.js'
import OtherPlace from '@/components/otherPlace'
import Maintain from '@/components/maintain/maintain.vue'
import maintainState from '@/common/service/maintainState'

App.mpType = 'app';						// 基础程序类型设置 为了区分小程序 与 大程序
Vue.config.productionTip = false;		// 类型提示



// request请求
import { http } from '@/common/service/service.js' 
// Vue.prototype.$innerAudioContext = innerAudioContext // 音频组件，因为只有 game 页面使用，所以就不做成全局的了
Vue.prototype.$http = http		// http api 请求
Vue.prototype.$store=store;		// store 普通存储
Vue.prototype.$tip=tip;			// tip 普通提示
Vue.prototype.$version= `1.2.28 © Copyright 2020-2022`;			// 版本号
Vue.prototype.$maintainState = maintainState  //维护状态
Vue.prototype.$WEB_MAINTAIN_STATE = '1' //维护状态 1维护中

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);
Vue.use(OtherPlace);

Vue.component('Maintain',Maintain)



// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

// i18n部分的配置
// 引入语言包，注意路径
import Chinese from '@/common/locales/zh.js';
import English from '@/common/locales/en.js';
import Japanese from '@/common/locales/jpn.js';
import Korean from '@/common/locales/kor.js';
import Thai from '@/common/locales/tha.js';
import Vietnamese from '@/common/locales/vnm.js';

// VueI18n
import VueI18n from '@/common/vue-i18n.min.js';
//缓存选择的语言
let storageLan = uni.getStorageSync('language') ? uni.getStorageSync('language') : 'zh'
Vue.prototype.$storageLan = storageLan;

// VueI18n
Vue.use(VueI18n);

const i18n = new VueI18n({
	// 默认语言
	locale: 'zh',
	// 引入语言文件
	messages: {
		'zh': Chinese,
		'en': English,
		'jpn': Japanese,
		'kor': Korean,
		'tha': Thai,
		'vnm': Vietnamese,
	}
});

// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
Vue.prototype._i18n = i18n;
//如果不想引入就用全局的语言
Vue.prototype.$locales =  i18n.messages[storageLan]

const app = new Vue({
	i18n,
	store,
	...App
});


app.$mount();
