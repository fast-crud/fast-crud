<template>
  <div class="fs-icon-selector">
    <component :is="ui.input.name" v-bind="inputBinding" @click="handleClick">
      <template #prefix>
        <fs-icon v-if="modelValue" class="fs-icon-selector-input-prefix" :icon="modelValue"></fs-icon>
      </template>
    </component>

    <div v-if="dialogOpened" class="fs-icon-selector-dialog">
      <component :is="ui.dialog.name" preset="dialog" v-bind="computedDialog" :footer="null">
        <template #[ui.dialog.titleSlotName]>
          <fs-icon icon="icon-select" class="mr-2"></fs-icon>
          选择图标
        </template>
        <div class="fs-icon-selector-dialog-content mb-4">
          <div class="icon-tabs-box mt-10 mb-10">
            <component :is="ui.tabs.name" v-bind="computeTabs" type="card">
              <component :is="ui.tabPane.name" key="all" :[ui.tabPane.key]="'all'" :[ui.tabPane.tab]="'全部'">
              </component>
              <component
                :is="ui.tabPane.name"
                v-for="set of iconSets"
                :key="set"
                :[ui.tabPane.key]="set"
                :[ui.tabPane.tab]="set"
              >
              </component>
            </component>

            <component
              :is="ui.input.name"
              v-model:[ui.input.modelValue]="searchKey"
              class="ml-2"
              placeholder="搜索图标, 双击选择"
              @keydown.enter="handleSearch"
            >
              <template #suffix>
                <fs-button type="primary" size="small" :icon="ui.icons.search" @click="handleSearch"></fs-button>
              </template>
            </component>

            <div class="icon-container">
              <div class="icon-list">
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

              <div class="load-more">
                <fs-loading v-if="pager.loading" :loading="pager.loading" text="加载中" />
                <div v-else-if="pager.total == null || pager.total == 0">
                  <div>暂无数据</div>
                </div>
                <div v-else-if="pager.total > pager.start + pager.limit" @click="loadMore">
                  <div>加载更多</div>
                </div>
              </div>
            </div>
            <div class="footer">
              <fs-button type="primary" @click="onConfirm">确定</fs-button>
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
const defaultLimit = 136;
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  dialog: {
    type: Object,
    default: () => ({})
  },
  tabs: {
    type: Object,
    default: () => ({})
  },
  // 限制每页显示数量
  limit: {
    type: Number,
    default: 136
  },
  iconSets: {
    type: Array<string>,
    default: () => ["carbon", "ion", "ant-design", "fa-solid", "fa-brands", "fa-regular", "mdi"]
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
    width: 1024,
    style: {
      width: "1024px"
    },
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
  if (props.iconSets.length > 0 && pager.value.records.length === 0) {
    onTabChange(props.iconSets[0] as string);
  }
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
    const uncategories = res.uncategorized ?? [];
    const categories = res.categories ?? [];
    sets = uncategories;
    for (const key in categories) {
      sets = sets.concat(categories[key]);
    }
    sets = sets.map((item: any) => `${prefix}:${item}`);
    iconStore.value[prefix] = sets;
  }
  return sets;
};

const searchKey = ref("");
const tabKey = ref("all");
const onTabChange = (key: string) => {
  tabKey.value = key;
  searchKey.value = "";
  resetPager();
  handleSearch();
};

const resetPager = () => {
  pager.value.start = 0;
  pager.value.records = [];
  pager.value.total = 0;
  pager.value.limit = props.limit ?? defaultLimit;
};

const pager = ref({
  loading: false,
  start: 0,
  limit: props.limit ?? defaultLimit,
  total: null,
  query: "",
  records: []
});

const handleSearch = async () => {
  if (pager.value.loading) {
    return;
  }
  if (pager.value.query !== searchKey.value) {
    //重置start
    resetPager();
  }

  pager.value.loading = true;
  try {
    const res = await doSearch();
    pager.value.records = pager.value.records.concat(res.icons);
    pager.value.total = res.total;
    pager.value.limit = res.limit;
    pager.value.query = searchKey.value;
  } finally {
    pager.value.loading = false;
  }
};

async function doSearch() {
  if (tabKey.value === "all") {
    if (!searchKey.value) {
      ui.notification.warn("请输入搜索关键字");
      return;
    }
    return await api.search(searchKey.value, pager.value);
  } else {
    return await getPagerFromIconSet(tabKey.value);
  }
}

async function getPagerFromIconSet(prefix: string) {
  const icons = await loadIconSet(prefix);
  let filters = icons;
  if (searchKey.value) {
    filters = icons.filter((icon: string) => icon.includes(searchKey.value));
  }
  let end = pager.value.start + pager.value.limit;
  if (end > filters.length) {
    end = filters.length;
  }
  const pagerIcons = filters.slice(pager.value.start, end);
  return {
    icons: pagerIcons,
    total: filters.length,
    limit: pager.value.limit,
    start: pager.value.start
  };
}

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

const computeTabs = computed(() => {
  return {
    ...props.tabs,
    [ui.tabs.modelValue]: tabKey.value,
    [`onUpdate:${ui.tabs.modelValue}`]: onTabChange
  };
});
</script>
<style lang="less">
.fs-icon-selector {
  .fs-icon-selector-input-prefix {
    font-size: 18px;
    margin-right: 5px;
  }
}
.fs-icon-selector-dialog-content {
  .icon-tabs-box {
    display: flex;
    flex-direction: column;
    min-height: 500px;
    max-height: 60vh;

    .load-more {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      width: 100%;
    }

    .footer {
      display: flex;
      justify-content: end;
      align-items: center;
      padding: 10px;
    }
    overflow: hidden;
    .icon-container {
      margin-top: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      .icon-list {
        width: 100%;
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
}
</style>
