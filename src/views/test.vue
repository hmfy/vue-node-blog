<template>
    <el-card class="box-card">
        <el-collapse accordion v-model="activeYear">
            <el-collapse-item v-for="(year, i) in yearList" :name="year" :key="i" :id="'_' + year">
                <template slot="title">
                    <p class="coll-title">{{ year }}年</p>
                </template>
                <el-timeline reverse="reverse">
                    <el-timeline-item
                            color="rgb(127, 185, 245)"
                            v-for="item in timeline"
                            :key="id"
                            :timestamp="item.ctime"
                            v-if="item.year == year">
                        <el-link href="">{{ item.title }}</el-link>
                        <!--                        <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                                                    <i class="el-icon-delete"></i>
                                                </el-tooltip>-->
                        <i class="el-icon-delete" title="删除" v-if="isLogin" :data-info="item.ctime" @click="del($event)"></i>
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
                const info = e.target.getAttribute("data-info");
                alert(info);
            }
        },
        computed: {
            /*...mapState({
                yearList: state => state.time.yearList  // 无论time是否加命名空间,此写法都可以
            }),*/
            ...mapState("time", ["yearList", "currentChoose"]),
            ...mapState(["isLogin"]),
            ...mapGetters("time", ["currentYear"]),
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
            store.commit("setLeftTagsLine", {
                lineList: true
            });

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
                    ele.ctime = this.$date_format(ele.ctime);
                    ele.year = new Date(ele.ctime).getFullYear();
                    this.timeline.push(ele);
                });
                console.log(this.timeline)
            }).catch(err => {
                this.$message.error(err)
            })
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
        margin-left: 100px;
        cursor: pointer;
    }

    .el-icon-delete:hover {
        color: #409EFF;
    }

</style>