import mockUtil from '@/mock/base'
const options = {
  name: 'demo',
  idGenerator: 0
}
const list = [
  {
    date: '2016-05-02',
    status: '0',
    province: 'sz'
  },
  {
    date: '2016-05-04',
    status: '1',
    province: 'sh,sz'
  },
  {
    date: 2232433534511,
    status: '1',
    province: 'gz'
  },
  {
    date: '2016-05-03',
    status: '2',
    province: 'wh,gz'
  }
]
options.list = list
const mock = mockUtil.buildMock(options)
export default mock
