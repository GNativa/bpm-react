import { Col } from 'react-bootstrap';

/**
 * @param {ColumnProps} 
 */
export default function Column({
    children = [],
    visible = true,
    width = 12,
    breakAfter = false
}) {
    return (
        <>
            <Col xs={width} className={visible ? '' : 'd-none'}>
                {children}
            </Col>
            {breakAfter && <Col className="w-100" />}
        </>
    );
}