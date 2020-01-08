<template>
    <el-card class="box-card">
        <el-collapse accordion v-model="activeYear">
            <el-collapse-item v-for="(year, i) in yearList" :name="year" :key="i" :id="'_' + year">
                <template slot="title">
                    <p class="coll-title">{{ year }}年</p>
                </template>
                <el-timeline>
                    <el-timeline-item
                            color="rgb(127, 185, 245)"
                            v-for="item in timeline"
                            :key="item.id"
                            :timestamp="item.ctime"
                            v-if="item.year == year">
                        <div @click="readArticle($event)" :data-id="item.id" class="link-title" :class="{'link-wid': phone}" :title="item.title">
                            {{ item.title }}
                        </div>
                        <i class="el-icon-delete" title="删除" v-if="isLogin" :data-info="item.id" @click="del($event)"/>
                    </el-timeline-item>
                </el-timeline>
            </el-collapse-item>
        </el-collapse>
    </el-card>
</template>

<script>
    import {mapState, mapGetters} from "vuex"

    export default {
        data() {
            return {
                timeline: []
            };
        },
        methods: {
             del (e) {
                /*点击每条时都会带有渲染时的ID,根据ID删除文章*/
                const id = e.target.getAttribute("data-info");
                this.$confirm('确定删除本条记录吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await this.deleteBlog(id);
                        this.$message.warning('本篇文章已删除!');
                        this.timeline.forEach((ele, index) => { // 更新当前视图
                            if (ele.id == id) {
                                this.timeline.splice(index,  1);
                            }
                        }, this);
                        this.$listeners["refreshHome"](); //更新首页右侧区域内容
                    }catch (e) {
                        console.log(e)
                    }
                }).catch(() => {
                    this.$message.info('已取消');
                });
            },
            readArticle (e) {
                let id = e.target.getAttribute("data-id");
                this.$router.push({
                    name: 'blogDetail',
                    params: {
                        id
                    }
                });
            },
            deleteBlog(id) {
                return this.axios({
                    method: 'post',
                    url: '/deleteBlog',
                    data: {
                        id
                    }
                });
            }
        },
        computed: {
            /*...mapState({
                yearList: state => state.time.yearList  // 无论time是否加命名空间,此写法都可以
            }),*/
            ...mapState("time", ["yearList", "currentChoose"]),
            ...mapState(["isLogin"]),
            ...mapGetters("time", ["currentYear"]),
            ...mapGetters({
                phone: "getDeviceIsPhone"
            }),
            activeYear: {
                set(val) {
                    this.$store.commit("time/setCurrentChoose", val);
                },
                get () {
                    return this.currentChoose || this.currentYear
                }
            }
        },
        beforeCreate() {
            const store = this.$store;
            /*
            *  请求文章列表信息
            * */
            this.axios({
                url: '/getArticleList'
            }).then(res => {
                let newArr = [];
                let newObj = {};
                res.data.forEach(ele => {
                    let year = new Date(ele.ctime).getFullYear().toString();
                    if(!newObj[year]){
                        newObj[year] = true;
                        newArr.push(year);
                    }
                });
                store.commit("time/getYearList", newArr);
                res.data.forEach(ele=>{
                    let ctime = ele.ctime;
                    ele.ctime = this.$date_format(ctime);
                    ele.year = new Date(ctime).getFullYear();
                    this.timeline.push(ele);
                });
            }).catch(err => {
                console.log(err)
            })
        },
        created() {
            this.$store.commit("setLeftTagsLine", {
                lineList: !this.phone,
                leftCol: this.phone ? 24 : 16
            });
        }
    };
</script>

<style scoped>
    h4 {
        font-size: 16px;
        font-weight: bold;
    }

    .el-timeline {
        padding: 10px;
    }

    .coll-title {
        font-weight: bold;
        font-size: 18px;
        color:#409EFF;
    }

    .el-icon-delete {
        cursor: pointer;
    }

    .el-icon-delete:hover {
        color: #409EFF;
    }
    .link-title{
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
        padding-right: 10px;
    }

    .link-title:hover {
        color: #409EFF;
        cursor: pointer;
    }

    .link-title {
        display: inline-block;
        width: 320px;
    }
    .link-wid {
        width: 50%;
    }
    .el-icon-delete {
        vertical-align: super;
    }
</style>