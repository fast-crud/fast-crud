import _ from 'lodash'
import {
  PlusCircleOutlined,
  PlusOutlined,
  CheckOutlined, EditOutlined,
  ArrowRightOutlined,
  NodeIndexOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  SearchOutlined,
  SyncOutlined,
  DragOutlined,
  AppstoreOutlined,
  ControlOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'

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
  UploadOutlined
}
export default function (app) {
  _.forEach(icons, (item, key) => {
    app.component(key, item)
  })
}
