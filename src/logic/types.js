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

/**
 * @typedef {{
 *  name: string;
 *  token: string;
 *  searchField?: string;
 *  columnMap: Record<string, string>; // campo -> nome legível
 *  visibleFields: string[];
 *  keyField: string;
 * }} DataSourceConfig
 */

/**
 * @typedef {{
 *  id: number,
 *  show: boolean;
 *  variant: string;
 *  title: string;
 *  message: string;
 *  autohide: boolean,
 *  delay: ?number;  
 * }} ToastData
 */

export default {};