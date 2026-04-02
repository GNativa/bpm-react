import { hideIf } from "./layout/helpers";
import { Row, Col } from "react-bootstrap";
import SectionRow from "./layout/SectionRow";
import Column from "./layout/Column";
import buildFieldArrayRow from "./buildFieldArrayRow";

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
    rowBuilder,
}) {
    return (
        <div className={
            `${hideIf(!visible)} ${first ? '' : 'mt-4'}`
        }>
            <Row className="mt-2 mb-4">
                <Col className="d-flex align-items-start">
                    <div className="title-sm">
                        {title}
                    </div>
                </Col>
            </Row>
            <div className="g-3">
                {arrayFields.map((field, rowIndex) => {
                    const columns = buildFieldArrayRow({
                        form, field, arrayName,
                        index: rowIndex,
                        fieldNames,
                        validationDependencies,
                        builder: rowBuilder,
                    });

                    return (
                        <SectionRow key={field.id}>
                            {columns.map((column, columnIndex) => (
                                <Column
                                    key={columnIndex}
                                    visible={column.visible ?? undefined}
                                    width={column.width ?? undefined}
                                    breakAfter={column.breakAfter ?? undefined}
                                >
                                    {Array.isArray(column.children)
                                        ? column.children.map((child, i) => <span key={i}>{child}</span>)
                                        : column.children}
                                </Column>
                            ))}
                        </SectionRow>
                    );
                })}
            </div>
        </div>
    );
}