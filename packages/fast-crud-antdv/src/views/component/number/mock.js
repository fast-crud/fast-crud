import mockUtil from "/src/mock/base";
const options = {
  name: "FormNumber",
  idGenerator: 0,
};
const list = [
  {
    number: 1,
  },
  {
    number: 2,
  },
  {
    number: 3,
  },
];
options.list = list;
const mock = mockUtil.buildMock(options);
export default mock;
