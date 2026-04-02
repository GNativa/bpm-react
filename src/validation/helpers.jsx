import { useEffect } from "react";
import { useWatch } from "react-hook-form";

// TODO: possibilitar notificar campos de fieldArray também
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

  return values;
}

export function useDependentValidations(form, dependencies) {
  const watched = {};

  for (const dependency of dependencies) {
    watched[dependency.watch] = useDependentValidation({
      form,
      watch: dependency.watch,
      trigger: dependency.trigger,
    });
  }

  return watched;
}

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  arrayName: string,
 *  index: number,
 *  dependency: FieldArrayValidationDependency,
 * }} 
 * @returns 
 */
export function useDependentFieldArrayValidation({
  form,
  arrayName,
  index,
  dependency,
}) {
  const fieldPath = `${arrayName}.${index}.${dependency.fieldName}`;

  const itemValue = useWatch({
    control: form.control,
    name: fieldPath,
    defaultValue: dependency.defaultValue,
  });

  useEffect(() => {
    const shouldTrigger = dependency.targetFields.some(
      (field) => {
        return form.formState.touchedFields?.[arrayName]?.[index]?.[field]
          || form.formState.errors?.[arrayName]?.[index]?.[field];
      }
    );

    if (shouldTrigger) {
      form.trigger(
        dependency.targetFields.map(
          target => `${arrayName}.${index}.${target}`
        )
      );
    }
  }, [
    itemValue,
    form.formState.errors?.[arrayName]?.[index],
    form.formState.touchedFields?.[arrayName]?.[index],
  ]);

  return itemValue;
}

/**
 * @param {import("react-hook-form").UseFormReturn} form 
 * @param {{
 *  arrayName: string, index: number, dependency: FieldArrayValidationDependency
 * }[]} dependencies 
 * @returns 
 */
export function useDependentFieldArrayValidations(form, dependencies) {
  const watched = {};

  for (const dependency of dependencies) {
    watched[dependency.dependency.fieldName] = useDependentFieldArrayValidation({
      form,
      arrayName: dependency.arrayName,
      index: dependency.index,
      dependency: dependency.dependency,
    });
  }

  return watched;
}