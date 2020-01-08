<template>
    <el-form label-width="60px">
        <template v-if="phone">
            <el-form-item label="昵称">
                <el-input clearable placeholder="昵称不要太长哦~" maxlength="8" show-word-limit v-model="readerName"/>
            </el-form-item>
            <el-form-item label="验证码">
                <el-row :gutter="20">
                    <el-col :span="12" class="reset-padding">
                        <el-input clearable placeholder="不区分大小写" v-model="verifyCode"/>
                    </el-col>
                    <el-col :span="10">
                        <div @click="handClick" class="code-pointer" v-html="vCode"></div>
                    </el-col>
                </el-row>
            </el-form-item>
        </template>
        <el-form-item label="昵称" v-else>
            <el-row :gutter="20">
                <el-col :span="6" class="reset-padding">
                    <el-input clearable placeholder="昵称不要太长哦~" maxlength="8" show-word-limit v-model="readerName"/>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="验证码">
                        <el-row :gutter="20">
                            <el-col :span="12" class="reset-padding">
                                <el-input clearable placeholder="不区分大小写" v-model="verifyCode"/>
                            </el-col>
                            <el-col :span="10">
                                <div @click="handClick" class="code-pointer" v-html="vCode"></div>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="评论">
             <el-input :class="{'input-ident': reply}" maxlength="800" :autosize="{minRows: 8, maxRows: 100 }" show-word-limit :placeholder="getReplyTips" type="textarea" v-model="content"/>
        </el-form-item>
        <el-form-item>
            <template v-if="phone">
                <el-col :span="12">
                    <el-button @click="submitForm" type="primary">提交</el-button>
                </el-col>
                <transition name="el-fade-in-linear">
                    <el-col :span="12" v-if="reply">
                        <el-button @click="resetReply" type="danger">取消</el-button>
                    </el-col>
                </transition>
            </template>
            <el-row v-else>
                <el-col :span="2">
                    <el-button @click="submitForm" type="primary">提交</el-button>
                </el-col>
                <transition name="el-fade-in-linear">
                    <el-col :span="22" v-if="reply">
                        <el-button @click="resetReply" type="danger">取消</el-button>
                    </el-col>
                </transition>
            </el-row>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'

    export default {
        name: "EditComments",
        data() {
            return {
                readerName: '',
                content: '',
                vCode: '',
                rightCode: '',
                verifyCode: ''
            }
        },
        methods: {
            submitComment () {
                const {readerName, content, group, parent} = this;
                return this.axios({
                    method: 'post',
                    url: '/submitComment',
                    data: {
                        id: this.$attrs["arId"],
                        ctime: new Date().getTime(),
                        readerName,
                        content,
                        group,
                        parent
                    }
                })
            },
            async submitForm() {
                let name = this.readerName;
                let comment = this.content;
                const tempVerify = this.verifyCode.toLocaleLowerCase();
                const tempRightCode = this.rightCode.toLocaleLowerCase();
                if (name.trim() && comment.trim()) {
                    if (tempRightCode !== tempVerify) {
                        this.$message.warning({
                            message: "验证码错误~",
                            offset: window.innerHeight / 2 - 100,
                            customClass: 'small-message'
                        });
                        return undefined
                    }
                    try {
                        await this.submitComment();
                        const newState = !this.commentState;
                        this.readerName = '';
                        this.content = '';
                        this.verifyCode = '';
                        this.$emit("refreshComments", newState); // 提交时触发父级事件更改状态,被兄弟组件监听到
                        this.$store.commit("blog/updateCommentState", {});
                        this.refreshHome();
                    }catch (err) {
                        console.log(err)
                    }
                } else {
                    this.$message.warning({
                        message: "昵称和内容都不能为空哦~",
                        offset: window.innerHeight / 2 - 100,
                        customClass: 'small-message'
                    })
                }
            },
            refreshCode() {
                this.axios({
                    url: '/getACode'
                }).then(res => {
                    this.vCode = res.data.data;
                    this.rightCode = res.data.text;
                }).catch(err => {
                    console.log(err);
                });
            },
            handClick() {
                this.refreshCode()
            },
            resetReply() {
                this.$store.commit("blog/updateCommentState", {})
            }
        },
        computed: {
            ...mapState("blog", ["group", "parent", "personName"]),
            ...mapGetters({
                reply: 'blog/reply',
                phone: "getDeviceIsPhone"
            }),
            getReplyTips () {
                return this.reply ? this.reply : '@作者'
            },
            commentState () {
                return this.$attrs["refresh"]
            },
            refreshHome () {
                return this.$listeners['refreshHome']
            }
        },
        created() {
            this.refreshCode();
        }
    }
</script>

<style scoped>
    .el-form {
        background: #f6f7f7;
        padding: 10px 10px 0 10px;
        margin-top: 20px;
        border: 1px solid #ced1d8;
        border-radius: 2px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }

    .code-pointer {
        cursor: pointer;
        line-height: 1;
    }

    .reset-padding {
        padding-left: 0 !important;
    }

    .el-link.el-link--danger.is-underline:hover:after, .el-link.el-link--danger:after {
        border-color: transparent;
    }
</style>