import { Row } from "react-bootstrap";

export default function Row({ columns = [] }) {
    return (
        <Row className="g-3">
            {columns}
        </Row>
    );
}