import { Row, Col } from "react-bootstrap";

export default function Section({ title, columns = [] }) {
    return (
        <Row className={columns.some(c => c.visible) ? '' : 'd-none'}>
            <Col>
                <Row className="mt-2 mb-2">
                    <Col className="d-flex align-items-start">
                        <h5>
                            <strong><em>{title}</em></strong>
                        </h5>
                    </Col>
                </Row>
                <Row className="section-row g-3 pb-3`">
                    {columns}
                </Row>
            </Col>
        </Row>
    );
}