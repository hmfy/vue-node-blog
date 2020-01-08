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

// 获取用户IP地址
export function getUserIP() {
    return new Promise((resolve, reject) => {
        let myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        let pc = new myPeerConnection({iceServers: []}),
            noop = function () {
            },
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

        function iterateIP(ip) {
            if (!localIPs[ip]) {
                resolve(ip);
            }
            localIPs[ip] = true;
        }

        pc.createDataChannel("");
        pc.createOffer().then(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });
            pc['setLocalDescription'](sdp, noop, noop);
        }).catch(function (reason) {
            reject(reason);
        });
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    });
}