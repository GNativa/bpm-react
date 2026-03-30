import { Col } from 'react-bootstrap';

export default function Column({ children = [], visible = true, width = null }) {
    return (
        <Col lg={width ?? ''} className={visible ? '' : 'd-none'}>
            {children}
        </Col>
    );
}