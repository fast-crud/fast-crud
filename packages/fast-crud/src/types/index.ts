import date from './list/date'
import select from './list/select'
import cascade from './list/cascade'
import phone from './list/phone'
import el from './list/el'
import text from './list/text'
/**
 * 根据type获取column的默认配置
 * @type
 */
export default {
  ...date,
  ...select,
  ...cascade,
  ...phone,
  ...el,
  ...text
}
