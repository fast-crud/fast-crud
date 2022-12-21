<template>
  <div class="fs-image-format">
    <component :is="$fsui.imageGroup.name" v-bind="wrapper">
      <component
        :is="$fsui.image.name"
        v-for="item in imageListRef"
        :key="item.src"
        class="fs-image-item"
        v-bind="item"
      >
        <template #placeholder>
          <div class="fs-image-slot">
            <fs-loading :loading="true" />
          </div>
        </template>

        <template #error>
          <div class="fs-image-slot">
            <img :src="error" style="max-width: 50%" />
          </div>
        </template>
      </component>
    </component>
  </div>
</template>

<script lang="ts">
import { computed, Ref, ref, watch } from "vue";
import { useUi } from "@fast-crud/fast-crud";
// 图片行展示组件
export default {
  name: "FsImagesFormat",
  inheritAttrs: false,
  props: {
    //包裹image的组件配置，antdv是preview-group，element是div
    wrapper: {},
    // 图片的url
    // 'value' 或 ['value','value']
    modelValue: {
      type: [String, Array],
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
        "data:image/png;base64,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"
    },
    /**
     * 从value构建图片下载url的方法
     * 支持异步
     */
    buildUrl: {
      type: Function,
      default: function (value) {
        return value;
      }
    },
    /**
     * 从value或url构建预览大图的方法
     * 支持异步
     */
    buildPreviewUrl: {
      type: Function,
      default: function ({ url, value, index }) {
        return url;
      }
    }
  },
  setup(props, ctx) {
    const { ui } = useUi();
    type ImageItem = {
      value?: any;
      url?: string;
      index?: number;
      previewUrl?: string;
    };
    const imageListRef: Ref<any[]> = ref([]);

    const computedValues = computed(() => {
      const urls: any = [];
      if (props.modelValue == null || props.modelValue === "") {
        return urls;
      }
      if (typeof props.modelValue === "string") {
        urls.push(props.modelValue);
      } else {
        for (const item of props.modelValue) {
          if (item == null) {
            continue;
          }
          if (item.url != null) {
            urls.push(item.url);
          } else {
            urls.push(item);
          }
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
        const previewUrl = image.url;
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
          ...ctx.attrs,
          ...preview
        });
      }
      return imageList;
    }

    async function buildImageListByValue(values) {
      const images: ImageItem[] = [];
      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        let url = value;
        if (props.buildUrl) {
          url = await props.buildUrl(value);
        }

        let previewUrl = url;
        if (props.buildPreviewUrl) {
          previewUrl = await props.buildPreviewUrl({
            url,
            value,
            index: i
          });
        }
        images.push({
          url,
          value,
          index: i,
          previewUrl
        });
      }

      return buildImageList(images);
    }

    async function buildImageListByUrls(urls) {
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

    return { imageListRef };
  }
};
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
  }

  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    //  height: 100%;
  }

  .el-image-viewer__close {
    color: #fff;
  }

  .el-image__error,
  .el-image__inner,
  .el-image__placeholder {
    height: auto;
  }
}
</style>
