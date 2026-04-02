import { Row, Col } from "react-bootstrap";
import Column from "./Column";
import { hideIf } from "./helpers";
import SectionRow from "./SectionRow";

/**
 * @param {{title: string, columns: ColumnProps[], first: boolean}} 
 * @returns 
 */
export default function Section({
    title,
    columns = [],
    first = false,
}) {
    return (
        <div className={
            `${hideIf(columns.every(v => v.visible === false))} ${first ? '' : 'mt-2'}`
        }>
            <Row className="mt-2 mb-4">
                <Col className="d-flex align-items-start">
                    <div className="title-l">
                        {title}
                    </div>
                </Col>
            </Row>
            <SectionRow>
                {columns.map((column, index) => (
                    <Column
                        key={index}
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
        </div>
    );
}