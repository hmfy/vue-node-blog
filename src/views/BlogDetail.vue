<template>
    <div class="blog-detail">
        <el-card class="box-card">
            <div class="blog-title">
                <h1>{{ currentArticle.title }}</h1>
                <p>
                    <span class="reset-left-margin">{{ $date_format(currentArticle.ctime) }}</span>
                    <el-divider direction="vertical" v-if="!phone"/>
                    <br v-if="phone">
                    <span :class="{'reset-left-margin': phone}">阅读 {{ currentArticle.views || 0 }}</span>
                    <el-divider direction="vertical"/>
                    <span>评论 {{ currentArticle.commentCount }}</span>
                    <el-divider direction="vertical"/>
                    <el-tag type="success" v-for="tag in currentArticle.tags.split(',')">{{ tag }}</el-tag>
                </p>
            </div>
            <div class="ql-snow">
                <div class="ql-editor" v-html="currentArticle.content"></div>
            </div>
            <div class="blog-reply-good">
                <el-tooltip effect="light" :content="goodContent" placement="top-start">
                    <span class="self-good" :class="{'is-active': goodState && !readyGood, 'is-ready': goodState && readyGood}" @click="updateGoods"></span>
                </el-tooltip>
                ({{ currentArticle.good || 0 }})
                <el-divider direction="vertical"/>
                <span @click="changeState">评论</span>
            </div>
        </el-card>
        <!--评论区-->
        <comments :arId="articleId" :commentId="getCommentId" :refresh="commentState"/>
        <!--留言板-->
        <edit-comments :arId="articleId" :refresh="commentState" @refreshComments="updateList" v-on="$listeners"/>
    </div>
</template>

<script>
    import Comments from "../components/Comments";
    import EditComments from "../components/EditComments";
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                currentArticle: {
                    title: '',
                    content: '',
                    views: 0,
                    ctime: '2019-01-01',
                    tags: '',
                    commentCount: ''
                },
                articleId: 0,
                commentState: false,
                goodState: false,
                goodContent: '来点个赞吧~',
                readyGood: false
            }
        },
        components: {
            Comments,
            EditComments
        },
        computed: {
            ...mapGetters({
                phone: "getDeviceIsPhone"
            }),
            ...mapGetters({
                ip: "getIP"
            }),
            getCommentId () {
                return this.$route.params["commentId"];
            }
        },
        provide() {
            return {
                scrollReply: this.scrollReply
            }
        },
        name: "blogDetail",
        methods: {
            changeState() {
                this.$store.commit("blog/updateCommentState", {});
                this.scrollReply();
            },
            scrollReply() {
                const offsetHeight = document.documentElement.offsetHeight;
                const windowHeight = window.innerHeight;

                function step() {
                    window.scrollTo(0, window.scrollY + 40);
                    if (window.scrollY < offsetHeight - windowHeight) {
                        requestAnimationFrame(step);
                    }
                }

                requestAnimationFrame(step);
            },
            async updateList(state) {
                this.commentState = state; // 提交组件提及时触发父级事件改变状态,被另一子组件监听到

                const res = await this.getArticleDetail();
                const result = res.data[0].length && res.data[0][0];
                this.currentArticle.commentCount = result.commentCount;
            },
            addGood () {
                // 更新点赞数
                return this.axios({
                    method: 'post',
                    url: '/updateGoods',
                    data: {
                        ip: this.ip,
                        id: this.articleId,
                        vTime: new Date().getTime(),
                        type: 1 //暂时只开放文章点赞(1为文章,2为评论)
                    }
                })
            },
            async updateGoods () {
                try {
                    if (this.goodState) {
                        // 您已经点过赞咯!
                        // 弹窗提示

                    } else {
                        this.goodState = true;
                        this.goodContent = '您已经点过赞了哟~';
                        await this.addGood();
                        const res = await this.getArticleDetail();
                        const result = res.data[0].length && res.data[0][0];
                        this.currentArticle.good = result.good;
                        // 点赞动画开始
                    }
                }catch (e) {
                    console.log(e)
                }
            },
            getArticleDetail () {
                // 获取文章详细信息
                return this.axios({
                    url: '/getArticleDetail',
                    params: {
                        id: this.articleId
                    }
                })
            },
            getReader() {
                // 获取读者基本信息(24小时内是否阅读过)
                return this.axios({
                    url: '/getViewsInfo',
                    params: {
                        ip: this.ip,
                        id: this.articleId
                    }
                })
            },
            updateViews() {
                // 更新文章阅读量以及blog_views表(暂时还没想好)
                this.axios({
                    method: 'post',
                    url: '/setViews',
                    data: {
                        ip: this.ip,
                        id: this.articleId,
                        vTime: new Date().getTime()
                    }
                })
            }
        },
        async created() {
            let id = this.$route.params["id"];
            if (id) {
                sessionStorage.setItem("currArticle", id);
            } else {
                id = sessionStorage.getItem("currArticle");
            }
            this.articleId = id;

            try {
                const res = await this.getArticleDetail();
                const result = res.data[0].length && res.data[0][0];
                this.currentArticle.commentCount = result.commentCount;
                this.currentArticle = result;
                this.currentArticle.title = result.title;
                this.currentArticle.content = result.content;
                this.currentArticle.views = result.views;
                this.currentArticle.tags = result.tags;
                this.currentArticle.good = result.good;
                this.currentArticle.ctime = result.ctime;
            }catch (e) {
                console.log(e)
            }
        },
        async beforeMount() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                leftCol: 24
            });

            // 文章阅读量更新操作...
            try {
                const readerResult = await this.getReader();
                const data = readerResult.data[0];
                if (readerResult.data[1].length) {
                    // 当前用户已经点赞过(限IP)
                    this.goodState = true;
                    this.goodContent = '您已经点过赞了哟~';
                    this.readyGood = true;
                }
                if (data.length) {
                    const vTime = data[0]['vtime'];
                    let difference = (new Date().getTime() - vTime) / 1000 / 60 / 60;
                    if (difference > 24) {
                        // 一天内的阅读次数只算一次
                        await this.updateViews();
                    }
                } else {
                    await this.updateViews();
                }
            }catch (e) {
                console.log(e)
            }
        }
    }
</script>

<style scoped>
    .box-card:nth-of-type(2) {
        margin-top: 20px;
    }

    .blog-reply-good {
        padding-right: 15px;
        text-align: right;
        cursor: pointer;
    }

    .blog-reply-good > span:hover {
        color: #409EFF;
    }

    .blog-title {
        padding-left: 15px;
    }

    .blog-title > h1 {
        font-size: 30px;
        font-weight: bold;
        padding: 15px 0 10px 0;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }

    .blog-title > p {
        border-bottom: 1px solid #dedede;
        padding-bottom: 5px;
    }

    .blog-title > p > span {
        line-height: 1.5;
        color: #969696;
    }

    .blog-title > p > .el-tag {
        line-height: 17px;
        height: 20px;
        padding: 0 5px;
        margin-left: 5px;
        color: #67c23a;
    }

    .blog-title > p > span.reset-left-margin {
        margin-left: 0;
    }

    .blog-reply-good span.self-good {
        display: inline-block;
        width: 65px;
        vertical-align: bottom;
        height: 65px;
        background: url("../assets/img/heart.png") no-repeat;
        background-position: -15px -10px;
        transform: scale(0.6) translate(23px, 33px);
        cursor: pointer;
        -webkit-transition: background-position 1s steps(28);
        transition: background-position 1s steps(28);
        -webkit-transition-duration: 0s;
        transition-duration: 0s;
    }

    .blog-reply-good span.self-good.is-ready {
        background-position: -2815px -10px;
    }

    .blog-reply-good span.self-good.is-active {
        -webkit-transition-duration: 1s;
        transition-duration: 1s;
        background-position: -2815px -10px;
    }
</style>