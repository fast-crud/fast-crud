<template>
  <template #header>
    <div class="title">input输入框</div>
  </template>
  <component :is="ui.card.name">
    <fs-ui-render :render-fn="inputDemo1Render"></fs-ui-render>
  </component>
</template>

<script lang="ts">
import { useUi } from "@fast-crud/ui-interface";
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "UiFormInput",
  setup() {
    const { ui } = useUi();
    const textRef = ref();
    function inputDemo1Render() {
      return ui.input.render({ vModel: { ref: textRef, key: "value" } });
    }
  },
});
</script>
