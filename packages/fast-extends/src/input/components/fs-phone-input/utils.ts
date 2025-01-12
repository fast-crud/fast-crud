export async function getCountries() {
  const asyncModules = import.meta.glob("./phoneCodeCountries.ts");
  // @ts-ignore
  const { countries } = await asyncModules["./phoneCodeCountries.ts"]();
  return countries;
}
export async function getCountryByValue(value: any): Promise<any> {
  const countries = await getCountries();
  let ret = null;
  if (value != null) {
    if (value.countryCode != null) {
      ret = countries.find((item) => item.iso2 === value.countryCode);
    } else if (value.callingCode != null) {
      ret = countries.find((item) => item.dialCode === value.callingCode);
    }
  }
  if (ret != null) {
    ret = {
      callingCode: ret.dialCode,
      countryCode: ret.iso2
    };
  }
  return ret;
}
