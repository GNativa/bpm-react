import { Form, FloatingLabel } from "react-bootstrap";
import { InvalidFeedback } from "../Display";
import { buildLabel, defaultParams } from "../helpers";

// TODO: passar etapa atual

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  errors: import("react-hook-form").FieldErrors,
 *  id: string,
 *  label: string,
 *  hint: ?string,
 *  type: string,
 *  required: boolean,
 *  disabled: boolean,
 *  onBlur: function(React.FocusEventHandler): void
 * }} props 
 * @returns {import("react").JSX.Element}
 */
export default function InputField({
    form,
    errors,
    id,
    label,
    hint = defaultParams.hint,
    type = 'text',
    required = defaultParams.required,
    disabled = defaultParams.disabled,
}) {
    const options = {};

    if (type === 'number') {
        options.setValueAs = (value) => {
            if (value === "") return undefined;
            const parsed = Number(value);
            return isNaN(parsed) ? undefined : parsed;
        };
    }

    return (
        <FloatingLabel
            label={buildLabel(label, hint)}
            controlId={id}
        >
            <Form.Control
                type={type}
                placeholder={label}
                {...form.register(id, options)}
                isInvalid={!!errors?.[id]}
                required={required}
                disabled={disabled}
            />
            <InvalidFeedback message={errors?.[id]?.message} />
        </FloatingLabel>
    );
}