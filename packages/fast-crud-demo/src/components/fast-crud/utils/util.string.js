function isEmpty (value) {
  if (value == null || value === '') {
    return true
  }
  return false
}
function isAllEmpty (...values) {
  for (const value of values) {
    if (value == null || value === '') {
    } else {
      return false
    }
  }
  return false
}
function hasEmpty (...values) {
  for (const value of values) {
    if (value == null || value === '') {
      return true
    }
  }
  return false
}
const StringUtils = {
  isEmpty, isAllEmpty, hasEmpty
}
export default StringUtils
