import mockUtil from "/src/mock/base";
const options = {
  name: "FormCompute",
  idGenerator: 0
};
const list = [
  {
    compute: true,
    status: "1",
    remote: "2",
    shower: "---> 点右边编辑查看示例效果",
    remote2: "2"
  },
  {
    compute: false,
    status: "2",
    remote: "0",
    remote2: "2"
  },
  {
    compute: true,
    status: "0",
    remote2: "2"
  }
];
options.list = list;
const mock = mockUtil.buildMock(options);
export default mock;
