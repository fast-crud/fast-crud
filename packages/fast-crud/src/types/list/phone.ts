export default function () {
  return {
    "phone-number": {
      form: {
        component: {
          name: "el-phone-number-input"
        }
      },
      column: {
        formatter(row: any, column: any, value: any) {
          let ret = "";
          if (value != null) {
            if (value.callingCode != null) {
              ret += "(+" + value.callingCode + ")";
            } else if (value.countryCode != null) {
              ret += "(" + value.countryCode + ")";
            }
            if (value.phoneNumber != null) {
              ret += value.phoneNumber;
            }
          }
          return ret;
        }
      }
    }
  };
}
