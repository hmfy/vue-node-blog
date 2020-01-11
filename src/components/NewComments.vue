<template>
    <el-card class="box-card">
        <div class="reset-fix" slot="header">
            <span>最新评论</span>
        </div>
        <template v-if="commentsList.length">
            <div :key="index" class="text item" v-for="(item, index) in commentsList">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content text-left">{{ item['user_name'] }}</div>
                        <div class="grid-content-small text-right">[{{ $date_format(item.ctime) }}]</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content-small text-more-hidden"><a @click="readArticle($event)" :data-id="JSON.stringify(item)">{{ item.comments }}</a></div>
                    </el-col>
                </el-row>
            </div>
        </template>
        <div v-else class="empty-show">
            这里空空如也...
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "NewComments",
        data() {
            return {}
        },
        computed: {
            commentsList () {
                return this.$attrs['comments']
            }
        },
        methods: {
            readArticle (e) {
                let info = e.target.getAttribute("data-id");
                info = JSON.parse(info);
                this.$router.push({
                    name: 'blogDetail',
                    params: {
                        id: info['blog_id'],
                        commentId: info['id']
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .text-left {
        float: left;
    }

    .text-right {
        float: right;
    }

    .item {
        /*margin-bottom: 18px;*/
        border-bottom: 1px dashed #e6e6e6;
    }

    .text-more-hidden {
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .text-more-hidden > a {
        color: #909399;
        cursor: pointer;
        text-decoration: none;
    }

    .text-more-hidden > a:hover {
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
        /*height: 380px;*/
        margin-bottom: 10px;
    }

    .el-row {
        padding: 5px;
    }

    .grid-content {
        font-weight: bold;
    }

    .grid-content-small {
        color: #545c64;
        padding-top: 2px;
    }


    .empty-show {
        color: #ced1d8;
        font-size: 13px;
    }

</style>