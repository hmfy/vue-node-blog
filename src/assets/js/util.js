/*
*  公共工具包
*
* */
/*  查询账号密码 */
import axios from 'axios'

function getTrueUser() {
    return new Promise((resolve, reject) => {
        axios({
            url: '/login',
            params: {
                user: sessionStorage.getItem("__##user##__") || ""
            }
        }).then(res => {
            const result = res.data[0].length && res.data[0][0].password;
            resolve(result);
        }).catch(err => {
            reject(err);
        });

    });
}

/* 返回登陆状态,是or否 */
export async function isLogin() {
    const password = await getTrueUser();
    const passwordResult = password && sessionStorage.getItem("__##password##__") === password;
    return passwordResult
}

/* body回到顶部 */
export function scrollAnimation() {
    function step() {
        window.scrollTo(0, window.scrollY - 20);
        if (window.scrollY > 0) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/* 设置账号密码到缓存 */
export function setStorageLogin(user, password) {
    sessionStorage.setItem("__##user##__", user);
    sessionStorage.setItem("__##password##__", password);
}

/* 判断当前登陆状态 */
export function getStorageLogin() {
    const user = sessionStorage.getItem("__##user##__");
    const password = sessionStorage.getItem("__##password##__");
    return user && password
}


//时间戳格式化
export function timestampToTime(timestamp) {
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000 var date = new Date(timestamp*1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y + M + D + h + m + s;
}