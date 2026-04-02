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
 *  hint: ?string,
 *  type: string,
 *  required: boolean,
 *  disabled: boolean,
 *  multiple: boolean,
 *  onBlur: React.FocusEventHandler,
 *  onChange: React.ChangeEventHandler,
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
    multiple = false,
    onBlur,
    onChange,
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

    const control = (
        <Form.Control
            type={type}
            placeholder={label}
            {...form.register(id, options)}
            isInvalid={!!errors?.[fieldName]}
            required={required}
            disabled={disabled}
            multiple={multiple}
        />
    );

    const invalidFeedback = <InvalidFeedback message={errors?.[fieldName]?.message} />;

    if (type === 'file') {
        return (
            <>
                <Form.Label className="d-flex align-items-start" htmlFor="anexo">{buildLabel(label, hint)}</Form.Label>
                {control}
                {invalidFeedback}
            </>
        );
    }

    return (
        <FloatingLabel
            label={buildLabel(label, hint)}
            controlId={id}
        >
            {control}
            {invalidFeedback}
        </FloatingLabel>
    );
}

function buildControl({ form, type, label, id, options, errors, required, disabled }) {
    return (
        <Form.Control
            type={type}
            placeholder={label}
            {...form.register(id, options)}
            isInvalid={!!errors?.[fieldName]}
            required={required}
            disabled={disabled}
        />
    );
}

function buildInvalidFeedback({ id, errors }) {
    return (
        <InvalidFeedback message={errors?.[id]?.message} />
    );
}