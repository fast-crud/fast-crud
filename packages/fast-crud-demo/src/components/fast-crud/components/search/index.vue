<template>
  <el-collapse-transition >
    <div class="fs-search">
      <el-form
          :inline="true"
          :model="form"
          ref="searchFormRef"
          v-bind="options" class="search-form">
        <slot name="prefix" :form="form"></slot>
        <el-form-item
            v-for="(item,key) in computedColumns"
            v-bind="item" :key="key"  :prop="key"
        >
          <template v-if="item.slot === true">
            <slot :name="key+'SearchSlot'" :form="form"/>
          </template>

          <fs-component-render
              v-else
              :value="valueGet(form,key)"
              @input="valueSet(form,key,$event)"
              :ref="'form_item_'+key"
              v-bind="item.component || {}"
              v-on="item.on || {}"
          >
          </fs-component-render>
        </el-form-item>
        <slot :form="form"></slot>
        <el-form-item class="search-btns">
          <template v-for="(item, index) in computedButtons">
            <fs-button :key="index"
                       v-if="item.show"
                       @click="item.doClick()"
                       v-bind="item"
            />
          </template>
        </el-form-item>
        <slot name="suffix" :form="this.form"></slot>
      </el-form>
    </div>
  </el-collapse-transition>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
import _ from 'lodash-es'
import fsButton from '../basic/fs-button'
import log from '../../utils/util.log'
import { ElNotification } from 'element-plus'
import FsComponentRender from '@/components/fast-crud/components/render/fs-component-render'
export default {
  name: 'fs-search',
  components: { FsComponentRender, fsButton },
  emits: ['search', 'reset'],
  props: {
    /* 初始查询条件，点击重置，会重置成该条件 */
    initial: {
      type: Object
    },
    // 表单options
    options: {
      type: Object
    },
    // 查询字段配置
    columns: {
      type: Object
    },
    // 按钮配置 {search, rest}
    buttons: {
      type: Object
    },
    // 点击重置后是否查询
    searchAfterReset: {
      type: Boolean,
      default: true
    },
    // 是否自动查询
    autoSearch: {
      type: Boolean,
      default: true
    },
    // 自动查询，防抖设置
    debounce: {
      type: Object
    },
    // 重置时的操作
    reset: {
      type: Function
    }
  },
  setup (props, ctx) {
    let autoSearch = null
    const form = ref(_.cloneDeep(props.initial))
    const searchFormRef = ref()

    const computedText = computed(() => {
      const def = {
        search: '查询',
        reset: '重置'
      }
      return _.merge(def, this.text)
    })

    function handleFormSubmit () {
      if (autoSearch) {
        // 防抖查询取消
        autoSearch.cancel()
      }
      searchFormRef.value.validate((valid) => {
        if (valid) {
          ctx.$emit('search', { form: form.value })
        } else {
          ElNotification.error({
            title: '错误',
            message: '表单校验失败'
          })
          return false
        }
      })
    }

    function doSearch () {
      handleFormSubmit()
    }

    function handleFormReset () {
      searchFormRef.value.resetFields()

      if (props.reset) {
        props.reset({ form: form.value })
      }
      // 表单重置事件
      this.$emit('reset')
      if (props.searchAfterReset) {
        nextTick(() => {
          doSearch()
        })
      }
    }

    const computedButtons = computed(() => {
      const btns = []
      const defBtnOptions = { search: {}, reset: {} }
      _.merge(defBtnOptions, props.buttons)
      if (defBtnOptions.search) {
        btns.push({
          show: true,
          type: 'primary',
          disabled: false,
          doClick: () => {
            handleFormSubmit()
          },
          order: 1,
          icon: 'el-icon-search',
          text: '查询',
          ...defBtnOptions.search
        })
      }
      if (defBtnOptions.reset) {
        btns.push({
          show: true,
          disabled: false,
          doClick: () => {
            handleFormReset()
          },
          icon: 'el-icon-refresh',
          text: '重置',
          order: 2,
          ...defBtnOptions.reset
        })
      }
      btns.sort((a, b) => {
        return a.order - b.order
      })
      return btns
    })

    const computedColumns = computed(() => {
      return props.columns
    })

    function initAutoSearch () {
      // 构建防抖查询函数
      if (props.debounce !== false) {
        let wait = null
        if (props.debounce) {
          wait = props.debounce.wait
        }
        if (wait == null) {
          wait = 500
        }
        autoSearch = _.debounce(handleFormSubmit, wait, props.debounce)
      }
    }

    initAutoSearch()

    function getForm () {
      return form.value
    }

    /**
     * 设置form值
     * @param form form对象
     * @param isMerge 是否与原有form值合并
     */
    function setForm (form, isMerge = false) {
      const baseForm = {}
      if (isMerge) {
        _.merge(baseForm, form.value, form)
      } else {
        _.merge(baseForm, form)
      }
      form.value = baseForm
    }

    const valueSet = _.set
    const valueGet = _.get
    return {
      computedText, computedButtons, handleFormSubmit, handleFormReset, computedColumns, form, doSearch, getForm, valueSet, valueGet, setForm, searchFormRef
    }
  },

  methods: {
    handleSearchDataChange ({ value, component }, column) {
      column.value = value
      column.component = component
      column.getColumn = this.getColumnTemplate

      if (this.options.valueChange) {
        const target = this.getColumnTemplate(column.key)
        if (target && target.valueChange) {
          target.valueChange(column.key, value, this.form, {
            getColumn: this.getColumnTemplate,
            mode: 'search',
            component: component,
            refs: this.$refs,
            getComponent: this.getComponentRef
          })
        }
      }
      log.debug('search value change:', column.key)
      this.$emit('search-data-change', column)

      if (this.searchDebounce) {
        // 防抖查询
        this.searchDebounce()
      }
    },
    handleSearchComponentReady ({ value, component }, column) {
      column.event = value
      column.component = component
      this.$emit('search-component-ready', column)
    },
    handleSearchComponentCustomEvent (value, column) {
      column.event = value
      this.$emit('search-component-custom-event', column)
    },
    getColumnTemplate (key) {
      log.debug('getColumn', this.currentColumns)
      for (const item of this.currentColumns) {
        if (item.key === key) {
          return item
        }
      }
    },
    getComponentRef (key) {
      if (this.$refs) {
        const wrapper = this.$refs['form_item_' + key]
        if (wrapper && wrapper.length > 0 && wrapper[0]) {
          return wrapper[0].getComponentRef()
        }
      }
    },
    getContext (key) {
      const context = {
        mode: 'search',
        key: key,
        value: this.form[key],
        form: this.form,
        getComponent: this.getComponentRef,
        component: this.getComponentRef(key),
        column: this.getColumn(key),
        getColumn: this.getColumn
      }
      return context
    },
    getColumn (key) {
      return this.currentColumns[key]
    }
  }
}
</script>
<style lang="less">
.fs-search{
  .search-form{
    padding:6px;
    display: flex;
    align-items: center;
    .el-form-item {
      margin-bottom: 4px;
      margin-top: 4px;
      display: flex;
      align-items: center;
    }
    .el-form--inline {
      display: flex;
      align-items: center;
    }
    .el-form-item__content{
      display: flex;
      align-items: center;
    }
  }
}
</style>
