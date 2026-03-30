import { Col } from 'react-bootstrap';

export default function Column({ children = [], width = null }) {
    return (
        <Col lg={width ?? ''}>
            {children}
        </Col>
    );
}