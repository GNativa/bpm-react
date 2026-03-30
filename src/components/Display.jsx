import { Form, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';

export function InvalidFeedback({ message }) {
    return Feedback({
        type: "invalid", message
    });
}

export function ValidFeedback({ message }) {
    return Feedback({
        type: "valid", message
    });
}

export function Feedback({ type, message }) {
    return (
        <Form.Control.Feedback type={type}>
            <div className="d-flex align-items-start">
                {message}
            </div>
        </Form.Control.Feedback>
    );
}

export function LabelContent({ label, tooltip = null }) {
    return (
        <div className="d-flex align-items-center">
            {
                tooltip &&
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip id="button-tooltip">{tooltip}</Tooltip>}
                >
                    <i className="bi bi-info-circle-fill me-2 pe-auto" style={{ cursor: 'help' }}></i>
                </OverlayTrigger>
            }
            {label}
        </div>
    );
}