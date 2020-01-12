<template>
    <div>
        <div v-if="itemList.length">
            <div class="row" v-for="item in itemList" :key="item.id">
                <article-item :article="item"/>
            </div>
            <transition name="el-fade-in-linear">
                <div v-show="!busy && count < totalBlog"
                     v-loading="true"
                     element-loading-text="拼命加载中"
                     style="height: 100px">
                </div>
            </transition>
        </div>
        <div v-else class="empty-show">
            这里空空如也,赶紧去创作吧...
        </div>
    </div>
</template>

<script>
    import ArticleItem from "../components/ArticleItem";
    import {mapGetters, mapState, mapMutations} from "vuex";

    export default {
        data(){
          return {
              itemList: []
          }
        },
        components: {
            ArticleItem
        },
        methods: {
            ...mapMutations('home', ["updateBusy"]),
            getArticleList (count, callback = ()=>{}) {
                callback(); // 改变busy,滚动不加载
                this.axios({
                    url: '/getArticleListLazy',
                    params: {
                        myCount: count,
                        filterBlog: this.filterBlog
                    }
                }).then(res => {
                    this.itemList.length = 0;
                    res.data.forEach(ele=>{
                        ele.content = ele.content.substr(0, 200);
                        ele.ctime = this.$date_format(ele.ctime);
                        ele.utime = ele.utime && this.$date_format(ele.utime);
                        this.itemList.push(ele);
                    });
                    callback(); // 改变busy,滚动继续加载
                    console.log(this.busy, this.count, this.totalBlog)
                }).catch(err => {
                    console.log(err);
                    callback(); // 改变busy,滚动继续加载
                })
            }
        },
        watch: {
            count (val) {
                if (val > this.totalBlog) {
                    return
                }
                // 根页面滚动了,开始请求文章
                this.getArticleList(val, this.updateBusy)
            },
            filterBlog () {
                this.getArticleList(this.count);
                this.$listeners["initBlogLength"](); // 重置totalBlog
                this.$store.commit('home/updateCount', 5); // 重置count
            }
        },
        computed: {
            ...mapGetters({
                phone: "getDeviceIsPhone"
            }),
            ...mapGetters("home", ["noMore"]),
            ...mapState("home", ["count", "busy", "totalBlog", "filterBlog"])
        },
        created() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                cloudTags: !this.phone,
                leftCol: this.phone ? 24 : 16
            });
            this.getArticleList(this.count);
        }
    }
</script>

<style scoped>
    .row {
        margin-bottom: 20px;
    }

    .empty-show {
        color: #909399;
    }
</style>
