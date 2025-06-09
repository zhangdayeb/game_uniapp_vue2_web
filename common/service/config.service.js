//下注区域地址
let BASE_URL         = ''
let BET_URL         = 'https://bet2.wuming888.com'

// api 地址源头
let USER_URL 		= 'https://userapi.wuming888.com'
let BJL_URL 		= 'https://bjlapi.wuming888.com'
let TIGER_URL 		= 'https://tigerapi.wuming888.com'
let CATTLE_URL 		= 'https://cattleapi.wuming888.com'
let THREE_URL 		= 'https://threeapi.wuming888.com'
let SICBO_URL 		= 'https://sicbopi.wuming888.com'

// ws 地址的 url		主网 此处的 ws 其实是 newws
let WS_URL 			= 'wss://wss.wuming888.com'
let USER_WS_URL 	= 'wss://wssuser.wuming888.com'
let BJL_WS_URL 		= 'wss://wssbjl.wuming888.com'
let LH_WS_URL 		= 'wss://wsslh.wuming888.com'
let NN_WS_URL       = 'wss://wssnn.wuming888.com'
let THREE_WS_URL    = 'wss://wssthree.wuming888.com'
let SICBO_WS_URL    = 'wss://wsssicbo.wuming888.com'

//露珠地址  
let LZ_BJL_URL_LIST		= 'https://h5lzv3.wuming888.com/zh/bjl_xc_list_678.html'
let LZ_LH_URL_LIST		= 'https://h5lzv3.wuming888.com/zh/lh_xc_list_99.html'
let LZ_NN_URL_LIST 		= 'https://h5lzv3.wuming888.com/zh/list_niu.html'
let LZ_THREE_URL_LIST 	= 'https://h5lzv3.wuming888.com/zh/list_three.html'
let LZ_SICBO_URL_LIST 	= 'https://h5lzsicbo.wuming888.com/zh/sicbo_xc_list.html'

let LZ_BJL_URL_MAIN		= 'https://h5lzv3.wuming888.com/zh/bjl_xc_big_678.html'
let LZ_LH_URL_MAIN 		= 'https://h5lzv3.wuming888.com/zh/lh_xc_big_99.html'
let LZ_NN_URL_MAIN 		= 'https://h5lzv3.wuming888.com/zh/list_niu.html'
let LZ_THREE_URL_MAIN 	= 'https://h5lzv3.wuming888.com/zh/list_three.html'
let LZ_SICBO_URL_MAIN 	= 'https://h5lzsicbo.wuming888.com/zh/sicbo_xc_big.html'

let LZ_BJL_URL_DIANTOU		= 'https://h5lzv3.wuming888.com/zh/bjl_xc_big_678_diantou.html'
let LZ_LH_URL_DIANTOU		= 'https://h5lzv3.wuming888.com/zh/lh_xc_big_99_diantou.html'
let LZ_NN_URL_DIANTOU		= 'https://h5lzv3.wuming888.com/zh/list_niu.html'
let LZ_THREE_URL_DIANTOU 	= 'https://h5lzv3.wuming888.com/zh/list_three.html'
let LZ_SICBO_URL_DIANTOU 	= 'https://h5lzsicbo.wuming888.com/zh/sicbo_xc_diantou.html'



// 生产环境配置
if (process.env.NODE_ENV == 'development') {
    BASE_URL = `${USER_URL}/` // 开发环境
} else {
	BASE_URL = `${USER_URL}/` // 生产环境
}
let staticDomainURL = BASE_URL+ '/sys/common/static';

// 发送
const configService = {
	sourceUrl: LZ_NN_URL_MAIN,					// 其它API请求地址
	staticDomainURL: staticDomainURL,			// 静态资源地址
	userUrl:USER_URL,
	betUrl: BET_URL,
	

	bjlUrl: BJL_URL,                          //百家乐地址
	cattleUrl: CATTLE_URL,                    //牛牛地址
	tigerUrl: TIGER_URL,                      //龙虎地址
	threeUrl: THREE_URL,
	sicboUrl: SICBO_URL,

	
	lzBjlUrl: LZ_BJL_URL_LIST,					// 百家乐 列表露珠地址
	lzLhUrl: LZ_LH_URL_LIST,					// 龙虎 列表露珠地址
	lzNnUrl: LZ_NN_URL_LIST,					// 牛牛 列表露珠地址
	lzThreeUrl: LZ_THREE_URL_LIST,				// 三公 列表露珠地址
	lzSicboUrl: LZ_SICBO_URL_LIST,				// 三公 列表露珠地址
	
	lzBjlUrlMain: LZ_BJL_URL_MAIN,				// 百家乐 游戏朱界面 露珠地址
	lzLhUrlMain: LZ_LH_URL_MAIN,				// 龙虎 游戏朱界面 露珠地址
	lzNnUrlMain: LZ_NN_URL_MAIN,				// 牛牛 游戏朱界面 露珠地址
	lzThreeUrlMain: LZ_THREE_URL_MAIN,			// 牛牛 游戏朱界面 露珠地址
	lzSicboUrlMain: LZ_SICBO_URL_MAIN,			// 牛牛 游戏朱界面 露珠地址
	
	lzBjlUrlDianTou: LZ_BJL_URL_DIANTOU,				// 百家乐 游戏朱界面 露珠地址
	lzLhUrlDianTou: LZ_LH_URL_DIANTOU,				// 龙虎 游戏朱界面 露珠地址
	lzNnUrlDianTou: LZ_NN_URL_DIANTOU,				// 牛牛 游戏朱界面 露珠地址
	lzThreeUrlDianTou: LZ_THREE_URL_DIANTOU,			// 牛牛 游戏朱界面 露珠地址
	lzSicboUrlDianTou: LZ_SICBO_URL_DIANTOU,			// 牛牛 游戏朱界面 露珠地址
	
	wsUrl:WS_URL,								// ws 连接的地址
	bjlWsUrl: BJL_WS_URL,                       // 百家乐ws 连接的地址
	lhWsUrl: LH_WS_URL,                       	// 龙虎ws 连接的地址
	nnWsUrl: NN_WS_URL,                       	// 牛牛ws 连接的地址
	threeWsUrl: THREE_WS_URL,					// 三公ws 连接的地址
	sicboWsUrl: SICBO_WS_URL,					// 三公ws 连接的地址
	userWsUrl: USER_WS_URL,                     // 用户信息ws 连接的地址
	
	betSicboUrl: 'https://betsicbo.wuming888.com',

};
// 默认表达
export default configService
