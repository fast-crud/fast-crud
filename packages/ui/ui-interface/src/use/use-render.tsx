import type { BaseCI, CI, ComponentRenderBinding, UiSlotRet } from "../ui-interface";
import { computed, resolveComponent } from "vue";
import { set, merge, get } from "lodash-es";

export type UiSpecialBindingBuilder = () => Partial<ComponentRenderBinding>;
export type UiSpecialBinding = Partial<ComponentRenderBinding> | UiSpecialBindingBuilder;

export type UiRenderComponent = <T extends CI>(ci: T, opts: T["__options"]) => UiSlotRet;
export type UiDoRenderComponent = (binding: ComponentRenderBinding) => UiSlotRet;

export type UiRenderHelper = {
  renderComponent: UiRenderComponent;
  doRenderComponent: UiDoRenderComponent;
  buildBinding: UiBuildBinding;
  creator: UIComponentCreator;
};

export const doRenderComponent: UiDoRenderComponent = (binding: ComponentRenderBinding) => {
  const comp = typeof binding.is === "string" ? resolveComponent(binding.is) : binding.is;
  return <comp {...binding.props} v-slots={binding.slots} />;
};

export const renderComponent: UiRenderComponent = (ci, opts) => {
  return doRenderComponent(ci.builder(opts));
};

export type UiBuildBinding = <T extends CI>(
  ci: UIBaseCI<T>,
  opts: T["__options"],
  special: UiSpecialBinding
) => ComponentRenderBinding;
export const buildBinding: UiBuildBinding = (ci, opts, special: UiSpecialBinding) => {
  const vModel: any = {};
  // @ts-ignore
  const modelValueName = ci.modelValue;
  const mvConf: any = opts.vModel;
  if (modelValueName != null && mvConf) {
    if (mvConf?.get && mvConf?.set) {
      vModel[modelValueName] = mvConf.get();
      vModel[`onUpdate:${modelValueName}`] = (value: any) => {
        mvConf.set(value);
        mvConf.onChange && mvConf.onChange(value);
      };
    } else if (mvConf.ref && mvConf.key) {
      vModel[modelValueName] = get(mvConf.ref, mvConf.key);
      vModel[`onUpdate:${modelValueName}`] = (value: any) => {
        set(mvConf.ref, mvConf.key, value);
        mvConf.onChange && mvConf.onChange(value);
      };
    } else {
      console.warn("vModel配置错误:", ci, mvConf);
    }
  }

  const userBinding = {
    is: opts.is || ci.name,
    props: opts.props,
    slots: opts.slots
  };

  const specialBinding = special instanceof Function ? special() : special;
  const merged = merge(
    {
      props: vModel
    },
    specialBinding,
    userBinding
  );
  // console.log("buildBinding", merged);
  return merged;
};

//export type UIBaseCI<T> = Partial<T>;
// @ts-ignore
export type UIBaseCI<T> = Omit<T, keyof BaseCI> & Partial<Pick<T, keyof BaseCI>>;
export type UIComponentCreator = <T extends CI>(ci: UIBaseCI<T>, special?: UiSpecialBinding) => T;

export const creator: UIComponentCreator = <T extends CI>(ci: UIBaseCI<T>, special: UiSpecialBinding = {}): T => {
  const extendCI: any = { ...ci };
  extendCI.render = (opts: any) => {
    return renderComponent(extendCI, opts);
  };
  if (!extendCI.builder) {
    extendCI.builder = (opts: any) => {
      return buildBinding(extendCI, opts, special);
    };
  }
  extendCI.buildProps = (opts: any) => {
    return extendCI.builder(opts).props;
  };
  extendCI.builderComputed = (opts: any) => {
    return computed(() => {
      return extendCI.builder(opts);
    });
  };
  return extendCI as T;
};

export function useUiRender(): UiRenderHelper {
  return {
    creator,
    doRenderComponent,
    renderComponent,
    buildBinding
  };
}
