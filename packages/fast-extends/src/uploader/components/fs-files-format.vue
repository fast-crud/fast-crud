<template>
  <div class="fs-files-format">
    <template v-if="type === 'text'">
      <span v-for="item in itemsRef" :key="item.url" class="fs-files-item">
        <a :href="item.url" target="_blank" v-bind="a">
          {{ item.name }}
        </a>
      </span>
    </template>
    <template v-else>
      <component
        :is="$fsui.tag.name"
        v-for="item in itemsRef"
        :key="item.url"
        class="fs-tag-item"
        :type="item.color"
        v-bind="tag"
      >
        <a :href="item.url" target="_blank" v-bind="a">{{ item.name }}</a>
      </component>
    </template>
  </div>
</template>

<script>
import { ref, watch } from "vue";
// 文件格式化展示组件
export default {
  name: "FsFilesFormat",
  props: {
    // 值
    modelValue: {
      require: true
    },
    // tag颜色，【primary, success, warning, danger ,info】
    color: {
      require: false,
      default: ""
    },
    // 展示类型【text, tag】
    type: {
      default: "tag" // 可选【text,tag】
    },
    // 链接配置
    a: {},
    // tag配置
    tag: {},
    // 构建下载url方法
    buildUrl: {
      type: Function,
      default: function (value) {
        return value;
      }
    }
  },
  setup(props, ctx) {
    function getFileName(url) {
      if (url?.lastIndexOf("/") >= 0) {
        return url.substring(url.lastIndexOf("/") + 1);
      }
      return url;
    }
    async function getItem(value) {
      return {
        url: await props.buildUrl(value),
        value: value,
        name: getFileName(value),
        color: props.color
      };
    }

    async function buildItems() {
      if (props.modelValue == null || props.modelValue === "") {
        return [];
      }
      let valueArr = [];
      if (typeof props.modelValue === "string") {
        valueArr = [await getItem(props.modelValue)];
      } else if (props.modelValue instanceof Array) {
        // 本来就是数组的
        valueArr = [];
        for (const val of props.modelValue) {
          valueArr.push(await getItem(val));
        }
      }
      return valueArr;
    }
    const itemsRef = ref([]);
    watch(
      () => {
        return props.modelValue;
      },
      async () => {
        itemsRef.value = await buildItems();
      },
      {
        immediate: true
      }
    );

    return {
      itemsRef
    };
  }
};
</script>
<style lang="less">
.fs-files-format {
  display: flex;
  flex-wrap: wrap;
  .fs-form-item,
  .fs-tag-item {
    margin: 1px;
    a {
      text-decoration: none;
    }
  }
  .tag-item {
    margin-right: 10px;
  }
  .el-divider__text,
  .el-link {
    font-size: inherit;
  }
}
</style>
