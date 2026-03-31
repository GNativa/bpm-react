import { Col } from 'react-bootstrap';

export default function Column({
    children = [],
    visible = true,
    width = null, // 1 a 12
    breakAfter = false
}) {
    return (
        <>
            <Col xs={width ?? ''} className={visible ? '' : 'd-none'}>
                {children}
            </Col>
            {breakAfter && <Col className="w-100" />}
        </>
    );
}