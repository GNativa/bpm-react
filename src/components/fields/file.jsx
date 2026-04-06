import { Button, Form, ListGroup, ListGroupItem, Collapse } from "react-bootstrap";
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
    /** @type {import("react").RefObject<HTMLInputElement>} */
    const inputRef = useRef(null);

    /** @type {File[]} */
    const initialList = [];
    const [files, setFiles] = useState(initialList);
    const [showMore, setShowMore] = useState(false);

    const options = {
        onBlur,
        onChange: (e) => {
            onChange?.call(e);
            setFiles(Array.from(e.target.files));
        },
    };

    useEffect(() => {
        const input = inputRef.current;

        if (input && !multiple && files.length > 1) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            input.files = dataTransfer.files;
            setFiles(Array.from(dataTransfer.files));
        }

    }, [multiple]);

    const removeFile = (index) => {
        const input = inputRef.current;

        if (!input) {
            return;
        }

        const dataTransfer = new DataTransfer();

        files.forEach((file, i) => {
            if (i !== index) {
                dataTransfer.items.add(file);
            }
        });

        input.files = dataTransfer.files;

        if (dataTransfer.files.length === 0) {
            input.value = "";
        }

        setFiles(Array.from(dataTransfer.files));
    };

    const removeAll = () => {
        const input = inputRef.current;

        if (!input) {
            return;
        }

        const emptyFiles = new DataTransfer().files

        input.value = "";
        input.files = emptyFiles;
        setFiles(Array.from(emptyFiles));
    }

    const { ref: registerRef, ...rest } = form.register(id, options);

    const moreThanOneFile = files.length > 1;
    const filesToShow = files.length - 1;

    const denyRemoval = disabled || !allowRemoval;

    // TODO: verificar se há uma forma simples de manter as bordas inferiores arredondadas nos itens do Collapse
    // TODO: implementar adição de arquivos pelo botão +
    return (
        <>
            <Form.Label className="d-flex align-items-start" htmlFor={id}>
                {buildLabel(label, hint)}
            </Form.Label>
            <Form.Control
                id={id}
                name={id}
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
            <InvalidFeedback message={errors?.[fieldName]?.message} />
            {files.length > 0 && (
                <ListGroup className="mt-1" as="ul">
                    <ListGroupItem className="d-flex justify-content-between" as="li">
                        {moreThanOneFile ? (
                            <Button onClick={() => setShowMore(!showMore)}>
                                {`Mostrar ${showMore ? 'menos arquivos' : `mais ${filesToShow} arquivo${filesToShow > 1 ? 's' : ''}`}`}
                            </Button>
                        ) : (
                            <div></div>
                        )}
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="primary"
                                size="md"
                                title="Adicionar"
                            >
                                <i className="bi bi-file-earmark-plus-fill"></i>
                            </Button>
                            <Button
                                variant="danger"
                                size="md"
                                title="Limpar"
                                onClick={denyRemoval ? null : () => removeAll()}
                            >
                                <i className="bi bi-x-square-fill"></i>
                            </Button>
                        </div>
                    </ListGroupItem>
                    <FileLink
                        key={files[0].name}
                        file={files[0]}
                        index={0}
                        onRemove={denyRemoval ? null : removeFile}
                    />
                    {moreThanOneFile && (
                        <Collapse in={showMore}>
                            <div>
                                {files.slice(1).map((file, index) => (
                                    <FileLink
                                        key={file.name}
                                        file={file}
                                        index={index + 1}
                                        onRemove={denyRemoval ? null : removeFile}
                                    />
                                ))}
                            </div>
                        </Collapse>
                    )}
                </ListGroup>
            )}
        </>
    );
}

/**
 * @param {{
 *  file: File,
 *  index: number,
 *  onRemove: ?function(number): void,
 * }} 
 * @returns {import("react").JSX.Element}
 */
function FileLink({ file, index, onRemove = null }) {
    return (
        <ListGroupItem className="d-flex justify-content-between" as="li">
            <div className="justify-content-start">
                <a href={URL.createObjectURL(file)} target="_blank">
                    {file.name}
                </a>
            </div>
            {onRemove && (
                <div>
                    <Button
                        variant="warning"
                        size="sm"
                        title="Remover"
                        onClick={() => onRemove(index)}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </Button>
                </div>
            )}
        </ListGroupItem>
    );
}