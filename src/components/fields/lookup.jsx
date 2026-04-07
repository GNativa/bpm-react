import { useState, useEffect } from "react";
import { useDataSource } from "../../hooks/useDataSource";
import { useDebounce } from "../../hooks/useDebounce";
import { Form, FloatingLabel, InputGroup, Button, Dropdown } from "react-bootstrap";
import LookupModal from "../modals/lookup";
import { defaultParams } from "../layout/helpers";
import { InvalidFeedback } from "../Display";
import { buildLabel } from "../layout/helpers";
import { getStyleFromLoadingStatus } from "../../styles/loading";

// TODO: permitir obrigar que o valor exista na fonte de dados

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn;
 *  errors: import("react-hook-form").FieldErrors;
 *  id: string;
 *  fieldName: string;
 *  label: string;
 *  hint: ?string;
 *  value: string | number | string[];
 *  required: boolean;
 *  disabled: boolean;
 *  onBlur: React.FocusEventHandler;
 *  onChange: React.ChangeEventHandler;
 *  config: import('../../logic/typedefs').DataSourceConfig;
 *  formMap: Record<string, [
 *      name: string,
 *      parse: (function(any): any)|undefined;
 *  ]>;
 *  dependentFields: string[];
 * }} props 
 */
export default function LookupField({
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
    config,
    formMap,
}) {
    const { error, status, data, search } = useDataSource(config);
    const [showDropDown, setShowDropdown] = useState(true);
    const [input, setInput] = useState('');
    const [showModal, setShowModal] = useState(false);
    const debounced = useDebounce(input);

    useEffect(() => {
        if (!debounced) {
            clearDependencies();
            return;
        }

        handleSearch(debounced);
    }, [debounced]);

    /**
     * @param {string} value 
     */
    async function handleSearch(value) {
        const results = await search(value);

        if (results.length === 1) {
            selectRecord(results[0]);
        }

        setShowDropdown(true);
    }

    function clearDependencies() {
        Object.keys(formMap).forEach((field) => {
            form.setValue(field);
        });
    }

    /**
     * @param {Object} record 
     */
    function selectRecord(record) {
        [...Object.keys(formMap), id].forEach((field) => {
            const options = formMap[field];

            let value;

            const name = options[0];
            const parse = options[1];

            if (parse) {
                value = parse(record[name]);
            }
            else {
                value = record[name];
            }

            form.setValue(field, value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        });

        setShowDropdown(false);
    }

    const options = {
        onChange: (e) => {
            onChange?.(e);
            setInput(e.target.value);
        },
        onBlur,
    };

    let inputType;

    if (type === 'number') {
        inputType = type;

        options.setValueAs = (value) => {
            if (value === '') return undefined;
            const parsed = Number(value);
            return isNaN(parsed) ? undefined : parsed;
        };
    }
    else {
        inputType = 'text';
    }

    return (
        <>
            <InputGroup className={!!errors?.[fieldName] ? 'is-invalid' : ''}>
                <FloatingLabel
                    label={buildLabel(label, hint)}
                    controlId={id}
                >
                    <Form.Control
                        type={inputType}
                        placeholder={label}
                        {...form.register(id, options)}
                        isInvalid={!!errors?.[fieldName]}
                        required={required}
                        disabled={disabled}
                        className={getStyleFromLoadingStatus(status)}
                    />
                </FloatingLabel>
                <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
                    <i className="bi bi-search"></i>
                </Button>
            </InputGroup>
            <InvalidFeedback message={errors?.[fieldName]?.message} />

            {showDropDown && data.length > 1 && (
                <Dropdown.Menu show>
                    {data.map((item, i) => (
                        <Dropdown.Item key={i} onClick={() => selectRecord(item)}>
                            {item[config.keyField]}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            )}

            {error && (
                <div className="d-flex justify-content-start text-danger">
                    {error}
                </div>
            )}

            <LookupModal
                show={showModal}
                onHide={() => setShowModal(false)}
                dataSourceHook={{ data, search, status }}
                config={config}
                onSelect={selectRecord}
            />
        </>
    );
}