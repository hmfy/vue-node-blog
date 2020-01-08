<template>
    <el-row>
        <el-col :span="phone ? 1 : 3">
            <div class="grid-content bg-menu"></div>
        </el-col>
        <el-col :span="phone ? 22 : 18">
            <div class="grid-content" id="nav">
                <el-menu :default-active="$route.path"
                         class="el-menu-demo"
                         mode="horizontal">
                    <el-menu-item class="bg-personal" disabled index="0">
                        <h1 @click="handClick">杨帆的个人博客</h1>
                    </el-menu-item>
                    <el-menu-item index="/home">
                        <router-link tag="div" to="/home">首页</router-link>
                    </el-menu-item>
                    <el-menu-item index="/about">
                        <router-link tag="div" to="/about">关于</router-link>
                    </el-menu-item>
                    <el-menu-item index="/timeLine">
                        <router-link :to="{name: 'timeLine'}" tag="div">时间轴</router-link>
                    </el-menu-item>
                    <template v-if="isLogin && !phone">
                        <el-menu-item index="/editBlog">
                            <router-link to="/editBlog" tag="div">写文章</router-link>
                        </el-menu-item>
                    </template>
                    <el-menu-item index="/login" v-if="isLogin && !phone">
                        <router-link to="/login" tag="div">登陆页</router-link>
                    </el-menu-item>
                </el-menu>
            </div>
        </el-col>
        <el-col :span="phone ? 1 : 3">
            <div class="grid-content bg-menu"></div>
        </el-col>
    </el-row>
</template>

<script>
    import {mapState, mapGetters} from "vuex"
    export default {
        name: 'Nav',
        data() {
            return {

            };
        },
        computed: {
            ...mapState(["isLogin"]),
            ...mapGetters({
                phone: "getDeviceIsPhone"
            })
        },
        methods: {
            handClick () {
                if (this.$route.path !== '/home') {
                    this.$router.push("/home")
                }
            },

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .bg-menu {
        background: #fff;
    }

    .grid-content {
        height: 40px; /*覆盖导航栏高度 */
        border-bottom: solid 1px #e6e6e6;
    }

    /*覆盖导航栏高度 */
    .el-menu--horizontal > .el-menu-item {
        height: 40px;
        line-height: 40px;
    }

    .el-menu-item {
        padding: 0;
    }

    .el-menu-item>div {
        padding: 0 20px;
    }

    .bg-personal.el-menu-item.is-disabled {
        color: #000;
        cursor: pointer;
        opacity: 1;
        font-size: 16px;
        margin-right: 20px;
    }

    h1 {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        font-size: large;
        font-weight: bold;
    }
</style>
