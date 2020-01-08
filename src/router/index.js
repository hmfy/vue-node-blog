import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import {getStorageLogin, scrollAnimation} from "../assets/js/util";

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue')
    },
    {
        path: '/timeLine',
        name: 'timeLine',
        component: () => import('../views/TimeLine.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login')
    },
    {
        path: '/editBlog',
        name: 'editBlog',
        component: () => import('../views/EditBlog'),
        meta: {
            login: true // 路由守卫时告诉此条路由需要验证
        }
    },
    {
        path: '/blogDetail',
        name: 'blogDetail',
        component: () => import('../views/BlogDetail')
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    // 类似于enter
    // 路由全局守卫
    // 其中先执行 路由全局守卫, 其次是路由局部守卫, 最后是组件内守卫
    // !注意: beforeRouteEnter 是支持给 next 传递回调的唯一守卫

    // to.matched -> 数组,包含该条路径以及其所有的父级,父级的父级...路径
    // 例如路径 '/a/b/c'  包含 '/a/b/c' 和 '/a/b' 和 '/a'
    const loginNeed = to.matched.some(item => item.meta.login);
    if (loginNeed) {
        const vm = Vue.prototype;
        // 登录验证
        if (getStorageLogin()) {  // getStorageLogin 取登陆过后的缓存信息(页面刷新缓存还在)
            return next()
        }
        vm.$confirm('该页面需要登陆后才可查看,是否去登陆?', '温馨提示', {
            confirmButtonText: '好的',
            cancelButtonText: '算了',
            type: 'warning'
        }).then(() => {
            next("/login")
        }).catch(() => {
            next(from.path)
        });
    } else {
        let state = store.getters['home/getMyState'];
        let myState = sessionStorage.getItem('myState');
        if (to.path === '/home' || state || myState) {
            next()
        } else {
            next('/home')
        }
    }
    scrollAnimation()
});

export default router
