export default {
    namespaced: true,
    state: {
        yearList: ['2020'],  // 查出所有文章插入时的年份并 distinct
        currentChoose: 0             // 当前目录所在位置
    },
    mutations: {
        setCurrentChoose (state, data) {
            if (data) {
                state.currentChoose = data;
            }
        },
        getYearList (state, data) {
            state.yearList = data;
        }
    },
    getters: {
        activeYear (state, getters) {
            return state.currentChoose || getters.currentYear
        },
        currentYear (state, getters) {
            return new Date().getFullYear().toString()
        }
    },
    actions: {},
    modules: {}
}