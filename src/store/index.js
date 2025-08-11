import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 列表清单
    list: localStorage.getItem('todoList') ? JSON.parse(localStorage.getItem('todoList')) : [],
    // 文本框输入内容
    inputValue: '',
    // 下一个Id
    nextId: 1, // 从1开始，因为初始为空
    viewKey: 'All'
  },
  mutations: {
    initList (state, list) {
      state.list = list
      // 如果有数据，更新nextId为最大id+1
      if (list.length > 0) {
        state.nextId = Math.max(...list.map(item => item.id)) + 1
      }
    },
    // 为inputValue赋值到state中
    setInputValue (state, val) {
      state.inputValue = val
    },
    addItem (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        // 未完成状态默认是false
        done: false
      }
      // 将对象追加到list中
      state.list.push(obj)
      // id自动递增，保证不重复
      state.nextId++
      // 清空文本框
      state.inputValue = ''
      // 保存到localStorage
      localStorage.setItem('todoList', JSON.stringify(state.list))
    },
    // 根据Id删除对应的任务事项
    removeItem (state, id) {
      // 根据Id查找对应项的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引，删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1)
        // 保存到localStorage
        localStorage.setItem('todoList', JSON.stringify(state.list))
      }
    },
    // 修改列表项的选中状态
    changeStatus (state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
        // 保存到localStorage
        localStorage.setItem('todoList', JSON.stringify(state.list))
      }
    },
    // 修改全选后的状态
    changeStatusAll (state) {
      // console.log(params)
      state.list.forEach(row => {
        row.done = true
      })
      // 保存到localStorage
      localStorage.setItem('todoList', JSON.stringify(state.list))
    },
    // 取消全选后的状态
    cleanStatusAll (state) {
      state.list.forEach(row => {
        row.done = false
      })
      // 保存到localStorage
      localStorage.setItem('todoList', JSON.stringify(state.list))
    },
    cleanDone (state) {
      state.list = state.list.filter(x => x.done === false)
      // 保存到localStorage
      localStorage.setItem('todoList', JSON.stringify(state.list))
    },
    // 修改视图的关键字
    changeViewKey (state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList (context) {
      // 从localStorage读取数据，如果没有则使用空数组
      const savedList = localStorage.getItem('todoList')
      const list = savedList ? JSON.parse(savedList) : []
      context.commit('initList', list)
    }
  },
  getters: {
    // 统计未完成的任务数量
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    },
    infolist (state) {
      if (state.viewKey === 'All') {
        return state.list
      }
      if (state.viewKey === 'Active') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === 'Completed') {
        return state.list.filter(x => x.done)
      }
      return state.list
    }
  },
  modules: {
  }
})
