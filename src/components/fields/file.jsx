import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { InvalidFeedback } from "../Display";
import { buildLabel, defaultParams } from "../layout/helpers";
import { useEffect, useRef, useState } from "react";

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
 *  multiple: boolean,
 *  allowRemoval: boolean,
 *  onBlur: React.FocusEventHandler,
 *  onChange: React.ChangeEventHandler,
 * }} props 
 * @returns {import("react").JSX.Element}
 */
export default function FileField({
    form,
    errors,
    id,
    fieldName = id,
    label,
    hint = defaultParams.hint,
    required = defaultParams.required,
    disabled = defaultParams.disabled,
    multiple = false,
    allowRemoval = true,
    onBlur,
    onChange,
}) {
    const inputRef = useRef(null);

    /** @type {File[]} */
    const initialList = [];
    const [files, setFiles] = useState(initialList);
    // TODO: usar para exibir um botão com Collapse e mostrar os itens além do primeiro quando tiver mais de um anexo
    const [showMore, setShowMore] = useState(false);

    const options = {
        onBlur,
        onChange: (e) => {
            onChange?.call(e);
            setFiles(Array.from(e.target.files));
        },
    };

    const removeFile = (index) => {
        const input = inputRef.current;

        if (!input) {
            return;
        }

        input.value = "";

        const dataTransfer = new DataTransfer();

        files.forEach((file, i) => {
            if (i !== index) {
                dataTransfer.items.add(file);
            }
        });

        input.files = dataTransfer.files;
        setFiles(Array.from(dataTransfer.files));
    };

    const { ref: registerRef, ...rest } = form.register(id, options);

    // TODO: usar Collapse para esconder lista de arquivos se tiver mais que um
    return (
        <>
            <Form.Label className="d-flex align-items-start" htmlFor={id}>
                {buildLabel(label, hint)}
            </Form.Label>
            <Form.Control
                type="file"
                placeholder={label}
                ref={(r) => {
                    registerRef(r);
                    inputRef.current = r;
                }}
                {...rest}
                isInvalid={!!errors?.[fieldName]}
                required={required}
                disabled={disabled}
                multiple={multiple}
            />
            {files.length > 0 && (
                <div className="mt-1 card">
                    <ListGroup>
                        {files.map((file, index) => (
                            <>
                                <ListGroupItem key={file.name} className="d-flex justify-content-between">
                                    <div className="justify-content-start">
                                        <a href={URL.createObjectURL(file)} target="_blank">
                                            {file.name}
                                        </a>
                                    </div>
                                    {allowRemoval && (
                                        <div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeFile(index)}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </Button>
                                        </div>
                                    )}
                                </ListGroupItem>

                            </>
                        ))}
                    </ListGroup>
                </div>
            )}
            <InvalidFeedback message={errors?.[fieldName]?.message} />
        </>
    );
}