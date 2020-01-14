<template>
    <el-card class="box-card">
        <el-divider content-position="left">关于我</el-divider>
        <div class="about-me">
            <p @click="handleClick" class="click-edit" v-show="!isShow && isLogin"><i class="el-icon-edit"></i></p>
            <pre class="show-about-me" v-html="currentData" v-show="!isShow"></pre>
            <pre class="edit-about-me" v-html="currentData" ref="pre" contenteditable="true" type="textarea" v-show="isShow"/>
            <el-button type="primary" plain @click="submitAboutMe" v-show="isShow">保存</el-button>
            <el-button type="danger" plain @click="quitSubmit" v-show="isShow">取消</el-button>
        </div>
        <el-divider content-position="left">联系我</el-divider>
        <div class="concat-me">
            请移步文章评论区
        </div>
    </el-card>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                // loading: true
                isShow: false,
                currentData: ''
            }
        },
        computed: {
            ...mapState(['isLogin'])
        },
        methods: {
            handleClick () {
                this.isShow = true;
                this.$nextTick(()=>{
                    console.log(this.$refs['pre'])
                    this.$refs['pre'].click();
                })
            },
            submitAboutMe () {
                let content = this.$refs['pre'].innerHTML;
                // 提交更改
                this.axios({
                    method: 'post',
                    url: '/updateAboutMe',
                    data: {
                        aboutMe: content
                    }
                }).then(res => {
                    this.$message.success("保存成功!");
                    // 刷新展示面板
                    this.currentData = content;

                    this.quitSubmit();
                }).catch(err => {
                    console.log(err)
                })
            },
            quitSubmit () {
                this.isShow = false;
            },
            getAboutMe () {
                this.axios({
                    url: '/getAboutMe'
                }).then(res => {
                    if (res.data.length) {
                        this.currentData = res.data[0].content;
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        beforeCreate() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                leftCol: 24
            })
        },
        created() {
            this.getAboutMe();
        }
    }

</script>

<style scoped>
    .about-me {
        height: 500px;
    }

    .concat-me {
        height: 150px;
    }

    .concat-me,
    .about-me {
        overflow: auto;
        padding: 15px 15px 0;
    }

    .about-me .show-about-me,
    .about-me .edit-about-me{
        height: 350px;
        padding: 20px;
    }

    .about-me .el-button {
        margin-top: 10px;
    }

    .about-me .click-edit {
        padding-left: 20px;
    }
</style>
