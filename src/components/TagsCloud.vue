<template>
    <el-card class="box-card">
        <div class="reset-fix" slot="header">
            <span>
                随机标签云
                <a v-show="_filter" class="reset-filter" @click="resetFilter">我要看全部</a>
            </span>
        </div>
        <div class="text" v-if="tagList.length">
            <span @click="filterBlog($event)" :key="index" :style="{color: randomColor(), fontSize: randomSize()}" v-for="(item,index) in tagList">
                {{ item.tag }}
            </span>
        </div>
        <div v-else class="empty-show">
            这里空空如也...
        </div>
    </el-card>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "TagsCloud",
        data() {
            return {}
        },
        methods: {
            randomColor() {
                let red = Math.random() * 255 - 50,
                    green = Math.random() * 255 - 50,
                    blue = Math.random() * 255 - 50;
                return `rgb(${red}, ${green}, ${blue})`
            },
            randomSize() {
                let scale = Math.round(window.innerWidth/1920 * 10) / 10;
                let size = `${(Math.random() * 20 + 16 * scale)}px`;
                return size
            },
            filterBlog (e) {
                let text = e.target.innerText.trim();
                this.$store.commit("home/updateFilterBlog", text);
            },
            resetFilter () {
                this.$store.commit("home/updateFilterBlog", '');
            }
        },
        computed: {
            tagList () {
                return this.$attrs['tags']
            },
            ...mapState({
                _filter: state => state.home.filterBlog
            })
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

    .reset-fix:before,
    .reset-fix:after {
        display: table;
        content: "";
    }

    .reset-fix:after {
        clear: both
    }

    .reset-filter {
        cursor: pointer;
        margin-left: 20px;
        color: #5340df;
        border-bottom: 1px solid transparent;
    }

    .reset-filter:hover {
        color: #67c23a;
        transition: all 1.5s;
        border-bottom-color: #67c23a;
    }

    .box-card {
        width: 100%;
        /*height: 250px;*/
        margin-bottom: 10px;
    }

    .empty-show {
        color: #ced1d8;
        font-size: 13px;
    }

</style>