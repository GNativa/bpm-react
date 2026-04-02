import { Row, Col } from "react-bootstrap";
import Column from "./Column";
import { hideIf } from "./helpers";

export default function Section({
    title,
    columns = [{
        children: <></>,
        visible: false,
        width: 12,
        breakAfter: false,
    }],
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
            <Row className="section-row g-3 pb-3">
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
            </Row>
        </div>
    );
}