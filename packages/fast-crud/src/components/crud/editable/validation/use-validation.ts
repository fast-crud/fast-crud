import Schema from "async-validator";
import { ref } from "vue";
export function useValidation({ formRef, rulesRef, onError, onSuccess }) {
  const validatorRef = ref();
  function resetValidator() {
    validatorRef.value = new Schema(rulesRef.value);
  }
  async function validate() {
    try {
      await validatorRef.value.validate(formRef.value);
    } catch (error) {
      console.log("validate error:", error);
      if (onError) {
        onError(error);
      }
      return error;
    }
    if (onSuccess) {
      onSuccess();
    }
    return true;
  }

  resetValidator();
  return {
    resetValidator,
    validate
  };
}

export function createOne({ key }) {}
