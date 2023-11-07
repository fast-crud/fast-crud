<template>
  <div class="fs-phone-input">
    <fs-dict-select
      :disabled="disabled"
      :readonly="readonly"
      :filterable="filterable"
      :clearable="clearable"
      :options="countryOptions"
      :dict="countryDict"
      :show-search="true"
      :allow-clear="true"
      v-bind="computedSelect"
    />
    <component
      :is="ui.input.name"
      type="text"
      :clearable="clearable"
      :disabled="disabled"
      :readonly="readonly"
      :allow-clear="true"
      v-bind="computedInput"
    >
    </component>
  </div>
</template>
<script lang="ts" setup>
import { countries } from "./phoneCodeCountries.js";
import { computed, ref, watch } from "vue";
import { dict, useUi } from "@fast-crud/fast-crud";
import _ from "lodash-es";
const { ui } = useUi();

type PhoneInputValue = {
  callingCode: string;
  countryCode: string;
  phoneNumber: string;
};

type PhoneInputProps = {
  /**
   * 选择框参数
   */
  select?: {
    width?: string;
    placeholder?: string;
    [key: string]: any;
  };

  /**
   * 号码框参数
   */
  input?: {
    placeholder?: string;
    [key: string]: any;
  };
  /**
   * 输入输出值
   */
  modelValue?: PhoneInputValue; // 结构
  /**
   * 仅限哪些国家
   */
  onlyCountries?: string[];
  /**
   * 忽略哪些国家
   */
  ignoredCountries?: string[];
  /**
   * 优先哪些国家
   */
  priorityCountries?: string[];

  clearable?: boolean;
  filterable?: boolean;
  /**
   * 默认国家
   */
  defaultCountry?: string;
  disabled?: boolean;
  readonly?: boolean;
};
const formValidator = ui.formItem.injectFormItemContext();
const props = withDefaults(defineProps<PhoneInputProps>(), {
  modelValue: {
    callingCode: undefined, // 电话区号
    countryCode: undefined, // 国家代码
    phoneNumber: undefined // 电话号码
  },
  defaultCountry: "CN"
});

const emits = defineEmits(["change", "input", "update:modelValue"]);
// eslint-disable-next-line vue/no-setup-props-destructure
const selectValue = ref<PhoneInputValue>(
  props.modelValue || {
    callingCode: undefined, // 电话区号
    countryCode: undefined, // 国家代码
    phoneNumber: undefined // 电话号码
  }
);

const countryDict = dict({
  value: "iso2",
  label: "label"
});

const countryOptions = computed(() => {
  let options = [];
  if (props.onlyCountries != null && props.onlyCountries.length > 0) {
    for (let country of countries) {
      if (props.onlyCountries.find((item) => item.toLowerCase() === country.iso2.toLowerCase())) {
        options.push(country);
      }
    }
  } else {
    const priorityCountries = props.priorityCountries || [];
    const ignoredCountries = props.ignoredCountries || [];
    const priorities = [];
    const leaved = [];
    for (let country of countries) {
      if (priorityCountries.find((item) => item.toLowerCase() === country.iso2.toLowerCase())) {
        priorities.push(country);
      }
      if (!ignoredCountries.find((item) => item.toLowerCase() === country.iso2.toLowerCase())) {
        leaved.push(country);
      }
    }
    options = priorities.concat(leaved);
  }

  options = options.map((item) => {
    return {
      ...item,
      label: item.name + "(" + item.dialCode + ")"
    };
  });
  return options;
});

const computedSelect = computed(() => {
  const def = {
    placeholder: "请选择",
    [ui.select.filterable]: true,
    [ui.select.clearable]: true,
    [ui.select.modelValue]: selectValue.value.countryCode,
    ["onUpdate:" + ui.select.modelValue]: handleSelectInput
  };
  return _.merge(def, props.select);
});

const computedInput = computed(() => {
  const def: any = {
    placeholder: "请输入",
    [ui.select.clearable]: true,
    [ui.input.modelValue]: selectValue.value.phoneNumber,
    [`onUpdate:${ui.input.modelValue}`]: handleNumberInput
  };
  return _.merge(def, props.input);
});

function isChanged(value) {
  if (value === selectValue.value) {
    return false;
  }
  return true;
  // if (value && selectValue.value) {
  //   return (
  //     value.callingCode !== selectValue.value.callingCode ||
  //     value.countryCode !== selectValue.value.countryCode ||
  //     value.phoneNumber !== selectValue.value.phoneNumber
  //   );
  // } else {
  //   return value !== selectValue.value;
  // }
}

function setValue(value) {
  selectValue.value = { callingCode: undefined, countryCode: undefined, phoneNumber: undefined };
  const ret = getCountryByValue(value);
  if (ret != null) {
    selectValue.value.callingCode = ret.callingCode;
    selectValue.value.countryCode = ret.countryCode;
  }
  if (value && value.phoneNumber) {
    selectValue.value.phoneNumber = value.phoneNumber;
  } else {
    selectValue.value.phoneNumber = undefined;
  }
}
function getCountryByValue(value) {
  let ret = null;
  if (value != null) {
    if (value.countryCode != null) {
      ret = countryOptions.value.find((item) => item.iso2 === value.countryCode);
    } else if (value.callingCode != null) {
      ret = countryOptions.value.find((item) => item.dialCode === value.callingCode);
    }
  }
  if (ret != null) {
    ret = {
      callingCode: ret.dialCode,
      countryCode: ret.iso2
    };
  }
  if (ret == null) {
    ret = getCountryByValue({ countryCode: props.defaultCountry });
  }
  return ret;
}

function handleSelectInput(countryCode) {
  changeCountry(countryCode);
  let emitValue = getEmitValue();
  emits("update:modelValue", emitValue);
  emits("input", emitValue);
  emits("change", emitValue);
  formValidator.onChange();
  formValidator.onBlur();
}

function handleNumberInput(number) {
  selectValue.value.phoneNumber = number;
  if (selectValue.value.callingCode == null && selectValue.value.countryCode == null) {
    selectValue.value.countryCode = defaultCountry;
    const country = getCountryByValue(selectValue.value);
    if (country) {
      selectValue.value.callingCode = country.callingCode;
    }
  }
  let emitValue = getEmitValue();
  emits("update:modelValue", emitValue);
  emits("input", emitValue);
  emits("change", emitValue);
  formValidator.onChange();
  formValidator.onBlur();
}

function getEmitValue() {
  return {
    countryCode: selectValue.value.countryCode,
    callingCode: selectValue.value.callingCode,
    phoneNumber: selectValue.value.phoneNumber
  };
}

function changeCountry(countryCode) {
  if (!countryCode) {
    selectValue.value.callingCode = undefined;
  }
  selectValue.value.countryCode = countryCode;
  let ret = getCountryByValue(selectValue.value);
  if (ret) {
    selectValue.value.callingCode = ret.callingCode;
  }
}

watch(
  () => {
    return props.modelValue;
  },
  (value, oldValue) => {
    setValue(value);
    emits("change", selectValue.value);
  },
  {
    immediate: true
  }
);
</script>
<style lang="less">
.fs-phone-input {
  display: flex;
  align-items: center;
  .ant-select {
    width: 120px;
    max-width: 50%;
    .ant-select-selector {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .ant-input,
  .ant-input-affix-wrapper {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    border-left: 0;
  }

  .el-select {
    width: 100px;
    max-width: 50%;

    .el-input {
      border-right: 0;
    }
    .el-input__wrapper {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .el-input {
    border-left: 0;
    .el-input__wrapper {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      border-left: 0;
    }
  }

  .n-select {
    width: 100px;
    max-width: 50%;
    .n-base-selection {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .n-base-selection__border {
      border-right: 0;
    }
  }

  .n-input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
}
</style>
