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
                            @click="handleShow(this, scope.$index, scope.row)" v-show="scope.row['is_show'] === 0">展示</el-button>
                    <el-button
                            class="my-btn"
                            size="mini"
                            type="danger"
                            @click="handleHide(this, scope.$index, scope.row)" v-if="scope.row['is_show'] === 1">隐藏</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
    import {debounce} from "../assets/js/util";

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
            debounce,
            commitBlogLength (count) {
                this.$store.commit('home/updateCount', count);
                this.$store.commit('home/initVuex', {blogLength: count});
                sessionStorage.setItem('blogLength', count.toString());
            },
            async handleShow(index, row) {
                // 展示
                try {
                    let result = await this.updateBlogShow(row, 1);
                    this.getArticleList(
                        () => {this.$message.success('本条文章已展示!')}
                    );
                    let count = result.data[3][0].blogLength;
                    this.commitBlogLength(count);
                }catch (e) {
                    console.log(e)
                }
            },
            async handleHide(index, row) {
                try {
                    let result = await this.updateBlogShow(row, 0);
                    this.getArticleList(
                        () => {this.$message.error('本条文章已隐藏!')}
                    );
                    // 更新totalcount
                    let count = result.data[3][0].blogLength;
                    this.commitBlogLength(count);
                }catch (e) {
                    console.log(e)
                }
            },
            updateBlogShow (row, state) {
                return this.axios({
                    method: 'post',
                    url: '/updateBlogShow',
                    data: {
                        state,
                        id: row.id
                    }
                })
            },
            getArticleList (cb = ()=>{}) {
                /*
                *  请求文章列表信息
                * */
                this.axios({
                    url: '/getArticleList'
                }).then(res => {
                    res.data[1].forEach(ele => {
                        ele['ctime'] = this.$date_format(ele['ctime']);
                    });

                    let data = res.data[1];
                    if (this.tableData.length) {
                        this.tableData.forEach((ele, index) => {
                            let newObj = data[index];
                            ele['is_show'] = newObj['is_show']; // 只需要更改is_show
                        })
                    } else {
                        this.tableData = [...data]
                    }
                    cb();
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        created() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                leftCol: 20
            });
            this.getArticleList();
        }
    }
</script>

<style scoped>
    .card-table-header {
        font-size: 20px;
        color: black;
        font-weight: bold;
    }

    .my-btn.el-button{
        margin-left: 0px;
    }
</style>