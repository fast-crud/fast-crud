import { reactive } from "vue";
export function useVModel(props, ctx, vModel) {
  return reactive({
    [vModel]: props.modelValue,
    ["onUpdate:" + vModel]: (value) => {
      ctx.emit("onUpdate:modelValue", value);
    }
  });
}
