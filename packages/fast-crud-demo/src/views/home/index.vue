<template>
  <fs-crud class="home-page" ref="crudRef" v-bind="crudOptions">
    <template #cell-date="scope">
      <el-button @click="dateClick('date',scope)" >cell- date,{{scope.row.date}}</el-button>
    </template>

    <template #form-date="scope">
      <el-button @click="dateClick('date',scope)" >form- date,{{scope.row.date}}</el-button>
    </template>

    <template #form-body-before="scope">
      <el-button @click="formBodyClick(scope)">form-body-before</el-button>
    </template>

    <template #form-footer-prefix="scope">
      <el-button @click="closeDialog(scope)">取消</el-button>
    </template>

    <template #form-footer-append="scope">
      <el-button @click="formBodyClick(scope)">form-footer-append</el-button>
    </template>

    <template #pagination-prefix>
      <el-button >批量删除</el-button>
    </template>
    <template #pagination-append>
      <el-button >批量删除</el-button>
    </template>
  </fs-crud>
</template>

<script >
import { defineComponent, ref, onMounted, isReactive } from 'vue'
import { ElNotification } from 'element-plus'
import { useCrud, dict } from '@fast-crud/fast-crud'
import createCrudOptions from './crud'
export default defineComponent({
  setup () {
    const crudRef = ref()
    const crud = useCrud({
      crudRef,
      options: createCrudOptions({ crudRef })
    })

    onMounted(() => {
      crud.doRefresh()
    })

    const res = dict({})
    console.log('isReactive:', res, isReactive(res))

    const formBodyClick = (scope) => {
      console.log('scope', scope)
      ElNotification.success('mode:' + scope.mode)
    }

    const dateClick = (key, scope) => {
      console.log('dateClick', scope)
      ElNotification.success(scope.row[key])
    }

    function closeDialog (scope) {
      scope._self.close()
    }

    // onRenderTracked((event) => {
    //   console.log('状态跟踪组件----------->', event.key, event)
    // })
    // onRenderTriggered((event) => {
    //   console.log('状态触发组件--------------->', event.key, event)
    // })
    return {
      ...crud,
      dateClick,
      crudRef,
      formBodyClick,
      closeDialog
    }
  }
})
</script>
<style lang="less">
.search-form{

}

</style>
