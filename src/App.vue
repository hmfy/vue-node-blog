<template>
    <div id="app"
         style="overflow: auto"
         v-infinite-scroll="load"
         infinite-scroll-disabled="disabled"
         infinite-scroll-distance="100"
         infinite-scroll-delay="50">
        <el-container>
            <!--顶部导航-->
            <el-header height="40px">
                <div class="my-nav">
                    <Nav/>
                </div>
            </el-header>
            <!--内容区-->
            <el-main>
                <el-row>
                    <!--左-->
                    <el-col :span="phone ? 1 : 3">
                        <div class="grid-content"></div>
                    </el-col>
                    <!--中-->
                    <el-col :span="phone ? 22 : 18">
                        <div class="bg-white">
                            <el-row :gutter="20">
                                <!--左-->
                                <el-col :span="leftCol">
                                    <div class="grid-left">
                                        <router-view @initBlogLength="initVuexData" @refreshHome="refreshSelf"/>
                                    </div>
                                </el-col>
                                <!--右-->
                                <el-col :span="8" v-show="cloudTags">
                                    <div class="grid-right" ref="scroll">
                                        <tags-cloud :tags="tagsList"/>
                                        <new-article :articles="newArticles"/>
                                        <new-comments :comments="newComments"/>
                                    </div>
                                </el-col>
                                <el-col :span="8" v-show="lineList" class="_fixed">
                                    <div class="grid-right">
                                        <line-list></line-list>
                                    </div>
                                </el-col>
                                <el-col :span="phone ? 24 : 8" v-show="submitBlog">
                                    <div class="grid-right">
                                        <submit-blog @refreshHome="refreshSelf"/>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <!--右-->
                    <el-col :span="phone ? 1 : 3">
                        <div class="grid-content"></div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Nav from './components/Nav'
    import {mapGetters, mapState} from "vuex";
    import NewArticle from "./components/NewArticle"
    import NewComments from "./components/NewComments"
    import TagsCloud from "./components/TagsCloud"
    import LineList from "./components/LineList"
    import SubmitBlog from "./components/SubmitBlog";

    export default {
        data(){
          return {
              tagsList: [],
              newComments: [],
              newArticles: []
          }
        },
        components: {
            Nav,
            SubmitBlog,
            NewArticle,
            NewComments,
            TagsCloud,
            LineList
        },
        methods: {
            fixRight ({elem, width}) {
                elem.style.width = `${width}px`;
                elem.style.position = 'fixed';
            },
            load () {
                // 通知home组件请求文章列表
                let count = this.count + 1;
                this.$store.commit('home/updateCount', count);
            },
            loopInit (targetArr, originArr) {
                targetArr.forEach(ele => {
                    originArr.push(ele);
                })
            },
            getRightInfo () {
                this.axios({
                    url: '/getRightInfo'
                }).then(res => {
                    if (res.data.length) {
                        const data = res.data;
                        this.loopInit(data[0], this.tagsList);
                        this.loopInit(data[1], this.newComments);
                        this.loopInit(data[2], this.newArticles);
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            refreshSelf () {
                const {newComments, tagsList, newArticles} = this;
                newComments.length = 0;
                tagsList.length = 0;
                newArticles.length = 0;
                this.getRightInfo();
            },
            async initVuexData () {
                // 对vuex中要通过异步进行初始化的操作都写在这里
                // 后面对url进行路由守卫,未进入首页前不允许进入其页面
                // 以此来保证异步数据的初始化完成;
                // 注意子页面数据要与sessionStorage同步
                const store = this.$store;

                // vuex配合路由守卫防止首次直接输入url进入文章详情页
                store.commit('home/updateMyState', true);
                sessionStorage.setItem('myState', 'true');

                // 博客数量初始化
                this.axios({
                    url: '/initVuex',
                    params: {
                        tags: this.filterBlog
                    }
                }).then(res => {
                    let blogLength =  res.data[0][0]['blogLength'];
                    store.commit('home/initVuex', {
                        blogLength
                    });
                    sessionStorage.setItem('blogLength', blogLength.toString());
                }).catch(err => {
                    console.log(err)
                });

                // ip地址初始化
                let ip = this.$returnCitySN()['cip'];
                store.commit('updateIp', ip);
                sessionStorage.setItem('ip', ip.toString());
            }
        },
        computed: {/*
            mapState是一个由state对应的函数(每次读取state会执行该函数返回并state)组成的对象;
            若只需要用state里的值进行初始化(不关心后续state的变化),
            则可使用this.$store.state的形式进行取值
            */
            ...mapState(["cloudTags", "leftCol", "lineList", "submitBlog"]),
            ...mapGetters({
                phone: "getDeviceIsPhone"
            }),
            listenScroll () {
                let elem = this.$refs['scroll'];
                let width = elem.offsetWidth;
                return {elem,  width}
            },
            ...mapGetters({
                phone: "getDeviceIsPhone"
            }),
            ...mapGetters("home", ["disabled"]),
            ...mapState("home", ["count", "filterBlog"])
        },
        mounted() {
            this.fixRight(this.listenScroll);
        },
        created() {
            this.initVuexData();
            this.getRightInfo();
        }
    }
</script>

<style scoped>
    /* 背景色 */
    .el-container {
        --gradient-start: #F0EFF0;
        --gradient-start-text: '#F0EFF0';
        --gradient-end: #FAF8F9;
        --gradient-end-text: '#FAF8F9';
        background: linear-gradient(33deg, var(--gradient-start), var(--gradient-end));
    }

    .el-header {
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }

    .el-main {
        padding-bottom: 20px;
        padding-top: 20px;
        overflow: visible;
        min-height: 900px;
    }

    .my-nav {
        position: fixed;
        width: 100%;
        z-index: 999;
    }

    .grid-left {
        min-height: 1px; /*防止切换博客时内容坍塌*/
    }

    .grid-content {
        height: 1px;
    }

    ._fixed {
        position: fixed;
        right: 3%;
    }

    /*
    bg
    */

    .bg-purple {
        --gradient-start: #A16BFE;
        --gradient-start-text: '#A16BFE';
        --gradient-end: #DEB0DF;
        --gradient-end-text: '#DEB0DF';
        background: linear-gradient(33deg, var(--gradient-start), var(--gradient-end));
    }

    .test {
        height: 200px;
        border: 1px solid #000000;
    }
</style>

<style>
    /* 隐藏body滚动条 */
    #app::-webkit-scrollbar,
    body::-webkit-scrollbar{
        display: none;
    }
    #app,
    body,
    html {
        height: 100%;
        overflow: auto;
    }
</style>
