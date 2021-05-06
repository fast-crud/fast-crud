<template>
  <a-row :gutter="10">
    <a-col :span="12">
      <a-card title="直接显示表单">
        <fs-form ref="formRef" v-bind="formOptions" />
        <div style="margin-top: 10px">
          <a-button @click="formSubmit">提交表单</a-button>
        </div>
      </a-card>
    </a-col>
    <a-col span="12">
      <a-card title="打开表单对话框">
        <a-button @click="openFormWrapper">打开表单对话框</a-button>
        <fs-form-wrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, ref } from "vue";
import { message } from "ant-design-vue";

function useFormDirect() {
  const formRef = ref();
  const formOptions = ref({
    col: {
      span: 12
    },
    labelAlign: "right",
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 14
    },
    display: "flex",
    columns: {
      customField: {
        title: "新表单字段",
        component: {
          name: "a-input",
          vModel: "value",
          allowClear: true
        },
        rules: [{ required: true, message: "此项必填" }]
      },
      groupField: {
        title: "分组字段",
        component: {
          name: "a-input",
          vModel: "value",
          allowClear: true
        },
        rules: [{ required: true, message: "此项必填" }]
      }
    },
    group: {
      groups: {
        testGroupName: {
          header: "分组测试",
          columns: ["groupField"]
        }
      }
    },
    doSubmit({ form }) {
      console.log("form submit:", form);
      message.info("自定义表单提交:" + JSON.stringify(form));
      message.success("保存成功");
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
    labelWidth: "80px",
    col: {
      span: 12
    },
    labelAlign: "right",
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
    wrapper: {
      is: "a-modal",
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
          name: "a-input",
          vModel: "value",
          allowClear: true
        },
        rules: [{ required: true, message: "此项必填" }]
      },
      groupField: {
        title: "分组字段",
        component: {
          name: "a-input",
          vModel: "value",
          allowClear: true
        },
        rules: [{ required: true, message: "此项必填" }]
      }
    },
    group: {
      groups: {
        testGroupName: {
          header: "分组测试",
          columns: ["groupField"]
        }
      }
    },
    doSubmit({ form }) {
      console.log("form submit:", form);
      message.info("自定义表单提交:" + JSON.stringify(form));
      message.warn("抛出异常可以阻止表单关闭");
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
