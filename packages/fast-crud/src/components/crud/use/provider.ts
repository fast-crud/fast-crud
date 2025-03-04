import { provide } from "vue";
import { inject, Ref } from "vue";
import { get, set } from "lodash-es";
export function useComponentRefProvider(componentsRef: Ref) {
  const getter = (index: number, key: string) => {
    return get(componentsRef, `value[${index}].${key}`);
  };
  provide("componentRef:get", getter);
  const setter = (index: number, key: string, value: any) => {
    return set(componentsRef, `value[${index}].${key}`, value);
  };
  provide("componentRef:set", setter);

  return {
    getter,
    setter
  };
}

export function useComponentRefInject() {
  const getter = inject("componentRef:get");
  const setter = inject("componentRef:set");
  return {
    getter,
    setter
  };
}
