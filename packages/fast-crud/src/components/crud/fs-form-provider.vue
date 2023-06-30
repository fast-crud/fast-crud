<template>
  <slot></slot>
  <fs-form-wrapper v-for="item of formWrapperList" :key="item.id" v-bind="item" />
</template>

<script setup lang="ts">
import { provide, Ref, ref } from "vue";
import FsFormWrapper from "./fs-form-wrapper.js";
import { OpenDialogProps } from "../../d";

defineOptions({
  name: "FsFormProvider"
});

const formWrapperList: Ref = ref({});

function getMaxZIndex(): number {
  let elements = document.querySelectorAll("*");
  let maxZindex = 10;
  for (let i = 0; i < elements.length; i++) {
    // @ts-ignore
    maxZindex = Math.max(maxZindex, elements[i].style.zIndex || 0);
  }
  return maxZindex;
}

provide("use:form:wrapper", () => {
  return {
    open(opts: OpenDialogProps) {
      const id = opts.id || Math.floor(Math.random() * 1000000) + "";
      return new Promise((resolve, reject) => {
        formWrapperList.value[id] = {
          id,
          // zIndex: getMaxZIndex() + 1,
          async onMounted(instance: any) {
            await instance.open(opts);
            resolve(instance);
          },
          onClosed() {
            if (!opts.id) {
              //如果不是固定id，则关闭后销毁
              delete formWrapperList.value[id];
            }
          }
        };
      });
    }
  };
});
</script>
