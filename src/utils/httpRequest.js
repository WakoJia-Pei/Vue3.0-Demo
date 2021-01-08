/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-23
 **/
import axios from 'axios'
import store from '../store'

// 创建实例
const apiUrl = '/api';
const service = axios.create({
  baseURL: apiUrl,
  timeout: 55000
})

// 请求拦截器
service.interceptors.request.use(config => {
  if (store.state.userInfo.data.token) {
    config.headers['authorization'] = store.getters['user/accessToken'];
  }

  return config;
}, error => {
  Promise.reject(error);
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log(response.data)
    // 抛出401错误，因为token失效，重新刷新页面，清空缓存，跳转到登录界面
    if (response.data.code === 401 || response.data.code === 403) {
      store.dispatch('userInfo/resetAll').catch(() => {});
    }

    return response.data;
  },
  error => {
    const { status } = error.response;

    if (status === 401 || status === 403) {
      store.dispatch('user/resetAll').catch(() => {})
    }

    return Promise.reject(error)
  }
)

export default service;
