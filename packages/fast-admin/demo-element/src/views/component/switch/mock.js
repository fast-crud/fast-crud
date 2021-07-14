import mockUtil from "/src/mock/base";
const options = {
  name: "FormSwitch",
  idGenerator: 0
};
const list = [
  {
    switch: true,
    cellSwitch: true,
    showTarget: "点左边开关显示或隐藏"
  },
  {
    switch: false,
    cellSwitch: true,
    showTarget: "点左边开关显示或隐藏"
  },
  {
    switch: true,
    cellSwitch: false,
    showTarget: "点左边开关显示或隐藏"
  }
];
options.list = list;
const mock = mockUtil.buildMock(options);
export default mock;
