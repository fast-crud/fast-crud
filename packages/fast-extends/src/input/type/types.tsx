import { mobileValidator } from "../components/fs-phone-input/index";

export default function () {
  return {
    phone: {
      column: {
        cellRender({ value }: any) {
          if (!value || !value.phoneNumber) {
            return "";
          }
          return (
            <div>
              ({value.callingCode || "86"}){value.phoneNumber}
            </div>
          );
        }
      },
      form: {
        component: {
          name: "fs-phone-input",
          vModel: "modelValue"
        },
        rules: [{ validator: mobileValidator, message: "请填写正确的手机号码" }]
      }
    }
  };
}
