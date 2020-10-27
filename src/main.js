import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import { message } from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import store from './store'
import Vuex from 'vuex'
import Valid from './utils/valid'

const app = createApp(App);
app.use(Antd);
app.use(router);
app.use(Vuex)
app.use(store)
app.config.globalProperties.$Valid = Valid;
app.config.globalProperties.$Message = message;
app.mount('#app')
