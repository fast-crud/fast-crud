import DefaultTypes from '../types/index.ts'

function getTypes () {
  return DefaultTypes
}

function getType (key) {
  return DefaultTypes[key]
}
const TypesUtil = {
  getType: getType,
  addTypes (newTypes) {
    for (const key in newTypes) {
      DefaultTypes[key] = newTypes[key]
    }
  },
  getTypes: getTypes
}

export default TypesUtil
