<template>
  <span class="fs-uploader-form"></span>
</template>
<script>
import _ from "lodash-es";
import ajax from "./utils/ajax";
import { useUploader, buildKey } from "./utils/index";
import { getCurrentInstance } from "vue";
/**
 *
 * @param option {file,filename,action,data,headers}
 * @param options
 * @returns {Promise<unknown>}
 */
async function doUpload({ file, fileName, onProgress, options }) {
  const key = await buildKey(file, fileName, options);
  if (options.data == null) {
    options.data = {};
  }
  options.data.key = key;
  const ajaxOptions = {
    file,
    onProgress,
    ...options
  };
  logger.debug("upload ajaxOptions ", key, ajaxOptions);
  return new Promise((resolve, reject) => {
    ajax(
      ajaxOptions,
      async (res) => {
        try {
          const url = await options.successHandle(res, ajaxOptions);
          if (url && typeof url === "object" && url.key == null) {
            url.key = key;
          }
          resolve(url);
        } catch (e) {
          reject(e);
        }
      },
      (e) => {
        reject(e);
      }
    );
  });
}
export default {
  name: "FsUploaderForm",
  setup() {
    const { proxy } = getCurrentInstance();
    const { getConfig } = useUploader(proxy);
    const global = getConfig("form");
    async function upload(context) {
      const config = context.options;
      const options = _.merge(_.cloneDeep(global), config);
      context.options = options;
      return await doUpload(context);
    }
    return { upload };
  }
};
</script>
