import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

// elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// editor样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 代码高亮风格
import 'highlight.js/styles/atom-one-dark.css'

// 登陆状态获取
import {isLogin} from './assets/js/util'

import moment from 'moment'

//全局样式重置
import '../src/assets/css/reset.css'

// 生产状态下信息提示
Vue.config.productionTip = false;

// axios请求默认url
axios.defaults.baseURL = 'https://127.0.0.1';

// 全局引入日期格式化函数
moment.locale('zh-cn');
Vue.prototype.$date_format = function (date) {
    return moment(date).format('lll') // 2020年1月5日 00:54 全局默认用这种格式
};

//库注入(全局使用)
Vue.use(ElementUI);
Vue.use(VueAxios, axios);

//初始化
new Vue({
    router,
    store,
    render: function (h) {
        return h(App)
    },
    beforeCreate() {
        isLogin().then(res => {
            if (res) {
                /* 当前为登陆状态,写入vuex */
                store.commit("setLogin", true);
            }
        });
    }
}).$mount('#app');