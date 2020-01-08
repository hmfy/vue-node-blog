import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
import home from "./home"
import about from "./about";
import time from "./time";
import blog from "./blog";

export default new Vuex.Store({
    strict: true, // 上线时关闭
    state: {
        cloudTags: true,
        leftCol: 16,
        lineList: false,
        submitBlog: false,
        isLogin: false,
        ip: ''
    },
    mutations: {
        setLeftTagsLine (state, {leftCol = 16, cloudTags = false, lineList = false, submitBlog = false}) {
            // 参数解构赋值加默认值写法
            /*
            * 设置内容区大小,标签云隐藏/展示......
            * */
            state.leftCol = leftCol;
            state.cloudTags = cloudTags;
            state.lineList = lineList;
            state.submitBlog = submitBlog;
        },
        setLogin (state, data) {
            state.isLogin = data;
        },
        updateIp (state, data) {
            state.ip = data;
        }
    },
    getters: {
        getDeviceIsPhone (state) {
            return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
        },
        getIP (state) {
            const ip = sessionStorage.getItem('ip');
            return state.ip || ip;
        }
    },
    actions: {},
    modules: {
      home,
      about,
      time,
      blog
    }
})
