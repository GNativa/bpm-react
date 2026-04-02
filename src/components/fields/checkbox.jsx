import { Form, FloatingLabel } from "react-bootstrap";
import { InvalidFeedback } from "../Display";
import { buildLabel, defaultParams } from "../layout/helpers";

// TODO: passar etapa atual

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  errors: import("react-hook-form").FieldErrors,
 *  id: string,
 *  label: string,
 *  isSwitch: boolean,
 *  hint: ?string,
 *  required: boolean,
 *  disabled: boolean,
 * }} props 
 * @returns {import("react").JSX.Element}
 */
export default function CheckboxField({
    form,
    errors,
    id,
    label,
    isSwitch = false,
    hint = defaultParams.hint,
    required = defaultParams.required,
    disabled = defaultParams.disabled,
}) {
    return (
        <Form.Check type={isSwitch ? 'switch' : 'checkbox'}>
            <Form.Check.Input
                id={id}
                {...form.register(id)}
                type="checkbox"
                required={required}
                disabled={disabled}
                role={isSwitch ? 'switch' : undefined}
            />
            <Form.Check.Label className="ms-2" htmlFor={id}>
                {buildLabel(label, hint)}
            </Form.Check.Label>
            <InvalidFeedback message={errors?.[id]?.message} />
        </Form.Check>
    );
}