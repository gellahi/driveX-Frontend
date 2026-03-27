import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { requestsAPI, carsAPI } from '../services/api';
import CarCard from '../components/CarCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch recent requests and featured cars in parallel
      const [requestsResponse, carsResponse] = await Promise.all([
        requestsAPI.getMyRequests(),
        carsAPI.getAllCars({ limit: 6 })
      ]);

      setRecentRequests(requestsResponse.data.slice(0, 3)); // Show only 3 recent requests
      setFeaturedCars(carsResponse.data.cars.slice(0, 3)); // Show only 3 featured cars
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRequestStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pending' },
      approved: { variant: 'success', text: 'Approved' },
      rejected: { variant: 'danger', text: 'Rejected' },
      completed: { variant: 'info', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge bg-${config.variant}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading dashboard...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Welcome Section */}
      <Row className="mb-5">
        <Col>
          <div className="bg-gradient-dark text-white p-5 rounded">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="display-5 fw-bold mb-3">
                  Welcome back, {user?.name}!
                </h1>
                <p className="lead mb-0">
                  Ready to find your next dream car? Explore our latest collection 
                  and manage your requests from your personal dashboard.
                </p>
              </Col>
              <Col md={4} className="text-center">
                <i className="bi bi-person-circle" style={{ fontSize: '6rem', opacity: 0.3 }}></i>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Quick Stats */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-calendar-check text-red" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3 mb-2">{recentRequests.length}</h3>
              <p className="text-muted mb-0">Active Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-car-front text-red" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3 mb-2">{featuredCars.length}</h3>
              <p className="text-muted mb-0">Featured Cars</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-heart text-red" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3 mb-2">Premium</h3>
              <p className="text-muted mb-0">Member Status</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Requests */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>
              <i className="bi bi-clock-history me-2"></i>
              Recent Requests
            </h3>
            <Button as={Link} to="/my-requests" variant="outline-primary">
              View All Requests
              <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </div>

          {recentRequests.length > 0 ? (
            <Card>
              <Card.Body className="p-0">
                {recentRequests.map((request, index) => (
                  <div key={request._id} className={`p-4 ${index < recentRequests.length - 1 ? 'border-bottom' : ''}`}>
                    <Row className="align-items-center">
                      <Col md={3}>
                        <div className="d-flex align-items-center">
                          <i className={`bi ${request.type === 'test_drive' ? 'bi-car-front' : 'bi-bookmark'} text-red me-3`} style={{ fontSize: '1.5rem' }}></i>
                          <div>
                            <h6 className="mb-1">
                              {request.type === 'test_drive' ? 'Test Drive' : 'Booking'}
                            </h6>
                            <small className="text-muted">
                              {formatDate(request.createdAt)}
                            </small>
                          </div>
                        </div>
                      </Col>
                      <Col md={4}>
                        <h6 className="mb-1">
                          {request.car?.make} {request.car?.model}
                        </h6>
                        <small className="text-muted">
                          Preferred: {formatDate(request.preferredDate)} at {request.preferredTime}
                        </small>
                      </Col>
                      <Col md={3}>
                        {getRequestStatusBadge(request.status)}
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          as={Link}
                          to={`/cars/${request.car?._id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Car
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="bi bi-calendar-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                <h5 className="mt-3 mb-2">No Requests Yet</h5>
                <p className="text-muted mb-4">
                  You haven't made any car requests yet. Browse our collection to get started!
                </p>
                <Button as={Link} to="/cars" className="btn-primary">
                  <i className="bi bi-car-front me-2"></i>
                  Browse Cars
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Featured Cars */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>
              <i className="bi bi-star me-2"></i>
              Featured Cars
            </h3>
            <Button as={Link} to="/cars" variant="outline-primary">
              View All Cars
              <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </div>

          {featuredCars.length > 0 ? (
            <Row>
              {featuredCars.map(car => (
                <Col key={car._id} lg={4} md={6} className="mb-4">
                  <CarCard car={car} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="bi bi-car-front" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                <h5 className="mt-3 mb-2">No Cars Available</h5>
                <p className="text-muted">
                  Check back later for new arrivals!
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h5 className="mb-4">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
              <Row>
                <Col md={3} className="mb-3">
                  <Button as={Link} to="/cars" variant="outline-primary" className="w-100">
                    <i className="bi bi-search me-2"></i>
                    Browse Cars
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button as={Link} to="/my-requests" variant="outline-primary" className="w-100">
                    <i className="bi bi-list-check me-2"></i>
                    My Requests
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    href="tel:+1-555-123-CARS" 
                    variant="outline-primary" 
                    className="w-100"
                  >
                    <i className="bi bi-telephone me-2"></i>
                    Call Us
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    href="mailto:info@drivex.com" 
                    variant="outline-primary" 
                    className="w-100"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Email Us
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;