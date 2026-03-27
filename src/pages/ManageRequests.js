import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner, Badge, Table } from 'react-bootstrap';
import { requestsAPI, getImageUrl } from '../services/api';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  });

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;

      const response = await requestsAPI.getAllRequests(params);
      setRequests(response.data.requests);
    } catch (err) {
      setError('Failed to fetch requests. Please try again.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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
    return type === 'test_drive' ? 'Test Drive' : 'Booking';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      type: ''
    });
  };

  const openStatusModal = (request) => {
    setSelectedRequest(request);
    setStatusForm({
      status: request.status,
      adminNotes: request.adminNotes || ''
    });
    setShowModal(true);
  };

  const handleStatusFormChange = (e) => {
    const { name, value } = e.target;
    setStatusForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      setModalLoading(true);
      setError('');
      
      const response = await requestsAPI.updateRequestStatus(selectedRequest._id, statusForm);
      
      // Update the request in the list
      setRequests(requests.map(req => 
        req._id === selectedRequest._id ? response.data : req
      ));
      
      setShowModal(false);
      setSelectedRequest(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request status. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading requests...</p>
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
                  Manage Requests
                </h1>
                <p className="lead text-muted">
                  Review and manage customer requests
                </p>
              </div>
              <Button variant="outline-primary" onClick={() => window.location.reload()}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
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

        {/* Filters */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <h6 className="mb-3">
                  <i className="bi bi-funnel me-2"></i>
                  Filter Requests
                </h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Types</option>
                        <option value="test_drive">Test Drive</option>
                        <option value="booking">Booking</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      variant="outline-secondary"
                      onClick={clearFilters}
                      className="mb-3"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Clear Filters
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-red">{requests.length}</h3>
                <p className="mb-0 text-muted">Total Requests</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">{requests.filter(req => req.status === 'pending').length}</h3>
                <p className="mb-0 text-muted">Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">{requests.filter(req => req.status === 'approved').length}</h3>
                <p className="mb-0 text-muted">Approved</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info">{requests.filter(req => req.status === 'completed').length}</h3>
                <p className="mb-0 text-muted">Completed</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Requests Table */}
        {requests.length > 0 ? (
          <Card>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Customer</th>
                      <th>Car</th>
                      <th>Preferred Date</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className={`${getTypeIcon(request.type)} text-red me-2`}></i>
                            {getTypeText(request.type)}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold">{request.customer?.name}</div>
                            <small className="text-muted">{request.customer?.email}</small>
                            {request.contactPhone && (
                              <div>
                                <small className="text-muted">
                                  <i className="bi bi-telephone me-1"></i>
                                  {request.contactPhone}
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={request.car?.image && (request.car.image.startsWith('http://') || request.car.image.startsWith('https://')) ? request.car.image : getImageUrl(request.car?.image)}
                              alt={`${request.car?.make} ${request.car?.model}`}
                              className="rounded me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = '/images/default-car.jpg';
                              }}
                            />
                            <div>
                              <div className="fw-bold">
                                {request.car?.make} {request.car?.model}
                              </div>
                              <small className="text-muted">{request.car?.year}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{formatDate(request.preferredDate)}</div>
                            <small className="text-muted">{formatTime(request.preferredTime)}</small>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(request.status)}
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatDate(request.createdAt)}
                          </small>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openStatusModal(request)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body className="text-center py-5">
              <i className="bi bi-calendar-x" style={{ fontSize: '5rem', color: '#ccc' }}></i>
              <h3 className="mt-4 mb-3">No Requests Found</h3>
              <p className="text-muted mb-4">
                {filters.status || filters.type 
                  ? 'No requests match your current filters.' 
                  : 'No customer requests have been made yet.'
                }
              </p>
              {(filters.status || filters.type) && (
                <Button variant="outline-primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil me-2"></i>
            Manage Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              {/* Request Details */}
              <div className="mb-4 p-3 bg-light rounded">
                <Row>
                  <Col md={6}>
                    <h6>
                      <i className={`${getTypeIcon(selectedRequest.type)} me-2`}></i>
                      {getTypeText(selectedRequest.type)} Request
                    </h6>
                    <p className="mb-1">
                      <strong>Customer:</strong> {selectedRequest.customer?.name}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {selectedRequest.customer?.email}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {selectedRequest.contactPhone}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>
                      {selectedRequest.car?.make} {selectedRequest.car?.model} ({selectedRequest.car?.year})
                    </h6>
                    <p className="mb-1">
                      <strong>Preferred Date:</strong> {formatDate(selectedRequest.preferredDate)}
                    </p>
                    <p className="mb-1">
                      <strong>Preferred Time:</strong> {formatTime(selectedRequest.preferredTime)}
                    </p>
                    <p className="mb-1">
                      <strong>Requested:</strong> {formatDate(selectedRequest.createdAt)}
                    </p>
                  </Col>
                </Row>
                
                {selectedRequest.message && (
                  <div className="mt-3">
                    <strong>Customer Message:</strong>
                    <p className="mb-0 mt-1">{selectedRequest.message}</p>
                  </div>
                )}
              </div>

              {/* Status Update Form */}
              <Form onSubmit={handleStatusUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    name="status"
                    value={statusForm.status}
                    onChange={handleStatusFormChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Admin Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="adminNotes"
                    value={statusForm.adminNotes}
                    onChange={handleStatusFormChange}
                    placeholder="Add notes for the customer (optional)"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    className="btn-primary flex-fill"
                    disabled={modalLoading}
                  >
                    {modalLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check me-2"></i>
                        Update Status
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={modalLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageRequests;