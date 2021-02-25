import DefaultTypes from '../types/index.ts'

function getTypes () {
  return DefaultTypes.defaultTypes
}

function getType (key) {
  return DefaultTypes.defaultTypes[key]
}
const TypesUtil = {
  getType: getType,
  addTypes (newTypes) {
    for (const key in newTypes) {
      DefaultTypes.defaultTypes[key] = newTypes[key]
    }
  },
  getTypes: getTypes
}

export default TypesUtil
