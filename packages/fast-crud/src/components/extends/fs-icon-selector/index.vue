<template>
  <div class="fs-icon-selector">
    <component :is="ui.input.name" v-bind="inputBinding" @click="handleClick">
      <template #prefix>
        <fs-icon v-if="modelValue" class="fs-icon-selector-input-prefix" :icon="modelValue"></fs-icon>
      </template>
    </component>

    <div v-if="dialogOpened" class="fs-icon-selector-dialog">
      <component :is="ui.dialog.name" :width="1000" v-bind="computedDialog" :footer="null">
        <template #title>
          <fs-icon icon="icon-select" class="mr-2"></fs-icon>
          选择图标
        </template>
        <div class="fs-icon-selector-dialog-content mb-4">
          <component
            :is="ui.input.name"
            v-model:[ui.input.modelValue]="searchKey"
            class="ml-2"
            placeholder="搜索图标"
            @keydown.enter="handleSearch"
          >
            <template #suffix>
              <fs-button type="primary" icon="ion:search" @click="handleSearch"></fs-button>
            </template>
          </component>

          <div class="icon-tabs-box mt-10 mb-10">
            <component :is="ui.tabs.name">
              <component :is="ui.tabPane.name" v-for="set in iconSets" :key="set" :label="set"> </component>
            </component>

            <div class="icon-container">
              <div
                v-for="icon in pager.records"
                :key="icon"
                class="icon-item"
                :class="{ active: icon === current }"
                :title="icon"
                @click="handleIconSelect(icon, false)"
                @dblclick="handleIconSelect(icon, true)"
              >
                <fs-icon :icon="icon" class="text-2xl"></fs-icon>
              </div>
            </div>
            <div class="footer">
              <div v-if="pager.loading" class="load-more">
                <fs-loading :loading="pager.loading" text="加载中" />
              </div>
              <div v-else-if="pager.total > pager.start + pager.limit" @click="loadMore">
                <div>加载更多</div>
              </div>
            </div>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUi } from "@fast-crud/ui-interface";
import { ref, useAttrs, Ref, computed } from "vue";

defineOptions({
  name: "FsIconSelector"
});

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  dialog: {
    type: Object,
    default: () => ({})
  },
  // 限制每页显示数量
  limit: {
    type: Number,
    default: 20
  },
  iconSets: {
    type: Array,
    default: () => []
  },
  apiProvider: {
    type: String,
    default: "https://api.iconify.design"
  }
});
const { ui } = useUi();

const dialogOpened = ref(false);
const computedDialog = computed(() => {
  return {
    ...props.dialog,
    [ui.dialog.visible]: dialogOpened.value,
    [`onUpdate:${ui.dialog.visible}`]: (val: boolean) => {
      dialogOpened.value = val;
    }
  };
});

const formItemContext = ui.formItem.injectFormItemContext();
const inputBinding = computed(() => {
  return {
    ...attrs,
    [ui.input.modelValue]: props.modelValue,
    [`onUpdate:${ui.input.modelValue}`]: (val: string) => {
      emitChange(val);
    }
  };
});

const emitChange = (val: string) => {
  emit("update:modelValue", val);
  formItemContext?.onChange();
};

const handleClick = () => {
  dialogOpened.value = true;
};

const attrs = useAttrs();

const api = {
  async getCollections() {
    const res = await fetch(`${props.apiProvider}/collections`);
    return await res.json();
  },
  async getIcons(prefix: string) {
    const res = await fetch(`${props.apiProvider}/collection?prefix=${prefix}`);
    return await res.json();
  },
  async search(query: string, pager: any) {
    const start = pager.start ?? 0;
    const limit = pager.limit ?? 50;
    const res = await fetch(`${props.apiProvider}/search?query=${query}&start=${start}&limit=${limit}`);
    return await res.json();
  }
};

const iconStore: Ref = ref({});

const loadIconSet = async (prefix: string) => {
  let sets = iconStore.value[prefix];
  if (!sets) {
    const res = await api.getIcons(prefix);
    sets = res.uncategorized;
    iconStore.value[prefix] = sets;
  }
  return sets;
};

const searchKey = ref("");
const tabKey = ref("all");

const pager = ref({
  loading: false,
  start: 0,
  limit: props.limit ?? 50,
  total: null,
  query: "",
  records: []
});

const handleSearch = async () => {
  if (!searchKey.value) {
    ui.notification.warn("请输入搜索关键字");
    return;
  }
  if (pager.value.loading) {
    return;
  }
  if (pager.value.query !== searchKey.value) {
    //重置start
    pager.value.start = 0;
    pager.value.records = [];
    pager.value.limit = props.limit ?? 50;
  }

  pager.value.loading = true;
  try {
    const res = await api.search(searchKey.value, pager.value);
    pager.value.records = pager.value.records.concat(res.icons);
    pager.value.total = res.total;
    pager.value.limit = res.limit;
    pager.value.query = searchKey.value;
  } finally {
    pager.value.loading = false;
  }
};

const current = ref(props.modelValue);
const handleIconSelect = (icon: string, confirm = false) => {
  current.value = icon;
  if (confirm) {
    onConfirm();
  }
};

const onConfirm = () => {
  dialogOpened.value = false;
  emitChange(current.value);
};

const loadMore = async () => {
  pager.value.start += pager.value.limit;
  await handleSearch();
};
</script>
<style lang="less">
.fs-icon-selector {
  .fs-icon-selector-input-prefix {
    font-size: 18px;
    margin-right: 5px;
  }
}
.fs-icon-selector-dialog-content {
  min-height: 500px;
  .load-more {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .icon-tabs-box {
    display: flex;
    flex-direction: column;

    .icon-container {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .icon-item {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: 1px solid transparent;
        margin: 2px;
        &.active {
          border: 1px solid #409eff;
        }
        &:hover {
          border: 1px solid #6cb3f8;
        }
      }
      .fs-icon {
        font-size: 30px;
        max-width: 96%;
        max-height: 96%;
      }
    }
  }
}
</style>
