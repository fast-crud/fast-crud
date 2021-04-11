import _ from "lodash-es";
import components from "./components";
export default {
  install(app) {
    _.forEach(components, (value, key) => {
      app.component(key, value);
    });
  },
};
