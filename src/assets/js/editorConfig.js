import highlightJS from 'highlight.js'

export default {
    // debug: 'info', // 在控制台自行打印一些信息
    placeholder: '请在这里写下你的心情...',
    readOnly: false,
    theme: 'snow',
    syntax: true,
    modules: {
        toolbar: {
            container: [
                [{ 'header': []}, { 'color': [] }, { 'background': [] }, { 'size': [] }],
                [{ 'font': [] }, { 'align': [] }, { 'list': 'bullet' }, { 'list': 'ordered'}],
                ['blockquote', 'code-block', 'image', 'clean', 'underline']
            ],
            handlers: {
                /*
                此处扩展自己的自定义功能
                shadeBox: null,
                sourceEditor() {
                    ...
                }*/
            }
        },
        syntax: {
            highlight: text => highlightJS.highlightAuto(text).value
        }
    },
    initButton: function () {
        /*
        *  在使用的页面中初始化按钮样式
        * */
        /*const sourceEditorButton = document.querySelector('.ql-sourceEditor');
        const baseButton = `
            width:80px;
            border:1px solid #b3d8ff;
            border-radius:5px;
            background: #ecf5ff;
            color: #409eff;
            `;
        sourceEditorButton.style.cssText = baseButton;
        sourceEditorButton.innerText = "提交";*/
    }
}