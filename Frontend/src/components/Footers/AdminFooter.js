
// reactstrap components
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="12">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
            Charmbook
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
