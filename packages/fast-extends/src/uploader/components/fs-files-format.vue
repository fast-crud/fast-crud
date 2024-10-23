<template>
  <div class="fs-files-format">
    <template v-if="computedProps.type === 'text'">
      <span v-for="item in itemsRef" :key="item.url" class="fs-files-item">
        <a :href="item.url" target="_blank" v-bind="computedProps.a">
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
        :color="item.color"
        v-bind="computedProps.tag"
      >
        <a :href="item.url" target="_blank" v-bind="computedProps.a">{{ item.name }}</a>
      </component>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from "vue";
import { useUi } from "@fast-crud/fast-crud";
/**
 * 文件格式化展示组件
 */
export default defineComponent({
  name: "FsFilesFormat",
  props: {
    /**
     * 文件列表
     * 支持格式： `url , {url} , [url1,url2] ,  [{url:url1},{url:url2}]`
     */
    modelValue: {},
    // tag颜色，`【primary, success, warning, danger ,info】`
    color: {
      default: ""
    },
    // 展示类型`【text, tag】`
    type: {
      default: "tag" // `可选【text,tag】`
    },
    // 链接配置
    a: {},
    // tag配置
    tag: {},
    // 构建下载url方法，支持异步
    buildUrl: {},
    // 批量构建下载url方法，支持异步
    buildUrls: {},
    // 根据value构建文件名
    getFileName: {}
  } as any,
  setup(props: any, ctx) {
    const { ui } = useUi();
    const getFileName = computed(() => {
      return (
        // @ts-ignore
        props.getFileName ||
        function (url: any) {
          if (typeof url !== "string") {
            console.warn("获取文件名失败，请配置getFileName");
            return url;
          }
          if (url?.lastIndexOf("/") >= 0) {
            return url.substring(url.lastIndexOf("/") + 1);
          }
          return url;
        }
      );
    });
    function getItem(value: any): any {
      return {
        url: undefined,
        value: value,
        name: getFileName.value(value),
        // @ts-ignore
        color: props.color
      };
    }

    async function buildFileListUrls(list: any[]) {
      // @ts-ignore
      if (props.buildUrls) {
        const values = list.map((item) => item.value);
        // @ts-ignore
        const urls = await props.buildUrls(values);
        for (let i = 0; i < list.length; i++) {
          list[i].url = urls[i];
        }
        // @ts-ignore
      } else if (props.buildUrl) {
        for (let item of list) {
          // @ts-ignore
          item.url = await props.buildUrl(item.value);
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          list[i].url = list[i].value;
        }
      }
    }

    async function buildItems() {
      // @ts-ignore
      if (props.modelValue == null || props.modelValue === "") {
        return [];
      }
      let valueArr = [];
      // @ts-ignore
      if (typeof props.modelValue === "string") {
        // @ts-ignore
        valueArr = [getItem(props.modelValue)];
        // @ts-ignore
      } else if (props.modelValue instanceof Array) {
        // 本来就是数组的
        valueArr = [];
        // @ts-ignore
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
        // @ts-ignore
        return props.modelValue;
      },
      async () => {
        itemsRef.value = await buildItems();
      },
      {
        immediate: true
      }
    );
    const computedProps = computed(() => {
      return {
        ...props
      };
    });
    return {
      ui,
      itemsRef,
      computedProps
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
