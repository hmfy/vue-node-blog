<template>
    <el-card class="box-card">
        <div class="reset-fix" slot="header">
            <span>热门文章</span>
        </div>
        <ul v-if="articleList.length">
            <li :key="item.id" class="text item" v-for="item in articleList">
                <a @click="readArticle($event)" :data-id="item.id">{{ item.title }}</a>
            </li>
        </ul>
        <div v-else class="empty-show">
            这里空空如也...
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "NewArticle",
        data() {
            return {}
        },
        computed: {
            articleList () {
                return this.$attrs['articles']
            }
        },
        methods: {
            readArticle (e) {
                let id = e.target.getAttribute("data-id");
                this.$router.push({
                    name: 'blogDetail',
                    params: {
                        id
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item {
        border-bottom: 1px dashed #e6e6e6;
        padding: 10px;
    }

    .item:first-child {
        padding-top: 2px;
    }

    .item > a {
        color: #df628f;
        cursor: pointer;
        text-decoration: none;
    }

    .item > a:hover {
        color: #409EFF;
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
        /*height: 270px;*/
        margin-bottom: 10px;
    }

    .empty-show {
        color: #ced1d8;
        font-size: 13px;
    }
</style>