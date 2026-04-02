import { LabelContent } from "../Display";

export function hideIf(condition) {
    return condition ? 'd-none' : '';
}

/**
 * @param {string} label 
 * @param {?string} tooltip 
 * @returns {import("react").JSX.Element | string}
 */
export function buildLabel(label, tooltip) {
    if (tooltip) {
        return (
            <LabelContent label={label} tooltip={tooltip}/>
        );
    }
    
    return label;
}

export const defaultParams = {
    required: false,
    disabled: false,
    hint: null,
};