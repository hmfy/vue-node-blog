
export default {
    namespaced: true,
    state: {
        isSubmit: false,
        editorContent: '',
        group: 0,
        parent: 0,
        personName: ''
    },
    mutations: {
        updateContent (state, data) {
            state.editorContent = data;
        },
        updateCommentState (state, {parent = 0, group = 0, personName = ''}) {
            state.parent = parent;
            state.group = group;
            state.personName = personName;
        }
    },
    getters: {
        reply (state) {
            return state.personName && `@${state.personName}`
        }
    },
    actions: {

    },
    modules: {}
}