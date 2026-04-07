import { Form, FloatingLabel } from "react-bootstrap";
import { InvalidFeedback } from "../Display";
import { buildLabel, defaultParams } from "../layout/helpers";

// TODO: passar etapa atual

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn;
 *  errors: import("react-hook-form").FieldErrors;
 *  id: string;
 *  fieldName: string;
 *  label: string;
 *  hint: ?string;
 *  type: string;
 *  value: string | number | string[];
 *  required: boolean;
 *  disabled: boolean;
 *  onBlur: React.FocusEventHandler;
 *  onChange: React.ChangeEventHandler;
 *  className: ?string | undefined;
 * }} props 
 * @returns {import("react").JSX.Element}
 */
export default function InputField({
    form,
    errors,
    id,
    fieldName = id,
    label,
    hint = defaultParams.hint,
    type = 'text',
    required = defaultParams.required,
    disabled = defaultParams.disabled,
    onBlur,
    onChange,
    className,
}) {
    const options = { onBlur, onChange };

    if (type === 'number') {
        options.setValueAs = (value) => {
            if (value === "") return undefined;
            const parsed = Number(value);
            return isNaN(parsed) ? undefined : parsed;
        };
    }
    else if (type === 'date') {
        options.valueAsDate = true;
    }

    return (
        <FloatingLabel
            label={buildLabel(label, hint)}
            controlId={id}
        >
            <Form.Control
                className={className}
                type={type}
                placeholder={label}
                {...form.register(id, options)}
                isInvalid={!!errors?.[fieldName]}
                required={required}
                disabled={disabled}
            />
            <InvalidFeedback message={errors?.[fieldName]?.message} />
        </FloatingLabel>
    );
}