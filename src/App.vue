<template>
  <div id="app">
    <el-input
      placeholder="Please enter the todo list"
      class="td-input"
      :value="inputValue"
      @input="handleInputChange"
      @keyup.enter="addItemToList">  <!-- 添加回车键支持 -->
    </el-input>
    <el-button type="primary" @click="addItemToList">Add item</el-button>
    <el-main class="td-main" >
        <el-table
          ref="multipleTable"
          :data="infolist"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @select="statusChanged"
          @select-all="statusChangedAll">
          <el-table-column
            type="selection"
            width="55"
            >
          </el-table-column>
          <el-table-column
            label="TodoList"
            width="350">
            <!-- 数据渲染 -->
            <template slot-scope="item">
              <span
                :class="{ 'completed': item.row.done }"
                @click="toggleTaskStatus(item.row)"
                class="task-text">
                {{ item.row.info }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="del"
            width="50">
            <el-button slot-scope="item" @click="removeItemById(item.row.id)" size="mini" class="btn-close" type="primary" icon="el-icon-close" circle></el-button>
          </el-table-column>
        </el-table>
        <div class="footer">
          <span>{{unDoneLength}} remaining items</span>
          <el-radio-group size="small" v-model="radio1" @change="changeList">
            <el-radio-button class="btn-radio" label="All"></el-radio-button>
            <el-radio-button class="btn-radio" label="Active"></el-radio-button>
            <el-radio-button class="btn-radio" label="Completed"></el-radio-button>
          </el-radio-group>
          <el-button @click="clean">Clear completed</el-button>
        </div>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      radio1: 'All'
    }
  },
  created () {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['list', 'inputValue', 'viewKey']),
    ...mapGetters(['unDoneLength', 'infolist'])
  },
  methods: {
    // 监听文本框内容的变化
    handleInputChange (val) {
      this.$store.commit('setInputValue', val)
    },
    // 向列表中新增 item 项
    addItemToList () {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('TodoList cannot be empty!')
      }
      this.$store.commit('addItem')
    },
    // 根据Id删除对应的任务事项
    removeItemById (id) {
      // 找到要删除的行并添加动画
      const rowElement = this.$refs.multipleTable.$el.querySelector(`[data-row-key="${id}"]`)
      if (rowElement) {
        rowElement.classList.add('removing')
        setTimeout(() => {
          this.$store.commit('removeItem', id)
        }, 300)
      } else {
        this.$store.commit('removeItem', id)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 复选框状态绑定
    checked () {
      this.$nextTick(() => {
        this.list.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, row.done)
        })
      })
    },
    // 监听复选框选中状态变化事件
    statusChanged (val, row) {
      const param = {
        id: row.id,
        // 点击后状态取反
        status: !row.done
      }
      this.$store.commit('changeStatus', param)
    },
    statusChangedAll (val) {
      if (val.length !== 0) {
        this.$store.commit('changeStatusAll')
      } else {
        this.$store.commit('cleanStatusAll')
      }
    },
    // 清除已完成任务
    clean () {
      this.$store.commit('cleanDone')
    },
    // 修改页面上展示的列表数据
    changeList (key) {
      this.$store.commit('changeViewKey', key)
    },
    // 新增：切换单个任务状态
    toggleTaskStatus (task) {
      const param = {
        id: task.id,
        status: !task.done
      }
      this.$store.commit('changeStatus', param)
    }
  },
  watch: {
    infolist: function (val) {
      this.checked()
    }
  }
}
</script>

<style>
#app {
  width: 610px;
  margin: 0 auto;
}
.td-input {
  width: 500px;
  margin-right: 10px;
}
.td-main {
  width: 500px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
}
.btn-close {
  float: right;
}
.el-button--mini.is-circle {
  padding: 3px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

/* 删除动画 */
.el-table__row {
  transition: all 0.3s ease;
}

.el-table__row.removing {
  opacity: 0;
  transform: translateX(-100%);
}

/* 悬停效果 */
.el-table__row:hover {
  background-color: #f5f7fa !important;
}

/* 响应式 */
@media (max-width: 768px) {
  #app {
    width: 95%;
    margin: 0 auto;
  }

  .td-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .td-main {
    width: 100%;
  }

  .footer {
    flex-direction: column;
    gap: 10px;
  }
}

/* 任务文本样式 */
.task-text {
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.task-text:hover {
  background-color: #f0f0f0;
}

/* 已完成任务的样式 */
.task-text.completed {
  text-decoration: line-through;
  color: #999;
  background-color: #f8f8f8;
}
</style>
