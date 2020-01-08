<template>
    <el-form label-position="top" label-width="80px">
        <el-form-item label="账号">
            <el-input clearable v-model="user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input clearable show-password v-model="password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="submitForm" type="primary" class="phone-margin">登陆</el-button>
            <transition name="el-fade-in-linear">
                <el-button @click="outLogin" type="danger" v-if="isLogin">退出登陆</el-button>
            </transition>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapState, mapGetters} from "vuex"
    import {setStorageLogin} from "../assets/js/util";

    export default {
        name: "Login",
        data() {
            return {
                user: "",
                password: ""
            }
        },
        computed: {
            ...mapState(["isLogin"]),
            ...mapGetters({
                phone: "getDeviceIsPhone"
            })
        },
        methods: {
            getLogin (){
                return this.axios({
                    url: '/login',
                    params: {
                        user: this.user
                    }
                })
            },
            async submitForm() {
                if (this.isLogin) {
                    this.$message.warning("当前为登陆状态,请勿重复登陆!");
                    return
                }
                const res = await this.getLogin();
                const password = res.data[0].length && res.data[0][0].password;
                if (password && password === this.password) {
                    this.$message.success('登陆成功!');
                    /* 写入sessionStorage */
                    setStorageLogin(this.user, password);

                    /* 改变vuex登陆状态,便于后面查看(无需再每次从sessionStorage拿) */
                    this.$store.commit("setLogin", true);

                    // 清空输入框
                    this.user = "";
                    this.password = "";
                } else {
                    this.$message.error('账号密码错误');
                }
            },
            outLogin() {
                this.$confirm('确定退出登陆吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sessionStorage.clear(); // 清除sessionStorage缓存
                    this.$store.commit("setLogin", false); // 重置vuex状态
                    this.$message.warning('当前账号已退出!');
                }).catch(() => {
                    this.$message.info('已取消');
                });
            }
        },
        created() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                leftCol: this.phone ? 24 : 8
            });
        }
    }
</script>

<style scoped>

</style>