import { SearchPlugin } from "./.vitepress/plugins/vitepress-plugin-search/index";
import { defineConfig } from "vite";
// 载入模块
import { Segment, useDefault } from 'segmentit';

const segmentit = useDefault(new Segment());
// 开始分词
// console.log(segment.doSegment('这是一个基于Node.js的中文分词模块。'));

const options = {

  // 采用分词器优化，
  encode: function (str) {
    return segmentit.doSegment(str,{simple:true});
  },
  tokenize: "forward", // 解决汉字搜索问题。来源：https://github.com/emersonbottero/vitepress-plugin-search/issues/11
  charset:"utf-8",
  language:"zh",
  // 以下代码返回完美的结果，但内存与空间消耗巨大，索引文件达到80M+
  // encode: false,
  // tokenize: "full",

};

export default defineConfig({
  plugins: [SearchPlugin(options)],
});

