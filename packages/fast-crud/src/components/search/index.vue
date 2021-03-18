<template>
  <component :is="$fsui.collapseTransition.name">
    <div class="fs-search" v-if="show !== false">
      <component
        :is="$fsui.form.name"
        :inline="true"
        :model="form"
        ref="searchFormRef"
        v-bind="options"
        class="search-form"
        @compositionstart="changeInputEventDisabled(true)"
        @compositionend="changeInputEventDisabled(false)"
      >
        <component :is="$fsui.formItem.name">
          <fs-slot-render
            v-if="slots['search-left']"
            :slots="slots['search-left']"
            :scope="{ form }"
          />
        </component>
        <template v-for="(item, key) in computedColumns" :key="key">
          <component
            :is="$fsui.formItem.name"
            v-if="item.show === true"
            v-bind="item"
            :[$fsui.formItem.prop]="key"
            :label="item.title"
          >
            <template v-if="slots['search_' + key]">
              <fs-slot-render
                :slots="slots['search_' + key]"
                :scope="{ form, key }"
              />
            </template>
            <template v-else>
              <fs-component-render
                v-if="item.component && item.component.show !== false"
                :ref="
                  (el) => {
                    if (el) {
                      componentRenderRefs[item.key] = el;
                    }
                  }
                "
                :modelValue="get(form, key)"
                @update:modelValue="set(form, key, $event)"
                @input="onInput(item)"
                @change="onChange(item)"
                v-bind="item.component"
                :scope="{ form }"
              />
            </template>
          </component>
        </template>
        <component :is="$fsui.formItem.name">
          <fs-slot-render
            v-if="slots['search-middle']"
            :slots="slots['search-middle']"
            :scope="{ form }"
          />
        </component>
        <component :is="$fsui.formItem.name" class="search-btns">
          <template v-for="(item, index) in computedButtons" :key="index">
            <fs-button v-if="item.show" @click="item.doClick()" v-bind="item" />
          </template>
        </component>
        <component :is="$fsui.formItem.name">
          <fs-slot-render
            v-if="slots['search-right']"
            :slots="slots['search-right']"
            :scope="{ form }"
          />
        </component>
      </component>
    </div>
  </component>
</template>

<script>
import { computed, ref, nextTick } from "vue";
import _ from "lodash-es";
import fsButton from "../basic/fs-button";
import FsComponentRender from "../../components/render/fs-component-render";
import FsSlotRender from "../../components/render/fs-slot-render";
import { useCompute } from "../../use/use-compute";
import traceUtil from "../../utils/util.trace";
import { uiContext } from "../../ui";
import { useI18n } from "../../local";
import logger from "../../utils/util.log";

export default {
  name: "FsSearch",
  // eslint-disable-next-line vue/no-unused-components
  components: { FsComponentRender, FsSlotRender, fsButton },
  inheritAttrs: false,
  props: {
    /* 初始查询条件，点击重置，会重置成该条件 */
    initialForm: {
      type: Object,
    },
    // 表单options
    options: {
      type: Object,
    },
    // 查询字段配置
    columns: {
      type: Object,
    },
    // 按钮配置 {search, rest}
    buttons: {
      type: Object,
    },
    // 点击重置后是否查询
    searchAfterReset: {
      type: Boolean,
      default: true,
    },
    // 是否自动查询
    autoSearch: {
      type: Boolean,
      default: true,
    },
    // 自动查询，防抖设置
    debounce: {
      type: Object,
    },
    slots: {
      default() {
        return {};
      },
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["search", "reset"],
  setup(props, ctx) {
    const ui = uiContext.get();
    traceUtil.trace("fs-search");
    let autoSearch = ref(null);
    const form = ref(_.cloneDeep(props.initialForm || {}));
    const searchFormRef = ref();
    const { t } = useI18n();
    const { doComputed } = useCompute();
    const componentRenderRefs = ref({});

    function getComponentRenderRef(key) {
      return componentRenderRefs.value[key];
    }

    function getComponentRef(key) {
      return getComponentRenderRef(key)?.$refs?.targetRef;
    }

    function getContextFn() {
      return { form: form.value, getComponentRef };
    }

    async function doSearch() {
      if (autoSearch.value) {
        // 防抖查询取消
        autoSearch.value.cancel();
      }
      const valid = await searchFormRef.value.validate();
      logger.debug("valid", valid);
      if (valid) {
        ctx.emit("search", { form: form.value });
      } else {
        ui.message.error({
          message: t("fs.search.error.message"),
        });
        return false;
      }
    }

    function doReset() {
      searchFormRef.value.resetFields();

      if (props.reset) {
        props.reset({ form: form.value });
      }
      // 表单重置事件
      ctx.emit("reset", getContextFn());
      if (props.searchAfterReset) {
        nextTick(() => {
          doSearch();
        });
      }
    }

    const computedButtons = computed(() => {
      const btns = [];
      const defBtnOptions = { search: {}, reset: {} };
      _.merge(defBtnOptions, props.buttons);
      if (defBtnOptions.search) {
        btns.push({
          show: true,
          type: "primary",
          disabled: false,
          doClick: () => {
            doSearch();
          },
          order: 1,
          text: t("fs.search.search.text"), // '查询',
          ...defBtnOptions.search,
        });
      }
      if (defBtnOptions.reset) {
        btns.push({
          show: true,
          disabled: false,
          doClick: () => {
            doReset();
          },
          text: t("fs.search.reset.text"), // '重置',
          order: 2,
          ...defBtnOptions.reset,
        });
      }
      btns.sort((a, b) => {
        return a.order - b.order;
      });
      return btns;
    });

    const computedColumns = doComputed(props.columns, getContextFn);

    function initAutoSearch() {
      // 构建防抖查询函数
      if (props.debounce !== false) {
        let wait = null;
        if (props.debounce) {
          wait = props.debounce.wait;
        }
        if (wait == null) {
          wait = 500;
        }
        autoSearch = _.debounce(doSearch, wait, props.debounce);
      }
    }

    initAutoSearch();

    function getForm() {
      return form.value;
    }

    /**
     * 设置form值
     */
    function setForm(form) {
      form.value = form;
    }

    const inputEventDisabled = ref(false);

    const doAutoSearch = () => {
      if (inputEventDisabled.value !== true && autoSearch) {
        // 防抖查询
        autoSearch();
      }
    };

    const onInput = (item) => {
      if (
        item.autoSearchTrigger == null ||
        item.autoSearchTrigger === "input"
      ) {
        doAutoSearch();
      }
    };
    const onChange = (item) => {
      if (item.valueChange) {
        const key = item.key;
        const value = form.value[key];
        const componentRef = getComponentRef(key);
        item.valueChange({ key, value, componentRef, ...getContextFn() });
      }
      if (item.autoSearchTrigger === "change") {
        doAutoSearch();
      }
      doAutoSearch();
    };
    // 输入法监听
    const changeInputEventDisabled = (disabled) => {
      inputEventDisabled.value = disabled;
      doAutoSearch();
    };

    return {
      get: _.get,
      set: _.set,
      doSearch,
      doReset,
      form,
      componentRenderRefs,
      getComponentRenderRef,
      getComponentRef,
      getForm,
      setForm,
      searchFormRef,
      onInput,
      inputEventDisabled,
      changeInputEventDisabled,
      onChange,
      computedColumns,
      computedButtons,
    };
  },
};
</script>
<style lang="less">
.fs-search {
  .search-form {
    display: flex;
    align-items: center;

    & > * {
      margin-bottom: 4px;
      margin-top: 4px;
      margin-right: 10px;
    }

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

    .el-form-item__content {
      display: flex;
      align-items: center;
    }
  }

  .search-btns {
    .fs-button {
      margin-right: 5px;
    }
  }
}
</style>
