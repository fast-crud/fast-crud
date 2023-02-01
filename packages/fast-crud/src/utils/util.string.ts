function isEmpty(value?: string | null) {
  return value == null || value === "";
}
function isAllEmpty(...values: any) {
  for (const value of values) {
    if (value == null || value === "") {
    } else {
      return false;
    }
  }
  return false;
}
function hasEmpty(...values: any) {
  for (const value of values) {
    if (value == null || value === "") {
      return true;
    }
  }
  return false;
}
const StringUtils = {
  isEmpty,
  isAllEmpty,
  hasEmpty
};
export default StringUtils;
