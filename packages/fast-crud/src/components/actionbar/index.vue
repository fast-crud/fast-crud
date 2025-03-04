<template>
  <div class="fs-actionbar">
    <template v-for="(value, key) in computedButtons" :key="key">
      <fs-button v-if="value.show !== false" v-bind="value" @click="onClick(key, value, $event)" />
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, Ref } from "vue";
import { sortBy } from "lodash-es";
import { Constants } from "../../utils/util.constants";
import { ActionbarClickEvent, ButtonsProps } from "../../d";

export default defineComponent({
  name: "FsActionbar",
  props: {
    /**
     * 按钮配置
     * {
     *  add:{
     *    ...FsButton,
     *    show:true
     *  },
     *  custom:{...}
     * }
     */
    buttons: {}
  } as any,
  emits: ["action"],
  setup(props, ctx: any) {
    function onClick(key: any, btn: any, $event: any) {
      const e = { key, btn, $event };
      if (btn.click) {
        btn.click(e);
        return;
      }
      if (btn.onClick) {
        btn.onClick(e);
        return;
      }
      ctx.emit("action", e);
    }
    const computedButtons: Ref = computed(() => {
      let sortArr = [];
      // @ts-ignore
      for (let key in props.buttons) {
        sortArr.push({
          // @ts-ignore
          ...props.buttons[key],
          _key: key
        });
      }
      sortArr = sortBy(sortArr, (item: any) => {
        return item.order ?? Constants.orderDefault;
      });

      const sortedButtons: ButtonsProps<ActionbarClickEvent> = {};

      sortArr.forEach((item: any) => {
        let _key = item._key;
        delete item._key;
        sortedButtons[_key] = item;
      });
      return sortedButtons;
    });
    return {
      onClick,
      computedButtons
    };
  }
});
</script>
<style lang="less">
.fs-actionbar {
  .fs-button {
    margin: 0 2px;
  }
}
</style>
