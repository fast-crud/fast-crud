import types from "../types";
export function useTypes() {
  return {
    addTypes: types.addTypes,
    getType: types.getType,
    getTypes: types.getTypes,
    install: types.install
  };
}
