import { reactive } from "vue";
export function useVModel(props: any, ctx: any, vModel: string) {
  return reactive({
    [vModel]: props.modelValue,
    ["onUpdate:" + vModel]: (value: any) => {
      ctx.emit("onUpdate:modelValue", value);
    }
  });
}
