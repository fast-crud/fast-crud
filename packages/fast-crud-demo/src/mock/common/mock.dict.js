const openStatus = [
  { value: '1', label: '打开', color: 'success' },
  { value: '2', label: '停止', color: 'info' },
  { value: '0', label: '关闭', color: 'danger' }
]

export default [
  {
    path: '/dicts/OpenStatusEnum',
    method: 'get',
    handle () {
      return {
        code: 0,
        msg: 'success',
        data: openStatus
      }
    }
  },
  {
    path: '/dicts/_OpenStatusEnum',
    method: 'get',
    handle () {
      return {
        code: 0,
        msg: 'success',
        data: openStatus
      }
    }
  }

]
