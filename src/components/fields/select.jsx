import { FloatingLabel, Form } from "react-bootstrap";
import { InvalidFeedback, LabelContent } from "../Display";
import { buildLabel, defaultParams } from "../helpers";

// TODO: passar etapa atual para sobrescrever o bloqueio do campo se necessário
/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  errors: import("react-hook-form").FieldErrors,
 *  id: string,
 *  label: string,
 *  hint: ?string,
 *  required: boolean,
 *  disabled: boolean,
 *  options: {label: string, value: string}[],
 *  showEmptyOption: boolean,
 *  onBlur: function(React.FocusEventHandler): void
 * }} props
 * @returns {import("react").JSX.Element}
 */
export default function SelectField({
    form,
    errors,
    id,
    label,
    hint = defaultParams.hint,
    required = defaultParams.required,
    disabled = defaultParams.disabled,
    options,
    showEmptyOption = true,
}) {
    return (
        <FloatingLabel
            label={buildLabel(label, hint)}
            controlId={id}
        >
            <Form.Select
                {...form.register(id)}
                isInvalid={errors?.[id]}
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
            <InvalidFeedback message={errors?.[id]?.message} />
        </FloatingLabel>
    );
}