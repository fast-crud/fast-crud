<template>
  <span class="fs-uploader-form"></span>
</template>
<script>
import _ from "lodash-es";
import ajax from "./utils/ajax";
import { useUploader, buildKey } from "./utils/index";
import { getCurrentInstance } from "vue";

function doAjax(ajaxOptions) {
  return new Promise((resolve, reject) => {
    ajax(
      ajaxOptions,
      async (res) => {
        resolve(res);
      },
      (e) => {
        reject(e);
      }
    );
  });
}
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
    timeout:60000,
    ...options
  };
  delete ajaxOptions.uploadRequest;
  const uploadRequest = options.uploadRequest ?? doAjax;
  let res = await uploadRequest(ajaxOptions);
  if (options.successHandle) {
    res = await options.successHandle(res, ajaxOptions);
  }

  if (res && typeof res === "object" && res.key == null) {
    res.key = key;
  }
  return res;
}
export default {
  name: "FsUploaderForm",
  setup() {
    const { proxy } = getCurrentInstance();
    const { getConfig } = useUploader(proxy);
    const global = getConfig("form");
    async function upload(context) {
      context.options = _.merge({}, _.cloneDeep(global), context.options);
      return await doUpload(context);
    }
    return { upload };
  }
};
</script>
