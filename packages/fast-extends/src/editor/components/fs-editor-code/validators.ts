const jsonRule = {
  validator: async (rule: any, value: any) => {
    //校验value json的有效性
    if (value) {
      try {
        JSON.parse(value);
      } catch (e: any) {
        console.error(e);
        throw new Error("json格式错误:" + e.message);
      }
    }
  },
  message: "json格式错误"
};

const yamlRule = {
  validator: async (rule: any, value: any) => {
    //校验value yaml的有效性
    if (value) {
      try {
        //@ts-ignore
        const yaml = await import("js-yaml");
        yaml.load(value, { schema: yaml.JSON_SCHEMA });
      } catch (e: any) {
        console.error(e);
        throw new Error("yaml格式错误:" + e.message);
      }
    }
  },
  message: "yaml格式错误"
};

export const FsEditorCodeValidators = {
  jsonRule,
  yamlRule
};
