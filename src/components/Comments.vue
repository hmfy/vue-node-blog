<template>
    <el-card class="box-card">
        <div v-if="comments.length">
            <div class="comments" v-for="(item, index) in comments">
                <el-row>
                    <el-col :span="24">
                        <div class="">
                            <span class="person-name" @click="changeState(item)"> {{ item.personName }}: </span>
                            {{ item.content }}
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="date">{{ item.date }}</div>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <span class="self-pointer" @click="changeState(item)">回复</span>
                       <!-- <el-divider direction="vertical"></el-divider>
                        <span class="self-pointer">点赞({{ item.good }})</span>-->
                    </el-col>
                </el-row>
                <div class="child" v-for="child in item.childList">
                    <el-row>
                        <el-col :span="24">
                            <div class="">
                                <span class="person-name" @click="changeState(child)"> {{ child.personName }}: </span>
                                <span class="person-name reply-color" @click="changeState(child, $event)">
                                    {{ getParentName(child.parent, comments[index]) }}
                                </span>
                                {{ child.content }}
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="date">{{ child.date }}</div>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <span class="self-pointer" @click="changeState(child)">回复</span>
                            <!--<el-divider direction="vertical"></el-divider>
                            <span class="self-pointer">点赞({{ child.good }})</span>-->
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div v-else class="empty-text">暂时还没有人留言,快来抢沙发吧😀</div>
    </el-card>
</template>

<script>
    export default {
        data () {
            return {
                comments: []
            }
        },
        name: "Comments",
        inject: ["scrollReply"],
        computed: {
            commentState () {
                return this.$attrs["refresh"]
            }
        },
        watch: {
            commentState (val) {
                try {
                    // 兄弟组件的状态一发生改变,马上重新请求一次数据并渲染
                    this.formatComments();
                } catch (err) {
                    console.log(err);
                }
            }
        },
        methods: {
            getParentName(parent, parentObj) {
                let childList = parentObj.childList;
                if (parentObj.id == parent) {
                    if (parentObj.parent == 0) {
                        return ""
                    }
                    return "@" + parentObj.personName
                }
                if (childList) {
                    for (let i = 0; i < childList.length; i++) {
                        let result = this.getParentName(parent, childList[i]);
                        if (result !== 'continue') {
                            return result
                        }
                    }
                }
                return 'continue' // 若此处未返回,则上面的for循环结束,最终结果渲染
            },
            changeState ({group, parent, id, personName}, e) {
                const store = this.$store;
                if (e){
                    store.commit('blog/updateCommentState', {
                        parent,
                        group,
                        personName: e.target.innerText.slice(1)
                    });
                }else if (parent == 0) {
                    /*
                    *  即将提交的人的parent是: id
                    *  组应该是: id
                    * */
                    store.commit('blog/updateCommentState', {
                        parent: id,
                        group: id,
                        personName
                    });
                } else {
                    /*
                    *  组应该是: group
                    *  parent是: id
                    * */
                    store.commit('blog/updateCommentState', {
                        parent: id,
                        group: group,
                        personName
                    });
                }
                this.scrollReply();
            },
            getComments () {
                return this.axios({
                    url: '/getComments',
                    params: {
                        id: this.$attrs["arId"]
                    }
                })
            },
            async formatComments () {
                this.comments.length = 0;
                const res = await this.getComments();
                const arr = this.comments;
                const tempArr = [];
                let commentList = res.data[0];
                if (commentList.length) {
                    commentList.forEach(ele => {
                        let obj = {};
                        obj.id = ele.id;
                        obj.content = ele.comments;
                        obj.date = this.$date_format(ele.ctime);
                        obj.parent = ele.parent;
                        obj.personName = ele['user_name'];
                        obj.group = ele.my_group;
                        obj.good = ele.good;
                        tempArr.push(obj);
                    })
                }
                tempArr.forEach(ele => {
                    if (!ele.parent) {
                        ele.childList = [];
                        arr.push(ele)
                    }
                });
                for (let i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].parent) {
                        for (let j = 0; j < arr.length; j++) {
                            if (tempArr[i].group == arr[j].id) {
                                arr[j].childList.push(tempArr[i]);
                            }
                        }
                    }
                }
            }
        },
        created() {
            try {
                this.formatComments();
            } catch (err) {
                console.log(err);
            }
        }
    }
</script>

<style scoped>
    .text-right {
        text-align: right;
    }

    .el-row {
        padding-top: 3px;
        line-height: 1.5;
    }

    .el-row:first-child {
        padding: 0;
    }

    .comments {
        padding-bottom: 15px;
    }

    .comments:last-child,
    .child:last-child {
        padding-bottom: 0;
        border-bottom: none;
    }

    .child {
        font-size: 14px;
        /*margin-top: 5px;*/
        padding: 5px 10px 5px 20px;
        background: #d9edf7;
        border-bottom: 1px dashed #dedede;
    }

    .person-name {
        color: #3a9af1;
        cursor: pointer;
    }

    .date {
        color: #909399;
    }

    .self-pointer {
        cursor: pointer;
        color: #909399;
    }

    .self-pointer:hover {
        color: #409EFF;
    }

    .empty-text {
        height: 50px;
        color: #909399;
    }
    .reply-color {
        color: #7331f1;
    }
</style>