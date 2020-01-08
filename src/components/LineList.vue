<template>
    <el-card class="box-card">
        <div class="clearfix" slot="header">
            <span>目录</span>
        </div>
        <div class="text">
            <p v-for="item in yearList" :key="item" @click="handClick($event)">
                <el-link :type="activeYear == item ? 'primary' : 'info'" :href="'#_' + item">{{ item }}</el-link>
            </p>
        </div>
    </el-card>
</template>

<script>
    import {mapState, mapGetters} from "vuex"

    export default {
        name: "LineList",
        data() {
            return {

            }
        },
        methods: {
            handClick (e) {
                this.$store.commit("time/setCurrentChoose", e.target.innerText);
            }
        },
        computed: {
            ...mapState("time", ["yearList"]),
            ...mapGetters("time", ["activeYear"])
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .text>span {
        cursor: pointer;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
        height: 250px;
        margin-bottom: 10px;
    }
</style>