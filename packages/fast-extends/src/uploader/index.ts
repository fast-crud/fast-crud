import FsUploaderType from "./type";
export * from "./type";
export * from "./d";
export * from "./components/libs/";
export * from "./components/utils";
import { ColumnCompositionProps, CrudOptions, utils } from "@fast-crud/fast-crud";
// @ts-ignore
const asyncModules = import.meta.glob("./components/*.vue");
// @ts-ignore
const syncModules = import.meta.glob("./components/fs-images-format.vue", { eager: true });

import { useColumns } from "@fast-crud/fast-crud";

const { registerMergeColumnPlugin } = useColumns();

import { merge } from "lodash-es";
import { FsUploaderOptions } from "./d/type";
registerMergeColumnPlugin({
  name: "uploader-merge-plugin",
  order: 5,
  handle: (columnProps: ColumnCompositionProps = {}, crudOptions: CrudOptions = {}) => {
    if (typeof columnProps.type === "string" && columnProps.type.endsWith("uploader")) {
      const buildUrl = columnProps.buildUrl;
      const buildUrls = columnProps.buildUrls;
      merge(columnProps, {
        form: {
          component: {
            buildUrl,
            buildUrls
          }
        },
        column: {
          component: {
            buildUrl,
            buildUrls
          }
        }
      });
    }
    return columnProps;
  }
});

const FsUploaderComponents = {
  install(app: any) {
    //加载异步组件，异步组件将会被懒加载，所以不用担心打包之后的体积问题
    utils.vite.installAsyncComponents(app, asyncModules, ["FsImagesFormat"], null, null);
    utils.vite.installSyncComponents(app, syncModules, null, null, null);
  }
};

export const FsExtendsUploader = {
  install(app: any, options: FsUploaderOptions) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
