import form from "./lib/form";
import alioss from "./lib/alioss";
import cos from "./lib/cos";
import qiniu from "./lib/qiniu";
const types = { form, qiniu, alioss, cos };
export default {
  async get(type) {
    return types[type];
  },
};
