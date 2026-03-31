import { useEffect } from "react";
import { useWatch } from "react-hook-form";

// TODO: possibilitar visualizar campos de fieldArray também
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

export function useDependentFieldArrayValidation({ form, arrayName, fieldName, index, targetFields = [] }) {
  const fieldPath = `${arrayName}.${index}.${fieldName}`;

  const itemValue = useWatch({
    control: form.control,
    name: fieldPath,
  });

  useEffect(() => {
    const shouldTrigger = targetFields.some(
      (field) => {
        return form.formState.touchedFields?.[arrayName]?.[index]?.[field]
            || form.formState.errors?.[arrayName]?.[index]?.[field];
      }
    );

    if (shouldTrigger) {
      form.trigger(targetFields.map(target => `${arrayName}.${index}.${target}`));
    }
  }, [
    itemValue,
    form.formState.errors?.[arrayName]?.[index],
    form.formState.touchedFields?.[arrayName]?.[index],
  ]);

  return itemValue;
}

export function useDependentFieldArrayValidations(form, dependencies) {
  const watched = {};

  for (const dependency of dependencies) {
    watched[dependency.fieldName] = useDependentFieldArrayValidation({
      form,
      arrayName: dependency.arrayName,
      fieldName: dependency.fieldName,
      index: dependency.index,
      targetFields: dependency.targetFields,
    });
  }

  return watched;
}