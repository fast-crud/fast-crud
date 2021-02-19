import mockUtil from '@/mock/base'
const options = {
  name: 'demo',
  idGenerator: 0
}
const list = [
  {
    name: 'aa',
    date: '2016-05-02',
    status: '0',
    province: 'sz'
  },
  {
    name: 'bb',
    date: '2016-05-04',
    status: '1',
    province: 'sh,sz'
  },
  {
    name: 'cc',
    date: 2232433534511,
    status: '1',
    province: 'gz'
  },
  {
    name: 'dd',
    date: '2016-05-03',
    status: '2',
    province: 'wh,gz'
  }
]
options.list = list
const mock = mockUtil.buildMock(options)
export default mock
