// 基于axios封装网络请求
import theAxios from 'axios'
import router from '@/router'
import { Notify } from 'vant'
import { getToken, removeToken } from '@/utils/token'
const axios = theAxios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000 // 20秒超时时间（请求20秒无响应直接判定超时）
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // ?. 可选链操作符，如果前面对象里没有length，整个表达式原地返回undefined
  // 如果gettoken（）在原地有值token字符串，才能调用
  if(getToken()?.length > 0 && config.headers.Authorization === undefined) {
    // api/index.js里接口的请求头
    config.headers.Authorization =`Bearer ${getToken()}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  if(error.response.status === 401) {
    // 不能使用this.$router（因为this不是vue组件对象无法调用$router）
    Notify({type: 'warning', message: '身份已过期'})
    removeToken() // 清除token ，才能让路由守卫放开权限去登录页
    router.replace('/login')
  }
  return Promise.reject(error);
});

//  导出自定义函数，参数对象解构赋值
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
