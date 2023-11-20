import Schema from "async-validator";
import { EditableCell } from "../../../d";
import { Rules } from "async-validator/dist-types/interface";

export function createValidator(editableCells: Record<string, EditableCell>) {
  const descriptor: Rules = {};
  for (const key in editableCells) {
    const form = editableCells[key].getForm();
    const rules = form.rules || form.rule;
    const keys: string[] = key.split(".");
    let curDesc: any = descriptor;
    if (rules) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!curDesc[key]) {
          curDesc[key] = { type: "object", fields: {} };
        }
        if (i == keys.length - 1) {
          //最后一个
          curDesc[key] = rules;
        } else {
          curDesc = curDesc[key].fields;
        }
      }
    }
  }
  return new Schema(descriptor);
}
// const descriptor = {
//   name: {
//     type: "string",
//     required: true,
//     validator: (rule, value) => value === "muji"
//   },
//   age: {
//     type: "number",
//     asyncValidator: (rule, value) => {
//       return new Promise((resolve, reject) => {
//         if (value < 18) {
//           reject("too young"); // reject with error message
//         } else {
//           resolve();
//         }
//       });
//     }
//   }
// };
// const validator = new Schema(descriptor);
// validator.validate({ name: "muji" }, (errors, fields) => {
//   if (errors) {
//     // validation failed, errors is an array of all errors
//     // fields is an object keyed by field name with an array of
//     // errors per field
//     return handleErrors(errors, fields);
//   }
//   // validation passed
// });
//
// // PROMISE USAGE
// validator
//   .validate({ name: "muji", age: 16 })
//   .then(() => {
//     // validation passed or without error message
//   })
//   .catch(({ errors, fields }) => {
//     return handleErrors(errors, fields);
//   });
