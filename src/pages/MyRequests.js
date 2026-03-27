import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { requestsAPI, getImageUrl } from '../services/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await requestsAPI.getMyRequests();
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch your requests. Please try again.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pending', icon: 'clock' },
      approved: { variant: 'success', text: 'Approved', icon: 'check-circle' },
      rejected: { variant: 'danger', text: 'Rejected', icon: 'x-circle' },
      completed: { variant: 'info', text: 'Completed', icon: 'check-all' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <i className={`bi bi-${config.icon}`}></i>
        {config.text}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'test_drive' ? 'bi-car-front' : 'bi-bookmark';
  };

  const getTypeText = (type) => {
    return type === 'test_drive' ? 'Test Drive' : 'Booking Request';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    try {
      setDeleteLoading(true);
      await requestsAPI.deleteRequest(requestToDelete._id);
      setRequests(requests.filter(req => req._id !== requestToDelete._id));
      setShowDeleteModal(false);
      setRequestToDelete(null);
    } catch (err) {
      setError('Failed to delete request. Please try again.');
      console.error('Error deleting request:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading your requests...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-5 fw-bold mb-2">
                  <i className="bi bi-list-check me-3"></i>
                  My Requests
                </h1>
                <p className="lead text-muted">
                  Track and manage your car requests
                </p>
              </div>
              <Button as={Link} to="/cars" className="btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Make New Request
              </Button>
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

        {requests.length > 0 ? (
          <Row>
            {requests.map(request => (
              <Col key={request._id} lg={6} className="mb-4">
                <Card className="h-100">
                  <Row className="g-0 h-100">
                    <Col md={5}>
                      <div className="position-relative h-100">
                        <img
                          src={request.car?.image && (request.car.image.startsWith('http://') || request.car.image.startsWith('https://')) ? request.car.image : getImageUrl(request.car?.image)}
                          alt={`${request.car?.make} ${request.car?.model}`}
                          className="img-fluid h-100 w-100"
                          style={{ objectFit: 'cover', minHeight: '200px' }}
                          onError={(e) => {
                            e.target.src = '/images/default-car.jpg';
                          }}
                        />
                        <div className="position-absolute top-0 start-0 m-2">
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    </Col>
                    <Col md={7}>
                      <Card.Body className="d-flex flex-column h-100">
                        <div className="mb-auto">
                          <div className="d-flex align-items-center mb-2">
                            <i className={`${getTypeIcon(request.type)} text-red me-2`}></i>
                            <h6 className="mb-0">{getTypeText(request.type)}</h6>
                          </div>
                          
                          <h5 className="card-title mb-2">
                            {request.car?.make} {request.car?.model}
                          </h5>
                          
                          <div className="mb-3">
                            <small className="text-muted d-block">
                              <i className="bi bi-calendar me-1"></i>
                              Preferred: {formatDate(request.preferredDate)} at {formatTime(request.preferredTime)}
                            </small>
                            <small className="text-muted d-block">
                              <i className="bi bi-clock me-1"></i>
                              Requested: {formatDate(request.createdAt)}
                            </small>
                            {request.contactPhone && (
                              <small className="text-muted d-block">
                                <i className="bi bi-telephone me-1"></i>
                                {request.contactPhone}
                              </small>
                            )}
                          </div>

                          {request.message && (
                            <div className="mb-3">
                              <small className="text-muted">
                                <strong>Message:</strong> {request.message}
                              </small>
                            </div>
                          )}

                          {request.adminNotes && (
                            <div className="mb-3">
                              <div className="bg-light p-2 rounded">
                                <small className="text-muted">
                                  <strong>Admin Notes:</strong> {request.adminNotes}
                                </small>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="d-flex gap-2 mt-3">
                          <Button
                            as={Link}
                            to={`/cars/${request.car?._id}`}
                            variant="outline-primary"
                            size="sm"
                            className="flex-fill"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View Car
                          </Button>
                          
                          {request.status === 'pending' && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => openDeleteModal(request)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            <Col className="text-center py-5">
              <Card>
                <Card.Body className="py-5">
                  <i className="bi bi-calendar-x" style={{ fontSize: '5rem', color: '#ccc' }}></i>
                  <h3 className="mt-4 mb-3">No Requests Yet</h3>
                  <p className="text-muted mb-4">
                    You haven't made any car requests yet. Browse our collection and 
                    schedule a test drive or make a booking request for your dream car!
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button as={Link} to="/cars" className="btn-primary">
                      <i className="bi bi-car-front me-2"></i>
                      Browse Cars
                    </Button>
                    <Button as={Link} to="/dashboard" variant="outline-primary">
                      <i className="bi bi-house me-2"></i>
                      Back to Dashboard
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Request Status Legend */}
        {requests.length > 0 && (
          <Row className="mt-5">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <h6 className="mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Request Status Guide
                  </h6>
                  <Row>
                    <Col md={3} className="mb-2">
                      <div className="d-flex align-items-center">
                        {getStatusBadge('pending')}
                        <small className="ms-2 text-muted">Under review</small>
                      </div>
                    </Col>
                    <Col md={3} className="mb-2">
                      <div className="d-flex align-items-center">
                        {getStatusBadge('approved')}
                        <small className="ms-2 text-muted">Confirmed & scheduled</small>
                      </div>
                    </Col>
                    <Col md={3} className="mb-2">
                      <div className="d-flex align-items-center">
                        {getStatusBadge('rejected')}
                        <small className="ms-2 text-muted">Not available</small>
                      </div>
                    </Col>
                    <Col md={3} className="mb-2">
                      <div className="d-flex align-items-center">
                        {getStatusBadge('completed')}
                        <small className="ms-2 text-muted">Successfully completed</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {requestToDelete && (
            <>
              <p>Are you sure you want to delete this request?</p>
              <div className="bg-light p-3 rounded">
                <strong>{getTypeText(requestToDelete.type)}</strong><br />
                <span className="text-muted">
                  {requestToDelete.car?.make} {requestToDelete.car?.model}
                </span><br />
                <small className="text-muted">
                  Scheduled for {formatDate(requestToDelete.preferredDate)} at {formatTime(requestToDelete.preferredTime)}
                </small>
              </div>
              <p className="mt-3 mb-0 text-muted">
                <small>This action cannot be undone.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteRequest}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Delete Request
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyRequests;