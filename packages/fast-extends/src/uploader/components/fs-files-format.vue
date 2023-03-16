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
        :is="ui.tag.name"
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

<script lang="ts">
import { defineComponent, Ref, ref, watch } from "vue";
import { useUi } from "@fast-crud/fast-crud";
// 文件格式化展示组件
export default defineComponent({
  name: "FsFilesFormat",
  props: {
    /**
     * 文件列表
     * 支持格式： url , {url} , [url1,url2] ,  [{url:url1},{url:url2}]
     */
    modelValue: {},
    // tag颜色，【primary, success, warning, danger ,info】
    color: {
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
    // 构建下载url方法，支持异步
    buildUrl: {
      type: Function,
      default: function (value: any) {
        return value;
      }
    },
    buildUrls: {}
  } as any,
  setup(props: any, ctx) {
    const { ui } = useUi();
    function getFileName(url: string) {
      if (url?.lastIndexOf("/") >= 0) {
        return url.substring(url.lastIndexOf("/") + 1);
      }
      return url;
    }
    function getItem(value: any): any {
      return {
        url: undefined,
        value: value,
        name: getFileName(value),
        color: props.color
      };
    }

    async function buildFileListUrls(list: any[]) {
      if (props.buildUrls) {
        const values = list.map((item) => item.value);
        const urls = await props.buildUrls(values);
        for (let i = 0; i < list.length; i++) {
          list[i].url = urls[i];
        }
      } else if (props.buildUrl) {
        for (let item of list) {
          item.url = await props.buildUrl(item.value);
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          list[i].url = list[i].value;
        }
      }
    }

    async function buildItems() {
      if (props.modelValue == null || props.modelValue === "") {
        return [];
      }
      let valueArr = [];
      if (typeof props.modelValue === "string") {
        valueArr = [getItem(props.modelValue)];
      } else if (props.modelValue instanceof Array) {
        // 本来就是数组的
        valueArr = [];
        for (const val of props.modelValue) {
          valueArr.push(getItem(val));
        }
      }
      await buildFileListUrls(valueArr);
      return valueArr;
    }
    const itemsRef: Ref = ref([]);
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
      ui,
      itemsRef
    };
  }
});
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
