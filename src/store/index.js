/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-23
 **/
import { createStore } from 'vuex'

const files = require.context('./modules', false, /\.js$/)
const modules = {}
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})
export default createStore({
  modules,
})
// import userInfo from './modules/userInfo'
// import createPersistedState from 'vuex-persistedstate'
//
// const store = createStore({
//   modules: {
//     userInfo
//   },
//   getters: {
//     isLogined: state => {
//       return state.userInfo.isLogined
//     }
//   },
//   plugins: [createPersistedState({
//     key: 'store',
//     storage: window.localStorage,
//   })]
// })
//
// export default store

