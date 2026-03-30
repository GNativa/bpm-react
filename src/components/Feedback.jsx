import { Form } from "react-bootstrap";

export default function Feedback({ type, message }) {
    return (
        <Form.Control.Feedback type={type}>
            <div className="d-flex align-items-start">
                {message}
            </div>
        </Form.Control.Feedback>
    );
}