<template>
    <el-card class="box-card">
        <div class="reset-fix" slot="header">
            <span class="title" @click="readArticle">{{ article.title }}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="readArticle">阅读一下</el-button>
        </div>
        <div class="text">
            {{ getContent }}
        </div>
        <p class="article-info">
            <span>发布于 {{ article.ctime }}</span>
            <span v-if="article.views">浏览 ({{ article.views }})</span>
        </p>
    </el-card>
</template>


<script>
    export default {
        name: "ArticleItem",
        data() {
            return {

            }
        },
        methods: {
            readArticle () {
                this.$router.push({
                    name: 'blogDetail',
                    params: {
                        id: this.article["id"]
                    }
                });
            }
        },
        computed: {
            article () {
              return this.$attrs["article"]
            },
            getContent () {
                // 提取代码段之前的内容,并过滤图片
                let str = this.article.content;
                let reg = /<pre.*<\/pre>/smg;
                str = str.replace(reg, ''); // 不展示pre内的任意代码
                let temp = document.createElement('div');
                temp.innerHTML = str;
                return temp.innerText
            }
        }
    }
</script>

<style scoped>
    .title {
        cursor: pointer;
        line-height: 22px;
        font-weight: bold;
        font-size: 20px;
    }

    .text {
        font-size: 14px;
        line-height: 2;
        text-indent: 2em;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 60px;
    }

    .article-info {
        text-align: right;
        padding: 10px 0px 0px 5px;
        /*font-weight: bold;*/
        font-size: 13px;
        border-top: 1px dashed #e6e6e6;
    }

    .article-info>span {
        margin-left: 10px;
    }

    .reset-fix:before,
    .reset-fix:after {
        display: table;
        content: "";
    }

    .reset-fix:after {
        clear: both
    }

    .box-card {
        width: 100%;
        height: 145px;
        margin-bottom: 10px;
    }
</style>