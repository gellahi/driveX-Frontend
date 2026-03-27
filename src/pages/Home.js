import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, isAdmin } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title fade-in text-white">
                Drive Your Dream.
                <br />
                <span className="text-gradient">Own the Road.</span>
              </h1>
              <p className="hero-subtitle slide-up">
                Where Passion Meets Performance. Experience the ultimate car dealership 
                management system designed for the modern automotive industry.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/cars" size="lg" className="btn-primary">
                  <i className="bi bi-car-front me-2"></i>
                  Browse Cars
                </Button>
                {!user && (
                  <Button as={Link} to="/signup" size="lg" variant="outline-primary">
                    <i className="bi bi-person-plus me-2"></i>
                    Get Started
                  </Button>
                )}
                {user && isAdmin() && (
                  <Button as={Link} to="/admin" size="lg" variant="outline-primary">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-car-showcase">
                {/* Dynamic Car Carousel */}
                <div className="car-carousel">
                  <div className="carousel-container">
                    <div className={`carousel-slide ${currentSlide === 0 ? 'active' : ''}`}>
                      <img
                        src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop"
                        alt="BMW M5 Competition"
                        className="carousel-image"
                        onError={(e) => {
                          e.target.src = '/images/default-car.jpg';
                        }}
                      />
                      <div className="carousel-overlay">
                        <h3 className="car-name-hero">BMW M5 Competition</h3>
                        <div className="price-hero">$120,000</div>
                      </div>
                    </div>

                    <div className={`carousel-slide ${currentSlide === 1 ? 'active' : ''}`}>
                      <img
                        src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop"
                        alt="Mercedes AMG GT"
                        className="carousel-image"
                        onError={(e) => {
                          e.target.src = '/images/default-car.jpg';
                        }}
                      />
                      <div className="carousel-overlay">
                        <h3 className="car-name-hero">Mercedes AMG GT 63 S</h3>
                        <div className="price-hero">$180,000</div>
                      </div>
                    </div>

                    <div className={`carousel-slide ${currentSlide === 2 ? 'active' : ''}`}>
                      <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop"
                        alt="Porsche 911 Turbo S"
                        className="carousel-image"
                        onError={(e) => {
                          e.target.src = '/images/default-car.jpg';
                        }}
                      />
                      <div className="carousel-overlay">
                        <h3 className="car-name-hero">Porsche 911 Turbo S</h3>
                        <div className="price-hero">$230,000</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dynamic Stats */}
                <div className="hero-stats">
                  <div className="stat-item-hero">
                    <div className="stat-number-hero">500+</div>
                    <div className="stat-label-hero">Luxury Cars</div>
                  </div>
                  <div className="stat-item-hero">
                    <div className="stat-number-hero">50+</div>
                    <div className="stat-label-hero">Brands</div>
                  </div>
                  <div className="stat-item-hero">
                    <div className="stat-number-hero">24/7</div>
                    <div className="stat-label-hero">Support</div>
                  </div>
                </div>

                {/* Animated Elements */}
                <div className="hero-particles">
                  <div className="particle particle-1"></div>
                  <div className="particle particle-2"></div>
                  <div className="particle particle-3"></div>
                  <div className="particle particle-4"></div>
                  <div className="particle particle-5"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row className="text-center">
            <Col md={3} className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Premium Cars</span>
            </Col>
            <Col md={3} className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Happy Customers</span>
            </Col>
            <Col md={3} className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Car Brands</span>
            </Col>
            <Col md={3} className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Customer Support</span>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-4 fw-bold">Why Choose DriveX?</h2>
              <p className="lead text-muted">
                Experience the future of car dealership management
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="bi bi-search text-red" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title>Smart Search</Card.Title>
                  <Card.Text>
                    Find your perfect car with our advanced search and filtering system. 
                    Search by make, model, year, price range, and more.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="bi bi-calendar-check text-red" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title>Easy Booking</Card.Title>
                  <Card.Text>
                    Schedule test drives and book your favorite cars with just a few clicks. 
                    Our streamlined process makes it simple and fast.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="bi bi-shield-check text-red" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title>Trusted Platform</Card.Title>
                  <Card.Text>
                    Secure transactions, verified dealers, and comprehensive car history. 
                    Your peace of mind is our priority.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-dark text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Ready to Find Your Dream Car?</h2>
              <p className="lead mb-4">
                Join thousands of satisfied customers who found their perfect vehicle with DriveX.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button as={Link} to="/cars" size="lg" variant="light">
                  <i className="bi bi-car-front me-2"></i>
                  View All Cars
                </Button>
                {!user && (
                  <Button as={Link} to="/signup" size="lg" className="btn-primary">
                    <i className="bi bi-person-plus me-2"></i>
                    Sign Up Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;