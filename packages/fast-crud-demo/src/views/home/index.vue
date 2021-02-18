<template>
  <fs-crud ref="crudRef" v-bind="crud">
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
import { defineComponent, ref } from 'vue'
import { ElNotification } from 'element-plus'
import * as api from './api'
import useCrud from './crud'
export default defineComponent({
  setup () {
    const crudRef = ref()
    const pageRequest = async ({ query }) => {
      await api.GetList(query)
    }
    const editRequest = async ({ form, row }) => {
      form.id = row.id
      await api.UpdateObj(form)
    }
    const delRequest = async (id) => {
      await api.DelObj(id)
    }

    const addRequest = async ({ form }) => {
      await api.AddObj(form)
    }

    const crud = ref(useCrud({
      pageRequest,
      addRequest,
      editRequest,
      delRequest,
      crudRef
    }))

    const formBodyClick = (scope) => {
      console.log('scope', scope)
      ElNotification.success('mode:' + scope.mode)
    }

    const dateClick = (key, scope) => {
      console.log('dateClick', scope)
      ElNotification.success(scope.row[key])
    }

    return {
      crud,
      dateClick,
      crudRef,
      formBodyClick
    }
  }
})
</script>
