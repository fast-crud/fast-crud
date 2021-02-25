const openStatus = [
  { value: '1', label: '打开', color: '#f50' },
  { value: '2', label: '停止', color: 'cyan' },
  { value: '0', label: '关闭', color: 'red' }
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
