<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #actionbar-right>
      <el-alert type="warning" class="ml-10" title="通过cell字段插槽，可以做一些很复杂的显示" />
    </template>
    <template #cell_like="scope">
      <el-badge style="margin-top: 10px" :value="scope.row.like" class="item">
        <el-button size="small">自定义复杂显示</el-button>
      </el-badge>
    </template>
    <template #cell_createDate="scope">
      创建时间：{{ dateFormat(scope.row.createDate) }}<br />
      修改时间：{{ dateFormat(scope.row.updateDate) }}
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud, useExpose } from "/src/fs";
import createCrudOptions from "./crud";
import dayjs from "dayjs";
export default defineComponent({
  name: "SlotsCell",
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const expose = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions, radioDict } = createCrudOptions({ expose });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, crudOptions });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)

    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
    });

    function dateFormat(time, formatter = "YYYY-MM-DD") {
      return dayjs(time).format(formatter);
    }

    return {
      crudBinding,
      crudRef,
      radioDict,
      dateFormat
    };
  }
});
</script>
