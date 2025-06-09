export function getUrlParams() {
  const params = {};
  
  // 获取当前页面的完整路径
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage && currentPage.options) {
    // 从页面参数中获取
    Object.assign(params, currentPage.options);
  }
  
  // 也可以从启动参数中获取（小程序场景）
  const launchOptions = uni.getLaunchOptionsSync();
  if (launchOptions && launchOptions.query) {
    Object.assign(params, launchOptions.query);
  }
  
  return params;
}