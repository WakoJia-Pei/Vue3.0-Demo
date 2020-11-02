/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-23
 **/
import { createStore } from 'vuex'
import userInfo from './modules/userInfo'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  modules: {
    userInfo
  },
  getters: {
    isLogined: state => {
      return state.userInfo.isLogined
    }
  },
  plugins: [createPersistedState({
    key: 'store',
    storage: window.localStorage,
  })]
})

export default store

