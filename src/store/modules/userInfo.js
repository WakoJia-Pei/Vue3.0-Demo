/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-23
 **/
import { login } from '@/utils/api'
const userInfo = {
  namespaced: true,
  state: {
    data: {},
    isLogined: false
  },

  getters: {
    userInfo: state => {
      return state.data
    }
  },

  mutations: {
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.data = userInfo
      state.isLogined = true
    },
    // 清除用户信息
    clearUserInfo(state,info) {
      state.data = info
      state.isLogined = false
    },
    // 修改用户信息
    modifyUserInfo(state, newInfo) {
      state.data = Object.assign(state.data, newInfo)
    },
    // 保存自动登录
    setAutoLogin(state, isLogin) {
      state.isAutoLogin = isLogin
    }

  },

  actions: {
    // 保存用户信息
    saveInfo({ commit }, result) {
      commit('setUserInfo', result)
    },
    // 保存自动登录
    saveAutoLogin({ commit }, isLogin) {
      commit('setAutoLogin', isLogin)
    },
    login({ commit }, userInfo) {
      login(userInfo).then(res => {
        commit('setUserInfo', res.data)
      })
    },
    // 退出登录
    logout({commit}) {
      commit('clearUserInfo', {})
      location.href = '/login'
    }
  }
}

export default userInfo
