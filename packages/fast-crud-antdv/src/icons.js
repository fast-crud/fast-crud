import _ from "lodash";
import {
  PlusCircleOutlined,
  PlusOutlined,
  CheckOutlined,
  EditOutlined,
  ArrowRightOutlined,
  NodeIndexOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  SearchOutlined,
  SyncOutlined,
  DragOutlined,
  AppstoreOutlined,
  ControlOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  SwapOutlined,
  CompressOutlined,
  ExpandOutlined,
  EllipsisOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  UndoOutlined,
  RedoOutlined,
  LikeOutlined
} from "@ant-design/icons-vue";

const icons = {
  SearchOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  CheckOutlined,
  EditOutlined,
  ArrowRightOutlined,
  NodeIndexOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  SyncOutlined,
  DragOutlined,
  AppstoreOutlined,
  ControlOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  SwapOutlined,
  CompressOutlined,
  ExpandOutlined,
  EllipsisOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  UndoOutlined,
  RedoOutlined,
  LikeOutlined
};
export default function(app) {
  _.forEach(icons, (item, key) => {
    app.component(key, item);
  });
}
