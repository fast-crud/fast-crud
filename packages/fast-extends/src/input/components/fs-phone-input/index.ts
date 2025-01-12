import FsPhoneInput from "./fs-phone-input.vue";

export async function getParsePhoneNumberFromString({ phoneNumber, countryCode }: any) {
  const phoneNumberLib = await import("libphonenumber-js/max");
  const parsePhoneNumberFromString = phoneNumberLib.parsePhoneNumberFromString;
  const parsing = phoneNumber && countryCode ? parsePhoneNumberFromString(phoneNumber, countryCode) : null;
  return {
    phoneNumber: phoneNumber || null,
    countryCode: countryCode,
    isValid: false,
    ...(parsing
      ? {
          formattedNumber: parsing.number,
          nationalNumber: parsing.nationalNumber,
          isValid: parsing.isValid(),
          type: parsing.getType(),
          formatInternational: parsing.formatInternational(),
          formatNational: parsing.formatNational(),
          uri: parsing.getURI(),
          e164: parsing.format("E.164")
        }
      : null)
  };
}

async function getCountryByValue(value: any) {
  const asyncModules = import.meta.glob("./utils.ts");
  // @ts-ignore
  const { getCountryByValue } = await asyncModules["./utils.ts"]();
  return getCountryByValue(value);
}

/**
 * 校验输入是否正确的电话号码
 * @param rule
 * @param value
 * @param callback
 * @returns {boolean|*}
 */
export async function phoneNumberValidator(rule: any, value: any) {
  if (!value || value.phoneNumber == null || value.phoneNumber === "") {
    return true;
  }

  if (!value.countryCode && value.callingCode) {
    const country = await getCountryByValue(value);
    if (country) {
      value.countryCode = country.countryCode;
    }
  }
  const parse = await getParsePhoneNumberFromString({
    phoneNumber: value.phoneNumber,
    countryCode: value.countryCode
  });
  if (!parse.isValid) {
    console.warn("parse:", parse);
    throw new Error("电话号码错误");
  }
  return true;
}

/**
 * 校验输入是否正确的手机号码
 * @param rule
 * @param value
 * @param callback
 * @returns {boolean|*}
 */
export async function mobileValidator(rule: any, value: any, callback: any) {
  if (
    !value ||
    value.phoneNumber == null ||
    value.phoneNumber === "" ||
    value.countryCode == null ||
    value.countryCode === ""
  ) {
    return true;
  }

  if (!value.countryCode && value.callingCode) {
    const country = await getCountryByValue(value);
    if (country) {
      value.countryCode = country.countryCode;
    }
  }
  const parse = await getParsePhoneNumberFromString({
    phoneNumber: value.phoneNumber,
    countryCode: value.countryCode
  });
  if (!parse.isValid || (parse.type !== "MOBILE" && parse.type !== "FIXED_LINE_OR_MOBILE")) {
    console.warn("parse:", parse);
    throw new Error("手机号错误");
  }
  return true;
}

/**
 * 手机号必填校验
 * @param rule
 * @param value
 * @returns {boolean|*}
 */
export async function mobileRequiredValidator(rule: any, value: any) {
  const noCountryCode = value.countryCode == null || value.countryCode === "";
  const noCallingCode = value.callingCode == null || value.callingCode === "";
  const noPhoneNumber = value.phoneNumber == null || value.phoneNumber === "";
  if (!value || noPhoneNumber || (noCountryCode && noCallingCode)) {
    throw new Error("该项必填");
  }
  return true;
}
export { FsPhoneInput };
