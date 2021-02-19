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
      <el-button @click="formBodyClick(scope)">form-footer-prefix</el-button>
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
import { defineComponent, ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { useCrud } from '@/components/fast-crud/index.js'
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

    const formBodyClick = (scope) => {
      console.log('scope', scope)
      ElNotification.success('mode:' + scope.mode)
    }

    const dateClick = (key, scope) => {
      console.log('dateClick', scope)
      ElNotification.success(scope.row[key])
    }

    return {
      ...crud,
      dateClick,
      crudRef,
      formBodyClick
    }
  }
})
</script>
<style lang="less">
.search-form{

}

</style>
