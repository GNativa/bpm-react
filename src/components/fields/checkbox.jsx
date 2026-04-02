import { Form, FloatingLabel } from "react-bootstrap";
import { InvalidFeedback } from "../Display";
import { buildLabel, defaultParams } from "../layout/helpers";

// TODO: passar etapa atual

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  errors: import("react-hook-form").FieldErrors,
 *  id: string,
 *  fieldName: string,
 *  label: string,
 *  isSwitch: boolean,
 *  hint: ?string,
 *  required: boolean,
 *  disabled: boolean,
 *  onBlur: React.FocusEventHandler,
 *  onChange: React.ChangeEventHandler,
 * }} props 
 * @returns {import("react").JSX.Element}
 */
export default function CheckboxField({
    form,
    errors,
    id,
    fieldName = id,
    label,
    isSwitch = false,
    hint = defaultParams.hint,
    required = defaultParams.required,
    disabled = defaultParams.disabled,
    onBlur,
    onChange,
}) {
    return (
        <Form.Check type={isSwitch ? 'switch' : 'checkbox'}>
            <Form.Check.Input
                id={id}
                {...form.register(id, { onBlur, onChange })}
                type="checkbox"
                required={required}
                disabled={disabled}
                role={isSwitch ? 'switch' : undefined}
                isInvalid={!!errors?.[fieldName]}
            />
            <Form.Check.Label className="ms-2" htmlFor={id}>
                {buildLabel(label, hint)}
            </Form.Check.Label>
            <InvalidFeedback message={errors?.[fieldName]?.message} />
        </Form.Check>
    );
}