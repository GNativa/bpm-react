import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function LabelContent({ label, tooltip = null }) {
    return (
        <div className="d-flex align-items-center">
            {
                tooltip &&
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip id="button-tooltip">{tooltip}</Tooltip>}
                >
                    <i className="bi bi-info-circle-fill me-2 pe-auto" style={{cursor: 'help'}}></i>
                </OverlayTrigger>
            }
            {label}
        </div>
    );
}