import mockUtil from "/src/mock/base";
const options = {
  name: "FormUploader",
  idGenerator: 0
};
const list = [
  {
    avatar: "http://greper.veryreader.com/extends/avatar.jpg",
    file: ["http://greper.veryreader.com/extends/avatar.jpg", "https://www.baidu.com/img/bd_logo1.png"],
    pictureCard: ["http://greper.veryreader.com/extends/avatar.jpg", "https://www.baidu.com/img/bd_logo1.png"],
    limit: ["http://greper.veryreader.com/extends/avatar.jpg", "https://www.baidu.com/img/bd_logo1.png"],
    statusRemote: "0"
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
