<template>
  <el-dropdown class="locale-picker" placement="bottom" size="small" @command="changeLocale">
    <el-button type="text">
      <span class="iconify" data-icon="ion:language" data-inline="false"></span>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in languages" :key="item.key" :command="item.key">
          <div class="language-item">
            <span class="icon-radio" v-if="item.key === current">
              <span class="iconify" data-icon="ion:radio-button-on" data-inline="false"></span>
            </span>
            <span class="icon-radio" v-else>
              <span class="iconify" data-icon="ion:radio-button-off" data-inline="false"></span>
            </span>
            {{ item.label }}
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import i18n from "../../i18n";
import { computed } from "vue";
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
    const changeLocale = (change) => {
      console.log("change", change);
      i18n.global.locale.value = change;
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
