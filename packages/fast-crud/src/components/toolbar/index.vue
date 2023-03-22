<template>
  <div class="fs-toolbar">
    <template v-for="(item, key) of computedButtons" :key="key">
      <template v-if="item.show !== false">
        <component
          :is="ui.popover.name"
          v-if="key === 'columns' && columnsFilter && columnsFilter.mode === 'simple'"
          v-model:[ui.popover.visible]="popoverVisible"
          display-directive="show"
          placement="bottom"
          :width="760"
          trigger="click"
        >
          <template #[ui.popover.triggerSlotName]>
            <fs-button v-bind="item" @click="handleSimpleClick" />
          </template>
          <template #[ui.popover.contentSlotName]>
            <fs-table-columns-filter
              v-if="columns"
              ref="columnsFilterRef"
              v-model:show="popoverVisible"
              mode="simple"
              v-bind="columnsFilter"
              :columns="columns"
              :storage="storage"
              @update:columns="$emit('update:columns', $event)"
            />
          </template>
        </component>
        <fs-button v-else v-bind="item" @click="item.click()" />
      </template>
    </template>
    <fs-table-columns-filter
      v-if="columns && columnsFilter.mode !== 'simple'"
      ref="columnsFilterRef"
      v-bind="columnsFilter"
      :columns="columns"
      :storage="storage"
      @update:columns="$emit('update:columns', $event)"
    />
  </div>
</template>

<script lang="ts">
import FsTableColumnsFilter from "./fs-table-columns-filter/index.vue";
import _ from "lodash-es";
import { computed, defineComponent, ref, Ref } from "vue";
import { useI18n } from "../../locale";
import { Constants } from "../../utils/util.constants";
import { ButtonProps, ButtonsProps } from "../../d";
import { useUi } from "../../use";

/**
 * 工具条
 */
export default defineComponent({
  name: "FsToolbar",
  components: { FsTableColumnsFilter },
  props: {
    /**
     * 按钮配置
     *{
     *   search:{}, 查询
     *   refresh:{}, 刷新
     *   compact:{}, 紧凑模式
     *   export:{}, 导出
     *   columns:{} 列设置
     *}
     **/
    buttons: {
      type: Object
    },
    /**
     * 当前是否显示查询。
     * 注意：如果要隐藏search，请配置crudOptions.search.show=false
     */
    search: {
      type: Boolean
    },
    /**
     * 当前是否紧凑模式
     */
    compact: {
      type: Boolean,
      default: true
    },
    /**
     * 列配置
     */
    columns: {
      type: Array,
      default: undefined
    },
    /**
     * 是否保存用户列设置
     * 传string则表示传入缓存的主key
     */
    storage: {
      type: [String, Boolean],
      default: true
    },
    /**
     * 插槽
     */
    slots: {},

    /**
     * 列设置配置
     */
    columnsFilter: {}
  } as any,
  emits: ["refresh", "update:search", "update:compact", "update:columns", "export"],
  setup(props: any, ctx) {
    const { t } = useI18n();
    const columnsFilterRef: Ref = ref();
    const { ui } = useUi();
    const computedButtons = computed(() => {
      const defaultButtons: ButtonsProps<void> = {
        refresh: {
          type: "primary",
          icon: ui.icons.refresh,
          title: t("fs.toolbar.refresh.title"), // '刷新',
          circle: true,
          click: () => {
            ctx.emit("refresh");
          }
        },
        search: {
          type: "primary",
          icon: ui.icons.search,
          title: t("fs.toolbar.search.title"), // '查询显示',
          circle: true,
          click: () => {
            ctx.emit("update:search", !props.search);
          }
        },
        compact: {
          type: "primary",
          icon: ui.icons.compact,
          title: t("fs.toolbar.compact.title"), // '紧凑模式',
          circle: true,
          click: () => {
            ctx.emit("update:compact", !props.compact);
          }
        },
        export: {
          show: false,
          type: "primary",
          icon: ui.icons.export,
          title: t("fs.toolbar.export.title"), // '导出',
          circle: true,
          click: () => {
            ctx.emit("export");
          }
        },
        columns: {
          type: "primary",
          icon: ui.icons.columnsFilter,
          title: t("fs.toolbar.columns.title"), // '列设置',
          circle: true,
          click: () => {
            columnsFilterRef.value.start();
          }
        }
      };

      _.merge(defaultButtons, props.buttons);
      if (defaultButtons.search) {
        defaultButtons.search.type = props.search ? "primary" : "default";
      }
      if (defaultButtons.compact) {
        defaultButtons.compact.type = props.compact ? "primary" : "default";
      }

      let sortArr: ButtonProps[] = [];
      for (let defaultButtonsKey in defaultButtons) {
        sortArr.push({
          ...defaultButtons[defaultButtonsKey],
          _key: defaultButtonsKey
        });
      }
      sortArr = _.sortBy(sortArr, (item) => {
        return item.order ?? Constants.orderDefault;
      });

      const sortedButtons: ButtonsProps<void> = {};

      sortArr.forEach((item) => {
        let _key = item._key;
        delete item._key;
        sortedButtons[_key] = item;
      });
      return sortedButtons;
    });
    const popoverVisible = ref(false);
    const handleSimpleClick = () => {
      if (ui.type === "element") {
        return;
      }
      popoverVisible.value = !popoverVisible.value;
    };
    return {
      ui,
      columnsFilterRef,
      computedButtons,
      popoverVisible,
      handleSimpleClick
    };
  }
});
</script>
<style lang="less">
.fs-toolbar {
  display: flex;

  .fs-button {
    margin-left: 5px;
  }
}
</style>
