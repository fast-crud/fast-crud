import { IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

export type FsEditorConfig = {
  wangEditor?: any;
  wangEditor5?: FsEditorWang5Config;
};
export type FsEditorWang5Config = { editorConfig: IEditorConfig; toolbarConfig: IToolbarConfig };
export const defaultConfig = {
  wangEditor: {},
  wangEditor5: {
    editorConfig: {},
    toolbarConfig: {}
  }
} as FsEditorConfig;
