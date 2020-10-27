/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-23
 **/
import App from '../App.vue'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import userInfo from './modules/userInfo'
import createPersistedState from 'vuex-persistedstate'

const app = createApp(App)
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

app.use(store)

export default store

