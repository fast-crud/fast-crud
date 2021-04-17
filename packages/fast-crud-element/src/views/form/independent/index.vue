<template>
  <div style="padding: 20px">独立使用表单</div>
  <div style="width: 100%">
    <el-row :gutter="10" style="padding: 0; margin: 0">
      <el-col :span="12">
        <el-card header="直接显示表单">
          <fs-form ref="formRef" v-bind="formOptions" />
          <div style="margin-top: 10px">
            <el-button @click="formSubmit">提交表单</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="打开表单对话框">
          <el-button @click="openFormWrapper">打开表单对话框</el-button>
          <fs-form-wrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";

function useFormDirect() {
  const formRef = ref();
  const formOptions = ref({
    labelPosition: "right",
    labelWidth: "100px",
    col: {
      span: 12
    },
    display: "flex",
    columns: {
      customField: {
        title: "新表单字段",
        component: {
          name: "el-input",
          allowClear: true
        }
      },
      groupField: {
        title: "分组字段",
        component: {
          name: "el-input",
          allowClear: true
        }
      }
    },
    group: {
      groups: {
        testGroupName: {
          title: "分组测试",
          columns: ["groupField"]
        }
      }
    },
    doSubmit({ form }) {
      console.log("form submit:", form);
      ElMessage.info("自定义表单提交:" + JSON.stringify(form));
      nextTick(() => {
        ElMessage.success("保存成功");
      });
    }
  });

  function formSubmit() {
    formRef.value.submit();
  }
  return {
    formOptions,
    formRef,
    formSubmit
  };
}
function useFormWrapper() {
  const formWrapperRef = ref();
  const formWrapperOptions = ref({
    labelPosition: "right",
    labelWidth: "100px",
    col: {
      span: 12
    },
    wrapper: {
      is: "el-dialog",
      width: "960px",
      destroyOnClose: true,
      footer: null,
      title: "表单独立使用"
    },
    display: "flex",
    columns: {
      customField: {
        title: "新表单字段",
        component: {
          name: "el-input",
          allowClear: true
        }
      },
      groupField: {
        title: "分组字段",
        component: {
          name: "el-input",
          allowClear: true
        }
      }
    },
    group: {
      groups: {
        testGroupName: {
          title: "分组测试",
          columns: ["groupField"]
        }
      }
    },
    doSubmit({ form }) {
      console.log("form submit:", form);
      ElMessage.info("自定义表单提交:" + JSON.stringify(form));
      nextTick(() => {
        ElMessage.warn("抛出异常可以阻止表单关闭");
      });

      throw new Error("抛出异常可以阻止表单关闭");
    }
  });
  function openFormWrapper() {
    formWrapperRef.value.open(formWrapperOptions.value);
  }
  return {
    formWrapperRef,
    openFormWrapper,
    formWrapperOptions
  };
}
export default defineComponent({
  name: "FormIndependent",
  setup() {
    return {
      ...useFormDirect(),
      ...useFormWrapper()
    };
  }
});
</script>
