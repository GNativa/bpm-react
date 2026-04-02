import { FloatingLabel, Form } from "react-bootstrap";
import { InvalidFeedback, LabelContent } from "../Display";
import { buildLabel, defaultParams } from "../layout/helpers";

// TODO: passar etapa atual para sobrescrever o bloqueio do campo se necessário
/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  errors: import("react-hook-form").FieldErrors,
 *  id: string,
 *  fieldName: string,
 *  label: string,
 *  hint: ?string,
 *  required: boolean,
 *  disabled: boolean,
 *  options: {label: string, value: string}[],
 *  showEmptyOption: boolean,
 *  onBlur: React.FocusEventHandler,
 *  onChange: React.ChangeEventHandler,
 * }} props
 * @returns {import("react").JSX.Element}
 */
export default function SelectField({
    form,
    errors,
    id,
    fieldName = id,
    label,
    hint = defaultParams.hint,
    required = defaultParams.required,
    disabled = defaultParams.disabled,
    options,
    showEmptyOption = true,
    onBlur,
    onChange,
}) {
    return (
        <FloatingLabel
            label={buildLabel(label, hint)}
            controlId={id}
        >
            <Form.Select
                {...form.register(id, { onBlur, onChange })}
                isInvalid={!!errors?.[fieldName]}
                required={required}
                disabled={disabled}
            >
                {showEmptyOption && <option value="">Selecione...</option>}
                {options.map(option => {
                    const value = option.value;
                    const label = option.label;
                    return (
                        <option
                            key={`${id}-option-${value}`}
                            value={value}>
                            {`${value} - ${label}`}
                        </option>
                    );
                })}
            </Form.Select>
            <InvalidFeedback message={errors?.[fieldName]?.message} />
        </FloatingLabel>
    );
}