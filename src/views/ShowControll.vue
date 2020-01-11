<template>
    <el-card class="box-card">
        <div class="card-table-header" slot="header">
            <p>博客文章展示隐藏</p>
        </div>
        <el-table
                :data="tableData"
                border
                style="width: 100%"
                height="400"
                :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
            <el-table-column
                    prop="ctime"
                    label="日期"
                    width="220"
                    align="center"
                    sortable>
                    <template slot="header" slot-scope="scope">
                        <span style="font-size: 16px; color: black;">日期</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
                    min-width="400">
                <template slot="header" slot-scope="scope">
                    <p style="font-size: 16px; color: black;">标题</p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="tags"
                    label="标签"
                    min-width="230">
                <template slot="header" slot-scope="scope">
                    <p style="font-size: 16px; color: black;">标签</p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="views"
                    label="浏览"
                    width="60"
                    align="center">
                <template slot="header" slot-scope="scope">
                    <p style="font-size: 16px; color: black;">浏览</p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="good"
                    label="点赞"
                    width="60"
                    align="center">
                <template slot="header" slot-scope="scope">
                    <p style="font-size: 16px; color: black;">点赞</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="150">
                <template slot="header" slot-scope="scope">
                    <p style="font-size: 16px; color: black;">操作</p>
                </template>
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleShow(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleHide(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
    import {mapState, mapGetters} from "vuex"
    import {setStorageLogin} from "../assets/js/util";

    export default {
        name: "Login",
        data() {
            return {
                tableData: []
            }
        },
        computed: {

        },
        methods: {
            handleShow(index, row) {
                // 展示
                console.log(index, row);
            },
            handleHide(index, row) {
                console.log(index, row);
            },
            getArticleList () {
                /*
                *  请求文章列表信息
                * */
                return this.axios({
                    url: '/getArticleList'
                })
            }
        },
        async created() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                leftCol: 20
            });

            const res = await this.getArticleList();
            res.data && res.data.forEach(ele => {
                ele['ctime'] = this.$date_format(ele['ctime']);
            });
            this.tableData = res.data;
        }
    }
</script>

<style scoped>
    .card-table-header {
        font-size: 20px;
        color: black;
        font-weight: bold;
    }
</style>