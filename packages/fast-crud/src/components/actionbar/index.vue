<template>
  <div class="fs-actionbar">
    <template v-for="(value, key) in computedButtons" :key="key">
      <fs-button v-if="value.show !== false" v-bind="value" @click="onClick(key, value, $event)" />
    </template>
  </div>
</template>
<script lant="ts">
import { defineComponent, computed } from "vue";
import _ from "lodash-es";
import { Constants } from "../../utils/util.constants";

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
  },
  emits: ["action"],
  setup(props, ctx) {
    function onClick(key, value, $event) {
      const e = { key, btn: value, $event };
      if (value.click) {
        value.click(e);
        return;
      }
      if (value.onClick) {
        value.onClick(e);
        return;
      }
      ctx.emit("action", e);
    }
    const computedButtons = computed(() => {
      let sortArr = [];
      for (let key in props.buttons) {
        sortArr.push({
          ...props.buttons[key],
          _key: key
        });
      }
      sortArr = _.sortBy(sortArr, (item) => {
        return item.order ?? Constants.orderDefault;
      });

      const sortedButtons = {};

      sortArr.forEach((item) => {
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
  min-width: 1px;
  .fs-button {
    margin: 0 2px;
  }
}
</style>
