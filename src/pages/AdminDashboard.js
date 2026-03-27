import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { requestsAPI, carsAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    testDriveRequests: 0,
    bookingRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch stats and recent requests in parallel
      const [requestStatsResponse, carsResponse, recentRequestsResponse] = await Promise.all([
        requestsAPI.getRequestStats(),
        carsAPI.getAdminCars({ limit: 1000 }), // Get all cars for counting
        requestsAPI.getAllRequests({ limit: 5 }) // Get 5 most recent requests
      ]);

      const requestStats = requestStatsResponse.data;
      const cars = carsResponse.data.cars;
      const availableCars = cars.filter(car => car.status === 'available').length;

      setStats({
        totalCars: cars.length,
        availableCars,
        totalRequests: requestStats.totalRequests,
        pendingRequests: requestStats.pendingRequests,
        approvedRequests: requestStats.approvedRequests,
        testDriveRequests: requestStats.testDriveRequests,
        bookingRequests: requestStats.bookingRequests
      });

      setRecentRequests(recentRequestsResponse.data.requests);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error fetching admin dashboard data:', err);
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
            <p className="mt-2">Loading admin dashboard...</p>
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
                  <i className="bi bi-speedometer2 me-3"></i>
                  Admin Dashboard
                </h1>
                <p className="lead mb-0">
                  Welcome back, {user?.name}! Manage your dealership operations, 
                  track requests, and oversee your car inventory from here.
                </p>
              </Col>
              <Col md={4} className="text-center">
                <i className="bi bi-gear-fill" style={{ fontSize: '6rem', opacity: 0.3 }}></i>
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

      {/* Stats Cards */}
      <Row className="mb-5">
        <Col lg={3} md={6} className="mb-4">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-car-front text-red" style={{ fontSize: '3rem' }}></i>
              </div>
              <h2 className="fw-bold text-red">{stats.totalCars}</h2>
              <p className="text-muted mb-0">Total Cars</p>
              <small className="text-success">
                {stats.availableCars} available
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-calendar-check text-red" style={{ fontSize: '3rem' }}></i>
              </div>
              <h2 className="fw-bold text-red">{stats.totalRequests}</h2>
              <p className="text-muted mb-0">Total Requests</p>
              <small className="text-warning">
                {stats.pendingRequests} pending
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-car-front-fill text-red" style={{ fontSize: '3rem' }}></i>
              </div>
              <h2 className="fw-bold text-red">{stats.testDriveRequests}</h2>
              <p className="text-muted mb-0">Test Drives</p>
              <small className="text-info">
                Requested
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-bookmark-fill text-red" style={{ fontSize: '3rem' }}></i>
              </div>
              <h2 className="fw-bold text-red">{stats.bookingRequests}</h2>
              <p className="text-muted mb-0">Bookings</p>
              <small className="text-info">
                Requested
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-5">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={3} md={6} className="mb-3">
                  <Button as={Link} to="/admin/cars" className="btn-primary w-100 py-3">
                    <i className="bi bi-car-front me-2"></i>
                    <div>Manage Cars</div>
                    <small>Add, edit, delete cars</small>
                  </Button>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                  <Button as={Link} to="/admin/requests" variant="outline-primary" className="w-100 py-3">
                    <i className="bi bi-list-check me-2"></i>
                    <div>Manage Requests</div>
                    <small>Review customer requests</small>
                  </Button>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                  <Button as={Link} to="/cars" variant="outline-primary" className="w-100 py-3">
                    <i className="bi bi-eye me-2"></i>
                    <div>View Public Site</div>
                    <small>See customer view</small>
                  </Button>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline-secondary" 
                    className="w-100 py-3"
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    <div>Refresh Data</div>
                    <small>Update dashboard</small>
                  </Button>
                </Col>
              </Row>
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
            <Button as={Link} to="/admin/requests" variant="outline-primary">
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
                      <Col md={2}>
                        <div className="text-center">
                          <i className={`bi ${request.type === 'test_drive' ? 'bi-car-front' : 'bi-bookmark'} text-red`} style={{ fontSize: '1.5rem' }}></i>
                          <div className="small text-muted mt-1">
                            {request.type === 'test_drive' ? 'Test Drive' : 'Booking'}
                          </div>
                        </div>
                      </Col>
                      <Col md={3}>
                        <h6 className="mb-1">
                          {request.car?.make} {request.car?.model}
                        </h6>
                        <small className="text-muted">
                          {request.car?.year}
                        </small>
                      </Col>
                      <Col md={3}>
                        <h6 className="mb-1">{request.customer?.name}</h6>
                        <small className="text-muted">
                          {request.customer?.email}
                        </small>
                      </Col>
                      <Col md={2}>
                        <div className="text-center">
                          {getRequestStatusBadge(request.status)}
                          <div className="small text-muted mt-1">
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          as={Link}
                          to="/admin/requests"
                          variant="outline-primary"
                          size="sm"
                        >
                          Manage
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
                <h5 className="mt-3 mb-2">No Recent Requests</h5>
                <p className="text-muted">
                  No customer requests have been made recently.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* System Status */}
      <Row>
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h5 className="mb-4">
                <i className="bi bi-info-circle me-2"></i>
                System Status
              </h5>
              <Row>
                <Col md={3} className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <div className="fw-bold">API Status</div>
                      <small className="text-muted">Online</small>
                    </div>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <div className="fw-bold">Database</div>
                      <small className="text-muted">Connected</small>
                    </div>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <div className="fw-bold">File Uploads</div>
                      <small className="text-muted">Working</small>
                    </div>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <div className="fw-bold">Email Service</div>
                      <small className="text-muted">Active</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;