import mockUtil from "/src/mock/base";
const options = {
  name: "CosUploader",
  idGenerator: 0
};
const list = [
  {
    avatar: "http://greper.veryreader.com/extends/avatar.jpg",
    file: ["http://greper.veryreader.com/extends/avatar.jpg", "https://www.baidu.com/img/bd_logo1.png"],
    image: ["http://greper.veryreader.com/extends/avatar.jpg", "https://www.baidu.com/img/bd_logo1.png"],
    image2: ["http://greper.veryreader.com/extends/avatar.jpg", "https://www.baidu.com/img/bd_logo1.png"]
  },
  {
    radio: "2"
  },
  {
    radio: "0"
  }
];
options.list = list;
const mock = mockUtil.buildMock(options);
export default mock;
