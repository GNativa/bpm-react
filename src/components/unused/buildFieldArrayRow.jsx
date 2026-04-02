import { useDependentFieldArrayValidations } from "../../validation/helpers";

/**
 * @param {{
 *  field: string, 
 *  arrayName: string,
 *  index: number,
 *  fieldNames: string[],
 *  validationDependencies: FieldArrayValidationDependency[],
 *  builder: function(FieldArrayRowBuilder): ColumnProps[]
 * }}
 * @returns
 */
export default function buildFieldArrayRow({
    form,
    field,
    arrayName,
    index,
    fieldNames,
    validationDependencies = [],
    builder,
}) {
    const mappedDependencies = validationDependencies.map(v => ({
        form, arrayName, index,
        dependency: v,
    }));

    const watched = useDependentFieldArrayValidations(form, mappedDependencies);
    const rowFields = buildIds(fieldNames, arrayName, index);

    return builder({
        field, index, rowFields, watched,
        rowErrors: form.formState.errors?.[arrayName]?.[index],
    });
}

function buildIds(idList, arrayName, index) {
    const idObject = {};

    for (const id of idList) {
        idObject[id] = `${arrayName}.${index}.${id}`;
    }

    return idObject;
}