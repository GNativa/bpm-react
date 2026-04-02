import { hideIf } from "./layout/helpers";
import { Row, Col, Button } from "react-bootstrap";
import SectionRow from "./layout/SectionRow";
import Column from "./layout/Column";
import FieldArrayRow from "./FieldArrayRow";

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  arrayName: string,
 *  fieldNames: string[],
 *  title: string,
 *  first: boolean,
 *  visible: boolean,
 *  arrayFields: {id: string}[],
 *  validationDependencies: FieldArrayValidationDependency[],
 *  appendFunction: function,
 *  removeFunction: function,
 *  rowBuilder: FieldArrayRowBuilder,
 * }}
 * @returns 
 */
export default function FieldArraySection({
    form,
    arrayName,
    fieldNames = [],
    title,
    first = false,
    visible = true,
    arrayFields = [],
    validationDependencies = [],
    appendFunction,
    removeFunction,
    rowBuilder,
}) {
    return (
        <div className={
            `${hideIf(!visible)} ${first ? '' : 'mt-4'}`
        }>
            <Row className="mt-2 mb-4">
                <Col xs="6" className="d-flex justify-content-start title-sm">
                    {title}
                </Col>
                {appendFunction && (
                    <Col xs="6" className="d-flex justify-content-end">
                        <Button
                            onClick={(e) => {
                                appendFunction();
                            }}
                            size="sm"
                        >
                            <i className="bi bi-plus fs-5" />
                        </Button>
                    </Col>
                )}
            </Row>
            <div className="d-grid gap-4">
                {arrayFields.map((field, rowIndex) => (
                    <FieldArrayRow
                        key={field.id}
                        form={form}
                        field={field}
                        arrayName={arrayName}
                        index={rowIndex}
                        fieldNames={fieldNames}
                        validationDependencies={validationDependencies}
                        rowBuilder={rowBuilder}
                        removeFunction={removeFunction}
                    />
                ))}
            </div>
        </div>
    );
}