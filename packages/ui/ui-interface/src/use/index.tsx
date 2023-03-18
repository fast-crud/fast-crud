import { BindBuilderOptions, CI, ComponentRenderBinding, UiSlotRet } from "../ui-interface";
import { resolveComponent } from "vue";
import _ from "lodash-es";

const doRenderComponent: UiDoRenderComponent = (binding) => {
  const comp = typeof binding.is === "string" ? resolveComponent(binding.is) : binding.is;
  return <comp {...binding.props} v-slots={binding.slots} v-model={binding.vModel} />;
};

const renderComponent: UiRenderComponent = (ci: CI, opts: BindBuilderOptions) => {
  return doRenderComponent(ci.builder(opts));
};

export type UiSpecialBindingBuilder = () => Partial<ComponentRenderBinding>;
export type UiSpecialBinding = Partial<ComponentRenderBinding> | UiSpecialBindingBuilder;
const buildBinding: UiBuildBinding = (ci, opts, special: UiSpecialBinding) => {
  const vModel: any = {};
  // @ts-ignore
  const modelValueName = ci.modelValue;
  const mvConf: any = opts.vModel;
  if (modelValueName != null && mvConf) {
    if (mvConf?.get && mvConf?.set) {
      vModel[modelValueName] = mvConf.get();
      vModel[`onUpdate:${modelValueName}`] = (value: any) => {
        mvConf.set(value);
      };
    } else if (mvConf.ref && mvConf.key) {
      vModel[modelValueName] = _.get(mvConf.ref, mvConf.key);
      vModel[`onUpdate:${modelValueName}`] = (value: any) => {
        _.set(mvConf.ref, mvConf.key, value);
      };
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
};

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
export function useUiRender(): UiRenderHelper {
  return {
    doRenderComponent,
    renderComponent,
    buildBinding
  };
}
