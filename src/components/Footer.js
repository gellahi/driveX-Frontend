import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>
              <i className="bi bi-car-front-fill me-2"></i>
              DriveX
            </h5>
            <p className="mb-3">
              Where Passion Meets Performance. Drive Your Dream. Own the Road.
            </p>
            <p>
              Premium car dealership management system designed for the modern automotive industry.
            </p>
          </Col>
          
          <Col md={2} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/cars">Cars</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-4">
            <h5>Services</h5>
            <ul className="list-unstyled">
              <li><a href="/cars">Browse Cars</a></li>
              <li><a href="#test-drive">Test Drives</a></li>
              <li><a href="#financing">Car Financing</a></li>
              <li><a href="#support">Customer Support</a></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-4">
            <h5>Contact Info</h5>
            <p>
              <i className="bi bi-geo-alt-fill me-2"></i>
              123 Auto Street, Car City, CC 12345
            </p>
            <p>
              <i className="bi bi-telephone-fill me-2"></i>
              +1 (555) 123-CARS
            </p>
            <p>
              <i className="bi bi-envelope-fill me-2"></i>
              info@drivex.com
            </p>
            <div className="mt-3">
              <a href="#facebook" className="me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#twitter" className="me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#instagram" className="me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#linkedin">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Row>
          <Col md={6}>
            <p className="mb-0">
              &copy; {new Date().getFullYear()} DriveX. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">
              Built with passion for automotive excellence.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;