<template>
  <a-dropdown class="locale-picker">
    <a class="ant-dropdown-link" @click.prevent>
      <span class="iconify" data-icon="ion:language" data-inline="false"></span>
    </a>
    <template #overlay>
      <a-menu @click="changeLocale">
        <a-menu-item v-for="item in languages" :key="item.key" :command="item.key">
          <div class="language-item">
            <span v-if="item.key === current" class="icon-radio">
              <span class="iconify" data-icon="ion:radio-button-on" data-inline="false"></span>
            </span>
            <span v-else class="icon-radio">
              <span class="iconify" data-icon="ion:radio-button-off" data-inline="false"></span>
            </span>
            {{ item.label }}
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import i18n from "../../i18n";
import { computed, inject } from "vue";
import _ from "lodash-es";
export default {
  name: "Locale",
  setup() {
    console.log("i18n", i18n);
    const languages = computed(() => {
      const map = i18n.global.messages?.value || {};
      const list = [];
      _.forEach(map, (item, key) => {
        list.push({
          key,
          label: item.label
        });
      });
      console.log("list", list);
      return list;
    });
    const current = computed(() => {
      return i18n.global.locale.value;
    });

    const routerReload = inject("fn:router.reload");
    const changeLocale = (change) => {
      console.log("change", change);
      i18n.global.locale.value = change.key;
      routerReload();
    };
    return {
      languages,
      current,
      changeLocale
    };
  }
};
</script>

<style lang="less">
.locale-picker {
  display: flex;
  align-items: center;
  .iconify {
    font-size: 20px;
  }
}
.language-item {
  display: flex;
  align-items: center;
  .icon-radio {
    display: flex;
    align-items: center;
  }
  .iconify {
    margin-right: 5px;
  }
}
</style>
