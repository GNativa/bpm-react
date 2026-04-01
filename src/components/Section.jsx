import { Row, Col } from "react-bootstrap";
import Column from "./Column";

export default function Section({
    title,
    columns = [{
        children: [],
        visible: false,
        width: 12,
        breakAfter: false,
    }],
    first = false,
}) {
    const columnMapper = column => (
        <Column
            visible={column.visible ?? undefined}
            width={column.width ?? undefined}
            breakAfter={column.breakAfter ?? undefined}
        >
            {column.children}
        </Column>
    );

    return (
        <div className={
            `${hideIf(columns.every(v => !v.visible))} ${first ? '' : 'mt-2'}`
        }>
            <Row className="mt-2 mb-4">
                <Col className="d-flex align-items-start">
                    <h5 className="section-title">
                        <strong><em>{title}</em></strong>
                    </h5>
                </Col>
            </Row>
            <Row className="section-row g-3 pb-3`">
                {columns.map(columnMapper)}
            </Row>
        </div>
    );
}