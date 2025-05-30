// API接口文件 - 提现账户管理
// 文件路径: /api/withdrawalAccount.js
import {http} from '@/common/service/service.js'


/**
 * 绑定提现账户
 * @param {Object} params 绑定参数
 */
export function bindWithdrawalAccount(params) {
	return http.post('/user/withdrawal/bind_account', params);
}


/**
 * 获取用户提现账户列表
 * @param {Object} params 查询参数
 */
export function getUserWithdrawalAccounts(params) {
	return http.post('/user/withdrawal/get_user_accounts', params);
}


/**
 * 提交提现申请
 */
export function submitWithdrawalRequest(params) {
    return http.post('/user/withdrawal/submit_request', params);
}



/**
 * 获取用户提现记录
 * @param {Object} params 查询参数
 * @param {string} params.status 状态筛选 'all'|'pending'|'processing'|'completed'|'rejected' 
 */
export function getWithdrawalRecords(params) {
    return http.post('/user/withdrawal/records', params);
}


