export default {
    namespaced: true,
    state: {
        busy: false,
        count: 5,
        totalBlog: 0,
        myState: false,
        filterBlog: ''
    },
    mutations: {
        updateCount(state, data) {
            state.count = data;
        },
        updateBusy(state) {
            state.busy = !state.busy
        },
        initVuex(state, payload) {
            const {blogLength} = payload;
            state.totalBlog = blogLength
        },
        updateMyState(state, data) {
            state.myState = data
        },
        updateFilterBlog (state, data) {
            state.filterBlog = data;
        }
    },
    getters: {
        noMore(state) {
            return state.count >= state.totalBlog
        },
        disabled(state, getter) {
            return state.busy || getter.noMore
        },
        getMyState(state) {
            return state.myState
        }
    },
    actions: {},
    modules: {}
}
