<style lang="less">
.fs-table-columns-filter {
  :focus {
    outline: 0;
  }

  [flex~="cross:center"] {
    -ms-flex-align: center;
    align-items: center;
  }

  [flex~="main:justify"] {
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  [flex] {
    display: -ms-flexbox;
    display: flex;
  }

  [flex-box="1"] {
    flex-grow: 1;
    flex-shrink: 1;
  }

  [flex] > * {
    display: block;
  }

  .el-drawer__body {
    height: 0;
  }

  .fs-drawer-wrapper {
    padding: 10px;
    height: 100%;
    overflow-y: scroll;
  }

  .fs-drawer-footer {
    padding: 20px;
  }

  .component--list {
    margin: -20px;

    .item-label{flex:1}
    .title {
      font-size: 14px;
    }

    .component--list-item {
      padding: 10px;
      background-color: #FFF;
      margin-bottom: 1px;

      &.ghost {
        opacity: .5;
      }

      &:last-child {
        margin-bottom: 0px;
      }

      .component--list-item-handle {
        margin-left: 10px;
        cursor: move;

        &.disabled {
          opacity: .3;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<template>
  <component :is="$fsui.drawer.name"
             :title="_text.title"
             v-model="active"
             v-model:visible="active"
             size="300px"
             width="300px"
             v-bind="drawerBind"
             append-to-body>
    <div class="fs-drawer-wrapper">
      <!-- 全选 反选 -->
      <component :is="$fsui.card.name" shadow="never">
        <div class="component--list">
          <div
              key="__first__"
              class="component--list-item"
              flex="main:justify cross:center">
              <span :span="12">
                <component :is="$fsui.checkbox.name"
                           v-model="checkAll"
                           v-model:checked="checkAll"
                           :indeterminate="isIndeterminate"
                           @change="onCheckAllChange">
                  {{ showLength }} / {{ currentValue.length }}
                </component>
              </span>
            <span class="title">{{ _text.fixed }} / {{ _text.order }}</span>
          </div>

          <draggable v-model="currentValue" tag="transition-group" item-key="key">
            <template #item="{element,index}">
              <div
                  class="component--list-item"
                  flex="main:justify cross:center">
                <component :is="$fsui.checkbox.name" class="item-label"
                           v-model="element.show"
                           v-model:checked="element.show"
                           @change="showChange(index,$event)">
                  {{ element.label || element.title || element.key || _text.unnamed }}
                </component>
                <fs-table-columns-fixed-controller
                    flex-box="0"
                    class="d2-mr-10"
                    v-model="element.fixed"
                    @change="fixedChange(index, $event)"/>
                <div flex-box="0" class="component--list-item-handle handle">
                  <fs-icon :icon="$fsui.icons.sort"></fs-icon>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </component>
      <component :is="$fsui.row.name" class="fs-drawer-footer" :gutter="10">
        <component :is="$fsui.col.name" :span="12">
          <fs-button
              :icon="$fsui.icons.refresh"
              :text="_text.reset"
              block
              @click="reset"/>
        </component>
        <component :is="$fsui.col.name" :span="12">
          <fs-button
              type="primary"
              :icon="$fsui.icons.check"
              :text="_text.confirm"
              block
              @click="submit()"/>
        </component>
      </component>
    </div>
  </component>
</template>

<script>
import draggable from 'vuedraggable'
import _ from 'lodash-es'
import FsButton from '../../basic/fs-button'
import FsTableColumnsFixedController from '../fs-table-columns-fixed-controller/component.vue'
import TableStore from '../../../utils/util.store'
import { useI18n } from '../../../local'
// 输入 全部分表格列设置
// 输出 要显示的表格列 + 每列的设置

export default {
  name: 'fs-table-columns-filter',
  emits: ['update:columns'],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    draggable, FsButton, FsTableColumnsFixedController
  },
  props: {
    columns: {
      type: Array
    },
    storage: {
      type: [Boolean, String],
      default: true,
      required: false
    },
    text: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      original: {},
      currentValue: [],
      active: false,
      checkAll: false,
      indeterminate: false,
      checkAllModelValue: {
        [this.$fsui.checkbox.modelValue]: this.checkAll,
        ['onUpdate:' + this.$fsui.checkbox.modelValue]: (v) => {
          this.checkAll = v
        }
      },
      drawerBind: {
        [this.$fsui.drawer.customClass]: 'fs-table-columns-filter'
      }
    }
  },
  setup () {
    const { t } = useI18n()
    return { t }
  },
  computed: {
    // 显示的数量
    showLength () {
      return this.currentValue.filter(e => e.show === true).length
    },
    isIndeterminate () {
      return (this.showLength > 0 && (this.showLength < this.currentValue.length))
    },
    _text () {
      const def = {
        title: this.t('fs.toolbar.columnFilter.title'),
        fixed: this.t('fs.toolbar.columnFilter.fixed'),
        order: this.t('fs.toolbar.columnFilter.order'),
        reset: this.t('fs.toolbar.columnFilter.reset'),
        confirm: this.t('fs.toolbar.columnFilter.confirm'),
        unnamed: this.t('fs.toolbar.columnFilter.unnamed')
      }
      _.merge(def, this.text)
      return def
    }
  },
  watch: {
    columns (value) {
      this.setCurrentValue(value)
    }
  },
  created () {
    this.original = this.buildColumns(this.columns)
    this.setCurrentValue(this.columns)
    const storedOptions = this.getOptionsFromStorage()
    if (storedOptions) {
      const storeHash = this.getColumnsHash(storedOptions)
      const optionHash = this.getColumnsHash(this.original)
      if (optionHash !== storeHash) {
        // 如果字段列有过修改，则不使用本地设置
        return
      }

      const currentValue = []
      for (const storedOption of storedOptions) {
        const found = this.currentValue.find(item => item.key === storedOption.key)
        found.fixed = storedOption.fixed
        found.show = storedOption.show
        currentValue.push(found)
      }
      this.currentValue = currentValue
      this.$nextTick(() => {
        this.submit(true)
      })
    }
  },
  methods: {
    setCurrentValue (value) {
      this.currentValue = this.buildColumns(value)
      this.checkAll = this.showLength > 0
    },
    buildColumns (value) {
      const columns = _.cloneDeep(value)
      const currentValue = []
      _.forEach(columns, (value) => {
        if (value.show == null) {
          value.show = true
        }
        value.show = !!value.show
        if (value.fixed == null) {
          value.fixed = false
        }
        currentValue.push(value)
      })
      return currentValue
    },
    // fixed 变化时触发
    fixedChange (index, value) {
      if (value) this.currentValue[index].show = true
      if (value === 'left') this.currentValue.unshift(this.currentValue.splice(index, 1)[0])
      if (value === 'right') this.currentValue.push(this.currentValue.splice(index, 1)[0])

      this.showChange()
    },
    showChange () {
      console.log('checkAll', this.checkAll)
      this.checkAll = this.showLength > 0
    },
    // 全选和反选发生变化时触发
    onCheckAllChange (value) {
      console.log('checkall change', value)
      const checked = this.$fsui.checkbox.resolveEvent(value)
      this.currentValue = this.currentValue.map(e => {
        e.show = checked
        return e
      })
    },
    // 开始选择
    start () {
      this.active = true
    },
    // 还原
    reset () {
      this.currentValue = _.cloneDeep(this.original)
      this.submit(true)
      this.clearThisStorage()
    },
    // 确认
    submit (noSave) {
      if (noSave !== true) {
        this.saveOptionsToStorage(this.currentValue)
      }
      const result = _.cloneDeep(this.currentValue)
      this.emit(result)
      this.active = false
    },
    emit (result) {
      this.$emit('update:columns', result)
    },
    saveOptionsToStorage (value) {
      if (this.storage === false) {
        return
      }

      const storedOptions = []
      for (let i = 0; i < value.length; i++) {
        const item = value[i]
        const target = {
          key: item.key,
          show: item.show != null ? item.show : true,
          fixed: item.fixed
        }
        storedOptions.push(target)
      }
      this.storedOptions = storedOptions
      this.getStorageTable().updateTableValue(storedOptions)
    },
    getOptionsFromStorage () {
      if (this.storage === false) {
        return
      }
      return this.getStorageTable().getTableValue()
    },
    clearThisStorage () {
      this.getStorageTable().clearTableValue()
    },
    getStorageTable () {
      if (this.StorageTableStore == null) {
        this.StorageTableStore = new TableStore({
          $router: this.$route,
          tableName: 'columnsFilter',
          keyType: this.storage
        })
      }
      return this.StorageTableStore
    },
    getColumnsHash (columns) {
      const keys = []
      for (const item of columns) {
        keys.push(item)
      }
      keys.sort()
      let hash = ''
      for (const key of keys) {
        hash += key
      }
      return hash
    }
  }
}
</script>
