import { Row } from "react-bootstrap";

export default function SectionRow({ children }) {
    return (
        <Row className="section-row g-3 pb-3">
            {children}
        </Row>  
    );
}