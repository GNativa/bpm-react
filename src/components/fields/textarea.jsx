import { FloatingLabel, Form } from "react-bootstrap";

import { buildLabel } from "../layout/helpers";
import { InvalidFeedback } from "../Display";
import { defaultParams } from "../layout/helpers";
import React from "react";

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  errors: import("react-hook-form").FieldErrors,
 *  id: string,
 *  fieldName: string,
 *  label: string,
 *  hint: ?string,
 *  height: number,
 *  required: boolean,
 *  disabled: boolean,
 *  onBlur: React.FocusEventHandler,
 *  onChange: React.ChangeEventHandler,
 * }} props 
 * @returns {import("react").JSX.Element}
 */
export default function TextAreaField({
    form,
    errors,
    id,
    fieldName = id,
    label,
    hint = defaultParams.hint,
    height = 5,
    required = defaultParams.required,
    disabled = defaultParams.disabled,
    onBlur,
    onChange,
}) {
    return (
        <FloatingLabel label={buildLabel(label, hint)} controlId={id}>
            <Form.Control
                {...form.register(id, { onBlur, onChange })}
                as="textarea"
                placeholder={label}
                style={{ height: `${height}lh` }}
                required={required}
                disabled={disabled}
                isInvalid={!!errors?.[fieldName]}
            >
            </Form.Control>
            <InvalidFeedback message={errors?.[fieldName]?.message} />
        </FloatingLabel>
    );
}