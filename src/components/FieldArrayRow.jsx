import { useDependentFieldArrayValidations } from "../validation/helpers";

/** 
 * @typedef {{
 *  field: string, index: number, rowFields: Record<string, any>,
 *  rowErrors: Record<string, ?string|undefined>
 * }} FieldArrayRowBuilder
 */

/**
 * @param {{
 *  validationDependencies: Object[],
 *  field: string, 
 *  arrayName: string,
 *  index: number,
 *  fieldIds: string[],
 *  builder: function(FieldArrayRowBuilder): import("react").JSX.Element
 * }}
 * @returns
 */
export default function FieldArrayRow({
    form,
    field,
    arrayName,
    index,
    validationDependencies = [],
    fieldIds,
    builder
}) {
    const mappedDependencies = validationDependencies.map(v => ({
        form, arrayName, index,
        fieldName: v.fieldName,
        targetFields: v.targetFields,
    }));
    
    const watched = useDependentFieldArrayValidations(form, mappedDependencies);
    const rowFields = buildIds(fieldIds, arrayName, index);
    
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