<template>
  <div class="fs-file-format">
    <template v-if="type === 'text'">
      <span v-for="item in items" class="fs-file-item" :key="item.url">
        <a :href="item.url" target="_blank" v-bind="a">
          {{ item.name }}
        </a>
      </span>
    </template>
    <template v-else>
      <component
        :is="$fsui.tag.name"
        class="fs-tag-item"
        v-for="item in items"
        :key="item.url"
        :type="item.color"
        v-bind="tag"
      >
        <a :href="item.url" target="_blank" v-bind="a">{{ item.name }}</a>
      </component>
    </template>
  </div>
</template>

<script>
// 文件格式化展示组件
export default {
  name: "FsFilesFormat",
  props: {
    // 值
    modelValue: {
      require: true,
    },
    // tag颜色，【primary, success, warning, danger ,info】
    color: {
      require: false,
      default: "primary",
    },
    // 展示类型【text, tag】
    type: {
      default: "tag", // 可选【text,tag】
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
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    items() {
      if (this.modelValue == null || this.modelValue === "") {
        return [];
      }
      let valueArr = [];
      if (typeof this.modelValue === "string") {
        valueArr = [this.getItem(this.modelValue)];
      } else if (this.modelValue instanceof Array) {
        // 本来就是数组的
        valueArr = [];
        for (const val of this.modelValue) {
          valueArr.push(this.getItem(val));
        }
      }
      return valueArr;
    },
  },
  created() {},
  methods: {
    getFileName(url) {
      if (url.lastIndexOf("/") >= 0) {
        return url.substring(url.lastIndexOf("/") + 1);
      }
      return url;
    },
    getItem(value) {
      return {
        url: this.buildUrl(value),
        value: value,
        name: this.getFileName(value),
        color: this.color,
      };
    },
  },
};
</script>
<style lang="less">
.fs-file-format {
  .d2-mb-2 {
    margin-bottom: 2px;
  }
  .d2-mt-2 {
    margin-top: 2px;
  }
  .d2-mr-5 {
    margin-right: 5px;
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
