<template>
  <component
    :is="$fsui.form.name"
    class="fs-form"
    :class="{
      'fs-form-grid': display === 'grid',
      'fs-form-flex': display === 'flex',
    }"
    ref="formRef"
    :model="form"
  >
    <component :is="$fsui.row.name" class="fs-row" v-bind="row">
      <template v-for="item in computedColumns" :key="item.key">
        <component
          :is="$fsui.col.name"
          v-if="item.show !== false"
          class="fs-col"
          v-bind="mergeCol(item.col)"
        >
          <component
            :is="$fsui.formItem.name"
            class="fs-form-item"
            :[$fsui.formItem.label]="item.title"
            :[$fsui.formItem.prop]="item.key"
            v-bind="item"
          >
            <fs-slot-render
              v-if="slots && slots['form_' + item.key]"
              :slots="slots['form_' + item.key]"
              :scope="{ key: item.key, ...scope }"
            />
            <template v-else>
              <fs-component-render
                v-if="item.component && item.component.show !== false"
                :ref="
                  (el) => {
                    if (el) {
                      componentRefs[item.key] = el;
                    }
                  }
                "
                v-bind="item.component"
                :modelValue="get(form, item.key)"
                @update:modelValue="set(form, item.key, $event)"
                :scope="{ key: item.key, ...scope }"
              />
            </template>
            <template v-if="item.helper">
              <div class="fs-form-helper">
                <template v-if="typeof item.helper === 'string'">{{
                  item.helper
                }}</template>
                <template v-else-if="item.helper.render">
                  <fs-render
                    :renderFunc="item.helper.render"
                    :scope="{ key: item.key, ...scope }"
                  />
                </template>
              </div>
            </template>
          </component>
        </component>
      </template>
    </component>
  </component>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import _ from "lodash-es";
import { ComputeValue } from "../../core/compute-value";
import traceUtil from "../../utils/util.trace";
import FsRender from "../render/fs-render";
export default {
  name: "FsForm",
  components: { FsRender },
  props: {
    // 初始数据
    initial: {
      default() {
        return {};
      },
    },
    // 字段模版
    columns: {},
    // 字段分组
    groups: {},
    doSubmit: {
      type: Function,
    },
    slots: {},
    display: {
      type: String,
      default: "grid", // flex
    },
    row: {},
    col: {},
  },
  emits: ["reset", "submit", "validationError", "value-change"],
  setup(props, ctx) {
    traceUtil.trace("fs-from");
    const formRef = ref();

    const form = reactive({});
    // 初始数据赋值
    _.each(props.columns, (item, key) => {
      form[key] = props.initial[key];
    });

    const componentRefs = ref({});
    function getComponentRef(key) {
      return componentRefs.value[key];
    }

    const scope = ref({
      row: props.initial,
      form,
      index: ctx.attrs.index,
      mode: ctx.attrs.mode,
      attrs: ctx.attrs,
      getComponentRef,
    });

    function getContextFn() {
      return scope.value;
    }

    const computedColumns = ComputeValue.computed(
      props.columns,
      getContextFn,
      null,
      null,
      (columns) => {
        //排序
        const list = [];
        let index = 1;
        _.forEach(columns, (value, key) => {
          value.key = key;
          if (value.order == null) {
            value.order = index;
          }
          index++;
          list.push(value);
        });
        list.sort((a, b) => {
          return a.order - b.order;
        });
        return list;
      }
    );

    async function getFormRef() {
      return formRef.value;
    }
    async function reset() {
      formRef.value.resetFields();
      if (props.doReset) {
        await props.doReset(scope.value);
      }
      ctx.emit("reset");
    }

    async function submit() {
      const valid = await formRef.value.validate();
      if (valid) {
        if (props.doSubmit) {
          await props.doSubmit(scope.value);
        }
        ctx.emit("submit", scope.value);
      } else {
        ctx.emit("validationError", scope.value);
      }

      return valid;
    }

    function getFormData() {
      console.log("getFormData111", form);
      return form;
    }
    function setFormData(formData) {
      _.merge(form, formData);
    }

    function mergeCol(col) {
      return _.merge({}, props.col, col);
    }

    const { proxy } = getCurrentInstance();
    return {
      get: _.get,
      set: (form, key, value) => {
        _.set(form, key, value);
        const event = { key, value, formRef: proxy, ...scope.value };
        ctx.emit("value-change", event);
        if (props.columns[key].valueChange) {
          props.columns[key].valueChange(event);
        }
      },
      formRef,
      computedColumns,
      submit,
      reset,
      getFormRef,
      scope,
      form,
      componentRefs,
      getFormData,
      setFormData,
      getComponentRef,
      mergeCol,
    };
  },
};
</script>

<style lang="less">
.fs-form-grid {
  .fs-row {
    display: grid;
    grid-template-columns: 50% 50%;
    // gap: 0 20px; //列间距 20px
    .ant-form-item-label {
      width: 100px;
      flex: none;
      max-width: none;
    }
    .ant-form-item-control-wrapper {
      flex: 1;
      max-width: none;
    }
    .fs-col {
      max-width: 100%;
    }
  }
}
.fs-form-flex {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  flex-wrap: wrap;
  .fs-row {
    width: 100%;
  }

  .fs-form-helper {
    color: #7d7d7d;
    font-size: 12px;
  }
}
</style>
