<template>
    <el-form label-position="top" label-width="80px" :model="fields" ref="ruleForm" :rules="rules">
        <el-form-item label="标题" prop="title">
            <el-input clearable v-model="fields.title"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
            <el-input clearable v-model="fields.tags"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="submitForm('ruleForm')" type="primary">提交</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapState} from "vuex"
    export default {
        name: "SubmitBlog",
        data() {
            return {
                fields: {
                    title: "",
                    tags: ""
                },
                rules: {
                    title: {
                        required: true, message: "不能为空", trigger: "blur"
                    },
                    tags: {
                        required: true, message: "不能为空", trigger: "blur"
                    }
                }
            }
        },
        computed: {
            ...mapState({
                content: state => state.blog.editorContent
            })
        },
        methods: {
             getStrId (target, range) {
                 let arr = [];
                 let id = target;
                 for (let i = 0; i < range; i ++) {
                     arr.push(id++);
                 }
                 return arr.join(",");
             },
             editBlog (title, tags, result) {
                 return this.axios({
                     method: 'post',
                     url: '/editBlog',
                     data: {
                         title,
                         tags,
                         result,
                         ctime: new Date().getTime()
                     }
                 })
             },
             insertTagBlogMap (res) {
                 /*
                 *  插入标签映射
                 * */
                 let len = res.data.length;
                 let tagsResult = res.data[len - 1]; // 最后一条insert的返回结果
                 let idStr = this.getStrId(tagsResult.insertId, tagsResult.affectedRows);
                 return this.axios({
                     method: 'post',
                     url: '/insertTagBlogMap',
                     data: {
                         blogId: res.data[len - 2].insertId, //保存文章成功时传回来的id(倒数第二条insert)
                         idStr,
                         ctime: new Date().getTime()
                     }
                 })
             },
             submitForm (formName) {
                 this.$refs[formName].validate(async (valid) => {
                     if (valid) {
                         let {title, tags} = this.fields;
                         tags = tags.replace(/，/g, ','); // 英文转中文
                         let insertBlogResult = await this.editBlog(title, tags, this.content);
                         let tagBlogMapResult =  await this.insertTagBlogMap(insertBlogResult);
                         if (tagBlogMapResult.status === 200){
                             this.$message.success("插入成功!");
                             this.fields.tags = '';
                             this.fields.title = '';
                             this.$store.commit("blog/updateContent", ''); // 更新文章状态内容
                             this.$emit('refreshHome');
                         } else {
                             this.$message.success("插入失败!");
                         }

                     } else {
                         console.log('error submit!!');
                         return false;
                     }
                 });
            }
        }
    }
</script>

<style scoped>

</style>