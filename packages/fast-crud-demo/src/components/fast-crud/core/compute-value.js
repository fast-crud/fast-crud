import _ from 'lodash-es'
import getEachDeep from 'deepdash-es/getEachDeep'
const eachDeep = getEachDeep(_)
export class ComputeValue {
  constructor (computeFn) {
    this.computeFn = computeFn
  }

  static create (computeFn) {
    return new ComputeValue(computeFn)
  }

  static findComputeValues (target) {
    const foundMap = {}
    eachDeep(target, (value, key, parent, context) => {
      if (value instanceof ComputeValue) {
        foundMap[context.path] = value
        return false
      }
      return true
    })

    return foundMap
  }

  static buildBindProps (target, getContextFn, clone = true) {
    const dependValues = ComputeValue.findComputeValues(target)
    if (Object.keys(dependValues).length > 0) {
      if (clone) {
        target = _.cloneDeep(target)
      }
      _.forEach(dependValues, (value, key) => {
        console.log('change by depend value', key, value)
        _.set(target, key, value.computeFn(getContextFn(key, value)))
      })
    }
    return target
  }

  static computed (computed, target, getContextFn, clone = true) {
    return computed(() => {
      return ComputeValue.buildBindProps(target, getContextFn, clone)
    })
  }
}

export function compute (computeFn) {
  return ComputeValue.create(computeFn)
}
