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
    <!-- row -->
    <component :is="$fsui.row.name" class="fs-row" v-bind="row">
      <!-- col -->
      <template v-for="item in computedDefaultColumns" :key="item.key">
        <component
          :is="$fsui.col.name"
          v-if="item.show !== false"
          class="fs-col"
          v-bind="mergeCol(item.col)"
        >
          <fs-form-item
            :ref="
              (el) => {
                if (el) {
                  componentRefs[item.key] = el;
                }
              }
            "
            :item="item"
            v-if="item.show !== false"
            :modelValue="get(form, item.key)"
            @update:modelValue="set(form, item.key, $event)"
            :slots="slots['form_' + item.key]"
            :get-context-fn="getContextFn"
          />
        </component>
      </template>
    </component>
    <component
      style="width: 100%"
      v-if="computedGroup.wrapper"
      :is="computedGroup.wrapper.parent"
      v-model:activeKey="groupActiveKeys"
    >
      <template v-for="(groupItem, key) of computedGroup.groups" :key="key">
        <template v-if="key">
          <component
            :is="computedGroup.wrapper.child"
            :header="groupItem.title"
            :key="key"
          >
            <!-- row -->
            <component :is="$fsui.row.name" class="fs-row" v-bind="row">
              <!-- col -->
              <template v-for="key in groupItem.columns" :key="key">
                <component
                  :is="$fsui.col.name"
                  v-if="computedColumns[key].show !== false"
                  class="fs-col"
                  v-bind="mergeCol(computedColumns[key].col)"
                >
                  <fs-form-item
                    :item="computedColumns[key]"
                    v-if="computedColumns[key].show !== false"
                    :modelValue="get(form, key)"
                    @update:modelValue="set(form, key, $event)"
                    :slots="slots['form_' + key]"
                    :get-context-fn="getContextFn"
                  />
                </component>
              </template>
            </component>
          </component>
        </template>
      </template>
    </component>
  </component>
</template>

<script>
import { ref, reactive, getCurrentInstance, toRaw, computed } from "vue";
import _ from "lodash-es";
import { useCompute } from "../../use/use-compute";
import traceUtil from "../../utils/util.trace";
import FsRender from "../render/fs-render";
import logger from "../../utils/util.log";
import { uiContext } from "../../ui";
import { useMerge } from "../../use/use-merge";
import FsFormItem from "./fs-form-item.vue";
export default {
  name: "FsForm",
  components: { FsFormItem, FsRender },
  props: {
    // 初始表单数据
    initialForm: {
      default() {
        return {};
      },
    },
    // 字段模版
    columns: {},
    // 字段分组
    /**
     * 字段分组
     * {
     *   type:'xxx',
     *   groups:{
     *     groupKey:{ title:'xxx',columns:[]}
     *   }
     * }
     */
    group: {},
    doSubmit: {
      type: Function,
    },
    slots: {},
    display: {
      type: String,
      default: "grid", // flex
    },
    index: {},
    // mode: add,edit,view,自定义
    mode: {},
    row: {},
    col: {},
  },
  emits: ["reset", "submit", "validationError", "value-change"],
  setup(props, ctx) {
    const { merge } = useMerge();
    const ui = uiContext.get();
    const { doComputed } = useCompute();
    traceUtil.trace("fs-from");
    const formRef = ref();

    const form = reactive({});

    const initialForm = _.cloneDeep(props.initialForm);
    // 初始数据赋值
    _.each(props.columns, (item, key) => {
      form[key] = initialForm[key] || null;
    });
    //form.valueBuilder
    _.each(props.columns, (item, key) => {
      let value = form[key];
      if (item.valueBuilder) {
        item.valueBuilder({
          value,
          key,
          row: form,
          form,
          index: props.index,
          mode: props.mode,
        });
      }
    });

    const scope = ref({
      row: initialForm,
      form,
      index: props.index,
      mode: props.mode,
      attrs: ctx.attrs,
      getComponentRef,
    });

    const componentRefs = ref({});

    function getComponentRenderRef(key) {
      return componentRefs.value[key];
    }

    function getComponentRef(key) {
      return getComponentRenderRef(key)?.$refs?.targetRef;
    }

    function getContextFn() {
      return scope.value;
    }

    const computedColumns = doComputed(props.columns, getContextFn, null, null);

    //构建分组数据
    const computedGroup = doComputed(
      props.group,
      getContextFn(),
      null,
      (group) => {
        const defaultForm = { ...form };
        //找出没有添加进分组的字段
        const defaultColumns = [];
        _.forEach(group?.groups, (groupItem) => {
          _.forEach(groupItem.columns, (item) => {
            if (defaultForm[item]) {
              delete defaultForm[item];
            }
            defaultColumns.push(item);
          });
        });

        const type = group.type;
        let wrapper = {
          parent: ui.collapse.name,
          child: ui.collapseItem.name,
        };
        if (type === "tab") {
          wrapper = {
            parent: ui.tabs.name,
            child: ui.tabPane.name,
          };
        }
        const merged = merge(
          {
            wrapper,
            defaultColumns,
          },
          group
        );
        console.log("merged", merged);
        return merged;
      }
    );

    const computedDefaultColumns = computed(() => {
      const columns = [];
      let index = 1;
      //default columns排序
      _.forEach(computedColumns.value, (value, key) => {
        value.key = key;
        if (value.order == null) {
          value.order = index;
        }
        index++;
        if (
          computedGroup.value?.defaultColumns &&
          computedGroup.value?.defaultColumns[key]
        ) {
          columns.push(value);
        }
        value.col = mergeCol(value.col);
      });
      //排序
      columns.sort((a, b) => {
        return a.order - b.order;
      });

      return columns;
    });

    const groupActiveKeys = ref([]);

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
      if (!valid) {
        ctx.emit("validationError", scope.value);
        return;
      }
      const formData = _.cloneDeep(toRaw(form));
      const submitScope = { ...scope.value, form: formData };
      logger.debug("form submit", JSON.stringify(form));
      _.each(props.columns, (item, key) => {
        let value = initialForm[key];
        if (item.valueResolve) {
          item.valueResolve({
            value,
            key,
            ...submitScope,
          });
        }
      });

      if (props.doSubmit) {
        await props.doSubmit(submitScope);
      }
      ctx.emit("submit", submitScope);
    }

    function getFormData() {
      return form;
    }
    function setFormData(formData) {
      _.merge(form, formData);
    }

    function mergeCol(col) {
      return _.merge({}, props.col, col);
    }

    const { proxy } = getCurrentInstance();

    function buildItemScope(item) {
      return { key: item.key, ...scope.value };
    }
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
      computedDefaultColumns,
      submit,
      reset,
      getFormRef,
      scope,
      buildItemScope,
      groupActiveKeys,
      form,
      componentRefs,
      getFormData,
      setFormData,
      getComponentRef,
      mergeCol,
      computedGroup,
      getContextFn,
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
    line-height: 1.5;
  }
}
</style>
