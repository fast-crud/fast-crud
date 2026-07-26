import mockUtil from "/src/mock/base";

const options: any = {
  name: "__COMPONENT_NAME__",
  idGenerator: 0
};

options.list = [
  { name: "示例数据A", status: 1 },
  { name: "示例数据B", status: 0 }
];

const mock = mockUtil.buildMock(options);

export default mock;
