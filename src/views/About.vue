<template>
    <el-card class="box-card">
        <el-divider content-position="left">关于我</el-divider>
        <div class="about-me">
            反正都是,空空,空空如也~
        </div>
        <el-divider content-position="left">联系我</el-divider>
        <div class="concat-me">
            请移步文章评论区
        </div>
    </el-card>
</template>

<script>

    export default {
        data() {
            return {
                // loading: true
            }
        },
        methods: {

        },
        beforeCreate() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                leftCol: 24
            })
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
        padding: 15px;
    }
</style>
