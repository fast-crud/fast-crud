import { BindBuilderOptions, CI, ComponentRenderBinding, UiSlotRet } from "../ui-interface";
import { resolveComponent } from "vue";
import _ from "lodash-es";

export type UiSpecialBindingBuilder = () => Partial<ComponentRenderBinding>;
export type UiSpecialBinding = Partial<ComponentRenderBinding> | UiSpecialBindingBuilder;

export type UiBuildBinding = <P extends BindBuilderOptions>(
  ci: CI,
  opts: P,
  special: UiSpecialBinding
) => ComponentRenderBinding;
export type UiRenderComponent = <T extends CI, P extends BindBuilderOptions>(ci: T, opts: P) => UiSlotRet;
export type UiDoRenderComponent = (binding: ComponentRenderBinding) => UiSlotRet;

export type UiRenderHelper = {
  renderComponent: UiRenderComponent;

  doRenderComponent: UiDoRenderComponent;
  buildBinding: UiBuildBinding;
};

const doRenderComponent: UiDoRenderComponent = (binding: ComponentRenderBinding) => {
  const comp = typeof binding.is === "string" ? resolveComponent(binding.is) : binding.is;
  return <comp {...binding.props} v-slots={binding.slots} />;
};
export function useUiRender(): UiRenderHelper {
  return {
    doRenderComponent,
    renderComponent(ci: CI, opts: BindBuilderOptions) {
      return doRenderComponent(ci.builder(opts));
    },
    buildBinding(ci, opts, special: UiSpecialBinding) {
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
          vModel[modelValueName] = _.get(mvConf.ref, mvConf.key);
          vModel[`onUpdate:${modelValueName}`] = (value: any) => {
            _.set(mvConf.ref, mvConf.key, value);
            mvConf.onChange && mvConf.onChange(value);
          };
          console.log("vModel", vModel);
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
      return _.merge(
        {
          props: vModel
        },
        specialBinding,
        userBinding
      );
    }
  };
}
