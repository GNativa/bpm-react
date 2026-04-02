/**
 * @typedef {{
 *  children: []|import("react").JSX.Element[],
 *  visible: boolean,
 *  width: number,
 *  breakAfter: boolean
 * }} ColumnProps
 */

/** 
 * @typedef {{
 *  field: string, index: number, rowFields: Record<string, any>,
 *  rowErrors: Record<string, ?string|undefined>
 * }} FieldArrayRowBuilder
 */


/**
 * @typedef {{
 *  fieldName: string | string[],
 *  defaultValue: any | Record<string, any> | undefined,
 *  targetFields: string[]
 * }} FieldArrayValidationDependency
 */