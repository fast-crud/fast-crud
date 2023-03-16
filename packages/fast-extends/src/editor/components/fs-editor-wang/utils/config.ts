/**
 * 默认配置，可参考：https://doc.wangeditor.com/
 */
export default {
  menus: [
    "head",
    "bold",
    "fontSize",
    "fontName",
    "italic",
    "underline",
    "strikeThrough",
    "indent",
    "lineHeight",
    "foreColor",
    "backColor",
    "link",
    "list",
    "todo",
    "justify",
    "quote",
    "emoticon",
    "image",
    "video",
    "table",
    "code",
    "splitLine",
    "undo",
    "redo"
  ],

  // 不显示的菜单
  excludeMenus: [],

  // 隐藏菜单栏提示
  showMenuTooltips: false,

  // 颜色
  colors: ["#000000", "#eeece0", "#1c487f", "#4d80bf"],

  // 配置字体
  fontNames: [
    "黑体",
    "仿宋",
    "楷体",
    "标楷体",
    "华文仿宋",
    "华文楷体",
    "宋体",
    "微软雅黑",
    "Arial",
    "Tahoma",
    "Verdana",
    "Times New Roman",
    "Courier New"
  ],

  // 字号
  fontSizes: {
    "x-small": { name: "10px", value: "1" },
    small: { name: "13px", value: "2" },
    normal: { name: "16px", value: "3" },
    large: { name: "18px", value: "4" },
    "x-large": { name: "24px", value: "5" },
    "xx-large": { name: "32px", value: "6" },
    "xxx-large": { name: "48px", value: "7" }
  },

  // 行高
  lineHeights: ["1", "1.15", "1.6", "2", "2.5", "3"],

  // 粘贴过滤
  pasteFilterStyle: true,

  // 忽略粘贴内容中的图片
  pasteIgnoreImg: true,

  // 是否带cookie
  withCredentials: true,

  // 上传图片接口 如果不配置这个设置，那么就不会开启远程上传功能
  // uploadImgServer = '',

  // 上传图片字段名
  uploadFileName: "file",

  // 最多可以上传2M的图
  uploadImgMaxSize: 2 * 1024 * 1024,

  // 图片类型
  uploadImgAccept: ["jpg", "jpeg", "png", "gif", "bmp"],

  // 一次最多上传 1 个图片
  uploadImgMaxLength: 5,

  // 超时时间
  uploadImgTimeout: 5 * 1000
} as any;
