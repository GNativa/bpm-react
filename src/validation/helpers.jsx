import { useEffect } from "react";
import { useWatch } from "react-hook-form";

export function useDependentValidation(form, { watch, trigger }) {
  const values = useWatch({
    control: form.control,
    name: watch,
  });

  useEffect(() => {
    const shouldValidate = trigger.some(
      (field) => form.formState.touchedFields[field]
              || form.formState.errors[field]
    );

    if (shouldValidate) {
      form.trigger(trigger);
    }
  }, [values, form.formState.touchedFields, form.formState.errors]);
}

export function useDependentValidations(form, dependencies) {
  for (const dependency of dependencies) {
    useDependentValidation({
      form,
      watch: dependency.watch,
      trigger: dependency.trigger,
    });
  }
}