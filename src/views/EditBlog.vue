<template>
    <quill-editor
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @change="onEditorChange($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            ref="myQuillEditor"
            v-model="content">
    </quill-editor>
</template>

<script>
    import highlightJS from 'highlight.js'
    import {quillEditor} from "vue-quill-editor"  // 局部引入
    import editorConfig from "../assets/js/editorConfig";
    import {mapState} from "vuex"

    /*
    *  语言类型配置
    * */
    highlightJS.configure({
        languages: ['javascript']
    });

    export default {
        components: {
            name: 'editBlog',
            quillEditor
        },
        data() {
            return {
                content: '',
                editorOption: editorConfig
            }
        },
        methods: {
            onEditorBlur(quill) {
            //    编辑框失焦
                let html = this.$refs.myQuillEditor.quill.root.innerHTML;
                this.$store.commit("blog/updateContent", html);
            },
            onEditorFocus(quill) {
            //    编辑框聚焦
            },
            onEditorReady(quill) {
            //    编辑器初始化完毕
            },
            onEditorChange({quill, html, text}) {
                // 第一个参数为当前的quill对像
                // 通过ref方式也可以获取quill对象: this.$refs.myQuillEditor.quill
                // this.content = html // 将当前富文本内的html结构提取出来
            }
        },
        computed: {
            ...mapState(["isLogin"]),
            ...mapState("blog", ["isSubmit", "editorContent"])
        },
        watch: {
            editorContent (val) {
                this.content = val;
            }
        },
        name: "EditBlog",
        beforeRouteUpdate(to, from, next) {
            next(vm => {
                if (vm.isLogin) {
                    next()
                } else {
                    vm.$confirm('登陆后可查看,是否去登陆?', '温馨提示', {
                        confirmButtonText: '好的',
                        cancelButtonText: '算了',
                        type: 'warning'
                    }).then(() => {
                        vm.$router.push("/login")
                    }).catch(() => {
                        next(from.path)
                    })
                }
            })
        },
        mounted() {
            /* 给配置页挂载一些本页面的方法 */
            /*const {submitContent, draw} = this;
            this.$refs.myQuillEditor.quill._self = {}*/
        },
        created() {
            const store = this.$store;
            store.commit("setLeftTagsLine", {
                submitBlog: true,
                leftCol: 24
            })
        }
    }
</script>

<style scoped>

</style>