<template>
  <div class="fs-image-format">
    <component :is="ui.imageGroup.name" v-bind="wrapper">
      <component :is="ui.image.name" v-for="item in imageListRef" :key="item.src" class="fs-image-item" v-bind="item">
        <template #placeholder>
          <div class="fs-image-slot">
            <fs-loading :loading="true" v-bind="errorBinding" />
          </div>
        </template>
        <template #error>
          <div class="fs-image-slot">
            <img :src="error" v-bind="errorBinding" />
          </div>
        </template>
      </component>
    </component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from "vue";
import { useUi } from "@fast-crud/fast-crud";
import { merge } from "lodash-es";
// 图片行展示组件
export default defineComponent({
  name: "FsImagesFormat",
  inheritAttrs: false,
  props: {
    //包裹image的组件配置，antdv是preview-group，element是div
    wrapper: {
      type: Object,
      default: null
    },
    // 图片的url
    // 'url' 或 ['url','url'] 或 [{url:'url'}] 或 {url:'url'}
    modelValue: {
      type: [String, Array, Object],
      require: true
    },
    /**
     * 构建好的图片链接，如果此处传值，则不走buildUrl方法
     * 'url' 或 ['url1','url2'] 或 {url,previewUrl} 或 [{url,previewUrl}]
     */
    urls: {
      type: [String, Object, Array]
    },
    /**
     * 加载错误时显示的图片
     */
    error: {
      default:
        'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%23888" d="M5 21q-.825 0-1.413-.588T3 19v-6.6l3 3l4-4l4 4l4-4l3 3V19q0 .825-.588 1.413T19 21H5ZM5 3h14q.825 0 1.413.588T21 5v6.575l-3-3l-4 4l-4-4l-4 4l-3-3V5q0-.825.588-1.413T5 3Z"%2F%3E%3C%2Fsvg%3E'
    },
    /**
     * 从value构建图片下载url的方法
     * 支持异步
     * (value)=>Promise<string>
     */
    buildUrl: {
      type: Function,
      default: function (value: any) {
        return value;
      }
    },
    /**
     * (values)=>Promise<string[]>
     */
    buildUrls: {
      type: Function,
      default: null
    },
    /**
     * 从value或url构建预览大图的方法
     * (url,value)=>Promise<string>
     */
    buildPreviewUrl: {
      type: Function,
      default: function ({ url, value, index }: any) {
        return url;
      }
    },
    /**
     * (list,values)=>Promise<string[]>
     */
    buildPreviewUrls: {
      type: Function,
      default: null
    }
  },
  setup(props: any, ctx) {
    const { ui } = useUi();
    type ImageItem = {
      value?: any;
      url?: string;
      index?: number;
      previewUrl?: string;
    };
    const imageListRef: Ref<any[]> = ref([]);

    const errorBinding = computed(() => {
      return merge({ style: {} }, { style: ctx.attrs.style });
    });

    const computedValues = computed(() => {
      debugger;
      const urls: any = [];
      if (props.modelValue == null || props.modelValue === "") {
        return urls;
      }
      if (typeof props.modelValue === "string") {
        urls.push(props.modelValue);
      } else if (Array.isArray(props.modelValue)) {
        for (const item of props.modelValue) {
          if (item == null) {
            continue;
          }
          if (item.url != null) {
            if (item.previewUrl != null) {
              urls.push(item);
            } else {
              urls.push(item.url);
            }
          } else {
            urls.push(item);
          }
        }
      } else {
        //object
        if (props.modelValue.url != null) {
          if (props.modelValue.previewUrl != null) {
            urls.push(props.modelValue);
          } else {
            urls.push(props.modelValue.url);
          }
        } else {
          urls.push(props.modelValue);
        }
      }
      return urls;
    });

    function buildImageList(images: ImageItem[]) {
      const urls: string[] = [];
      const previewUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        urls.push(image.url as string);
        previewUrls.push(image.previewUrl as string);
      }
      const imageList: any[] = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const url = image.url;
        const previewUrl = image.previewUrl || image.url;
        const preview = ui.image.buildPreviewBind({
          url,
          urls,
          previewUrl,
          previewUrls,
          index: i
        });
        imageList.push({
          fit: "contain",
          src: url,
          [ui.image.fallback]: props.error,
          ...ctx.attrs,
          ...preview
        });
      }
      return imageList;
    }

    async function buildImageListUrls(list: ImageItem[]) {
      if (props.buildUrls) {
        const values = list.map((item) => item.value);
        const urls = await props.buildUrls(values);
        for (let i = 0; i < list.length; i++) {
          list[i].url = urls[i];
        }
        let previewUrls = urls;
        if (props.buildPreviewUrls) {
          previewUrls = await props.buildPreviewUrls(list, values);
        }
        for (let i = 0; i < list.length; i++) {
          list[i].previewUrl = previewUrls[i];
        }
      } else if (props.buildUrl) {
        for (let item of list) {
          item.url = await props.buildUrl(item.value);
          if (props.buildPreviewUrl) {
            item.previewUrl = await props.buildPreviewUrl(item, item.value);
          } else {
            item.previewUrl = item.previewUrl || item.url;
          }
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          list[i].url = list[i].value;
          list[i].previewUrl = list[i].value;
        }
      }
    }

    async function buildImageListByValue(values: any) {
      const images: ImageItem[] = [];
      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        images.push({
          value,
          index: i
        });
      }

      await buildImageListUrls(images);

      return buildImageList(images);
    }

    async function buildImageListByUrls(urls: any) {
      const list: ImageItem[] = [];
      if (typeof urls === "string") {
        list.push({
          value: urls,
          url: urls,
          index: 0,
          previewUrl: urls
        });
      } else if (urls instanceof Array) {
        if (urls.length > 0) {
          if (typeof urls[0] === "string") {
            for (let i = 0; i < urls.length; i++) {
              const url = urls[i];
              list.push({
                value: url,
                url: url,
                previewUrl: url,
                index: i
              });
            }
          } else {
            for (let i = 0; i < urls.length; i++) {
              const url = urls[i];
              list.push({
                value: url.url,
                ...url,
                index: i
              });
            }
          }
        }
      } else {
        // is object
        list.push({
          value: urls.url,
          ...urls,
          index: 0
        });
      }

      return buildImageList(list);
    }
    watch(
      () => {
        return computedValues.value;
      },
      async (values) => {
        if (!props.urls) {
          imageListRef.value = await buildImageListByValue(values);
        }
      },
      {
        immediate: true
      }
    );

    watch(
      () => {
        return props.urls;
      },
      async (value) => {
        if (value) {
          imageListRef.value = await buildImageListByUrls(value);
        }
      },
      {
        immediate: true
      }
    );

    return { imageListRef, ui, errorBinding };
  }
});
</script>
<style lang="less">
.fs-image-format {
  display: flex;
  margin: 1px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  .fs-box {
    display: flex;
    align-items: center;
  }

  .fs-image-item {
    border: 1px solid #eee;
    margin: 0 1px;
    object-fit: fill;
    background-color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fs-image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    //  height: 100%;
    width: 100%;
    height: 100%;
  }

  .el-image-viewer__close {
    color: #fff;
  }

  .el-image__error,
  .el-image__inner,
  .el-image__placeholder {
    height: auto;
  }

  .el-image__wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
