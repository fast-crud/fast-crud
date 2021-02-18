import defaultCrudOptions from './default-crud-options'

export default function ({ crudRef, crudOptions }) {
  const doRefresh = () => {
    crudRef.doRefresh()
  }

  return {
    doRefresh
  }
}
