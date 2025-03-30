<template>
  <div class="fs-row-handle">
    <slot name="cell-rowHandle-left" v-bind="scopeRef"></slot>
    <template v-for="(item, index) in computedHandleBtns" :key="index">
      <template v-if="item.show !== false && !isDropdownBtn(item, index)">
        <fs-render v-if="item.render" :render-func="item.render" :scope="scopeRef" />
        <fs-button v-else class="row-handle-btn" v-bind="item" @click.stop="doClick(item)" />
      </template>
    </template>
    <slot name="cell-rowHandle-middle" v-bind="scope"></slot>
    <!-- 下拉按钮菜单 -->
    <span v-if="hasDropdownBtn" class="row-handle-btn fs-handle-row-dropdown">
      <component :is="ui.dropdown.name" v-bind="computedDropdownBinding">
        <fs-button v-bind="dropdown.more" />
        <template #[ui.dropdown.slotName]>
          <component
            :is="ui.dropdownMenu.name"
            v-if="ui.dropdown.renderMode === 'slot'"
            v-bind="ui.dropdownMenu.command(doDropdownItemClick)"
          >
            <template v-for="(item, index) in computedHandleBtns" :key="index">
              <component
                :is="ui.dropdownItem.name"
                v-if="item.show !== false && isDropdownBtn(item, index)"
                :[ui.dropdownItem.command]="item.key"
                v-bind="item.dropdownItem"
                :disabled="item.disabled"
              >
                <div class="fs-row-handle-dropdown-item" v-bind="item">
                  <fs-icon v-if="item.icon" :icon="item.icon" /> {{ item.text || item.title }}
                </div>
              </component>
            </template>
          </component>
        </template>
      </component>
    </span>
    <slot name="cell-rowHandle-right" v-bind="scope"></slot>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { forEach, sortBy, omit } from "lodash-es";
import { useI18n } from "../../locale";
import { useUi } from "../../use/use-ui";
import { useCompute } from "../../use/use-compute";
import { Constants } from "../../utils/util.constants";
import { ButtonProps, ScopeContext } from "../../d";
import { useMerge } from "../../use";

/**
 * 操作列配置
 */
export default defineComponent({
  name: "FsRowHandle",
  props: {
    /**
     * 按钮折叠配置
     */
    dropdown: {
      type: Object
    },
    /**
     * 按钮配置
     * {
     *   view:{...FsButton,click:Function,order:1},
     *   edit:{...FsButton,click:Function,order:2},
     *   remove:{...FsButton,click:Function,order:3},
     *   ...自定义
     * }
     */
    buttons: {
      type: Object
    },
    /**
     * 按钮分组,上面的buttons为默认分组
     *  {
     *    groupKey:{buttonKey:{},buttonKey2:{}}
     *  }
     */
    group: {
      type: Object
    },
    /**
     * 当前激活分组
     */
    active: {
      type: String,
      default: "default"
    },
    /**
     * scope
     */
    scope: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ["handle"],
  setup(props: any, ctx) {
    const { ui } = useUi();
    const { merge } = useMerge();
    const { t } = useI18n();

    const scopeRef = computed(() => {
      return {
        ...props.scope,
        row: props.scope[ui.tableColumn.row],
        index: props.scope[ui.tableColumn.index]
      };
    });
    const doClick = (item: any) => {
      const index = props.scope[ui.tableColumn.index];
      const row = props.scope[ui.tableColumn.row];
      const e: ScopeContext = { key: item.key, row, btn: item, index, ...props.scope };
      if (item.click) {
        return item.click(e);
      }
      ctx.emit("handle", e);
    };
    const { doComputed } = useCompute();
    const pickedProps = computed(() => {
      return {
        dropdown: props.dropdown,
        buttons: props.buttons,
        active: props.active,
        group: props.group
      };
    });
    const computeProps = doComputed(
      () => {
        return pickedProps.value;
      },
      () => {
        const index = props.scope[ui.tableColumn.index];
        const row = props.scope[ui.tableColumn.row];
        return { ...props.scope, index, row };
      }
    );

    //const computeProps = { value: props };
    const computedHandleBtns = computed(() => {
      let mergedBtns = null;
      if (computeProps.value.active == null || computeProps.value.active === "default") {
        const defBtns = {
          view: {
            key: "view",
            text: t("fs.rowHandle.view.text"),
            title: t("fs.rowHandle.view.text")
          },
          copy: {
            key: "copy",
            text: t("fs.rowHandle.copy.text"),
            title: t("fs.rowHandle.copy.text")
          },
          edit: {
            key: "edit",
            type: "primary",
            text: t("fs.rowHandle.edit.text"),
            title: t("fs.rowHandle.edit.text")
          },
          remove: {
            key: "remove",
            ...ui.button.colors("danger"),
            text: t("fs.rowHandle.remove.text"),
            title: t("fs.rowHandle.remove.text")
          }
        };
        mergedBtns = merge(defBtns, computeProps.value.buttons);
      } else {
        mergedBtns = computeProps.value.group[computeProps.value.active];
      }

      const btns: ButtonProps[] = [];
      forEach(mergedBtns, (item, key) => {
        item.key = key;
        if (item.show === false) {
          return;
        }
        btns.push(item);
      });

      return sortBy(btns, (item) => {
        return item.order ?? Constants.orderDefault;
      });
    });

    const computedDropdownAtLeast = computed(() => {
      if (
        computeProps.value.dropdown == null ||
        computeProps.value.dropdown.atLeast == null ||
        computeProps.value.dropdown.atLeast <= 0 ||
        computedHandleBtns.value.length <= computeProps.value.dropdown.atLeast
      ) {
        return 0;
      }
      return computeProps.value.dropdown.atLeast || 0;
    });
    function isDropdownBtn(item: any, index: number) {
      if (item.dropdown === true) {
        return true;
      }
      if (computedDropdownAtLeast.value > 0 && computedDropdownAtLeast.value < index) {
        return true;
      }
      return false;
    }
    const hasDropdownBtn = computed(() => {
      let index = 0;
      for (const item of computedHandleBtns.value) {
        const is = isDropdownBtn(item, index);
        if (is) {
          return true;
        }
        index++;
      }
      return false;
    });

    function doDropdownItemClick($event: any) {
      for (let btn of computedHandleBtns.value) {
        if ($event === btn.key) {
          doClick(btn);
          return;
        }
      }
    }

    const computedDropdownBinding = computed(() => {
      const binding: any = {};
      if (ui.dropdown.renderMode !== "slot") {
        // naive 通过options配置来显示子项
        const btns = computedHandleBtns.value;
        const opts: ButtonProps[] = [];
        forEach(btns, (value, index) => {
          if (value.show !== false && isDropdownBtn(value, index)) {
            opts.push({
              [ui.dropdown.value]: value.key,
              [ui.dropdown.label]: value.text,
              title: value.title
            });
          }
        });
        binding.options = opts;
      }
      return {
        ...omit(props.dropdown, "more", "atLeast"),
        ...ui.dropdown.command(doDropdownItemClick),
        ...binding
      };
    });

    return {
      ui,
      hasDropdownBtn,
      computedHandleBtns,
      doDropdownItemClick,
      computedDropdownAtLeast,
      doClick,
      isDropdownBtn,
      scopeRef,
      computedDropdownBinding
    };
  }
});
</script>

<style lang="less">
.fs-row-handle {
  // display: flex ; // 这里不能用flex，否则会破坏align:center配置
  flex-wrap: wrap;
  display: inline-flex;
  align-items: center;
  .el-button + .el-button {
    margin-left: 2px;
  }
  & > * {
    margin: 2px;
    display: inline-flex;
    align-items: center;
  }
  .fs-row-handle-dropdown-item {
    display: flex;
  }

  .n-button {
    align-items: center;
    margin: 2px;
  }
}
</style>
