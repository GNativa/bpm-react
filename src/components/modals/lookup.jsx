import { useDebounce } from "../../hooks/useDebounce";
import { Form, FloatingLabel, Modal, Table, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getStyleFromLoadingStatus } from "../../styles/loading";
import { loadingStatus } from "../../hooks/useDataSource";

/**
 * @param {{
 *  show: boolean;
 *  onHide: function(): void;
 *  dataSourceHook: {
 *      data: Object[];
 *      search: function;
 *      status: number;
 *  };
 *  config: import("../../logic/types").DataSourceConfig;
 *  onSelect: function(Object): void;
 * }} 
 * @returns 
 */
export default function LookupModal({
    show,
    onHide,
    dataSourceHook,
    config,
    onSelect,
}) {
    const [searchText, setSearchText] = useState('');
    const debounced = useDebounce(searchText);

    useEffect(() => {
        if (debounced) {
            dataSourceHook.search(debounced);
        }
    }, [debounced]);

    let visibleFields;

    if (config.visibleFields && config.visibleFields.length > 0) {
        visibleFields = config.visibleFields;
    }
    else {
        visibleFields = Object.keys(config.columnMap);
    }

    return (
        <Modal show={show} onHide={onHide} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{config.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <FloatingLabel label="Pesquisar" className="mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Pesquisar"
                        value={searchText}
                        className={getStyleFromLoadingStatus(dataSourceHook.status)}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </FloatingLabel>

                <Table striped hover responsive>
                    <thead>
                        <tr>
                            {visibleFields.map((field) => (
                                <th key={field}>
                                    {config.columnMap[field]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataSourceHook.data.length === 0 &&
                            dataSourceHook.status === loadingStatus.loaded && (
                                <Alert variant="warning">
                                    Nenhum registro encontrado.
                                </Alert>
                            )}
                        {dataSourceHook.data.map((row, i) => (
                            <tr key={i} onClick={() => {
                                onSelect(row);
                                onHide();
                            }}>
                                {visibleFields.map((field) => (
                                    <td key={field}>{row[field]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </Modal.Body>
        </Modal>
    );
}