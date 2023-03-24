import { Ref } from "vue";

export default {
  /**
   * 重构object，但忽略某些字段
   * @param ref
   * @param skips
   */
  omit(ref: Ref, ...skips: string[]): any {
    const keys = Object.keys(ref.value);
    const pAttrs: any = {};
    for (const key of keys) {
      if (key === "loading") {
        continue;
      }
      if (skips.indexOf(key) >= 0) {
        continue;
      }
      pAttrs[key] = ref.value[key];
    }
    return pAttrs;
  }
};
