import mockUtil from "/src/mock/base";
const options = {
  name: "FormSwitch",
  idGenerator: 0,
};
const list = [
  {
    switch: true,
    showTarget: "显示或隐藏",
  },
  {
    switch: false,
    showTarget: "显示或隐藏",
  },
  {
    switch: true,
    showTarget: "显示或隐藏",
  },
];
options.list = list;
const mock = mockUtil.buildMock(options);
export default mock;
