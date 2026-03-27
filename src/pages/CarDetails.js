import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { carsAPI, requestsAPI, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('test_drive');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');
  
  const [requestForm, setRequestForm] = useState({
    preferredDate: '',
    preferredTime: '',
    message: '',
    contactPhone: user?.phone || ''
  });

  const fetchCarDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await carsAPI.getCarById(id);
      setCar(response.data);
    } catch (err) {
      setError('Failed to fetch car details. Please try again.');
      console.error('Error fetching car details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCarDetails();
  }, [fetchCarDetails]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { variant: 'success', text: 'Available' },
      sold: { variant: 'danger', text: 'Sold' },
      reserved: { variant: 'warning', text: 'Reserved' }
    };
    
    const config = statusConfig[status] || statusConfig.available;
    return <Badge bg={config.variant} className="fs-6">{config.text}</Badge>;
  };

  const handleRequestFormChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setRequestLoading(true);
    setRequestError('');
    setRequestSuccess('');

    try {
      const requestData = {
        carId: car._id,
        type: requestType,
        ...requestForm
      };

      await requestsAPI.createRequest(requestData);
      setRequestSuccess(`${requestType === 'test_drive' ? 'Test drive' : 'Booking'} request submitted successfully!`);
      setShowRequestModal(false);
      
      // Reset form
      setRequestForm({
        preferredDate: '',
        preferredTime: '',
        message: '',
        contactPhone: user?.phone || ''
      });
    } catch (err) {
      setRequestError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  const openRequestModal = (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRequestType(type);
    setShowRequestModal(true);
    setRequestError('');
    setRequestSuccess('');
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading car details...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error || !car) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Alert variant="danger">{error || 'Car not found'}</Alert>
            <Button variant="outline-primary" onClick={() => navigate('/cars')}>
              <i className="bi bi-arrow-left me-2"></i>
              Back to Cars
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <Button variant="outline-secondary" onClick={() => navigate('/cars')}>
              <i className="bi bi-arrow-left me-2"></i>
              Back to Cars
            </Button>
          </Col>
        </Row>

        {requestSuccess && (
          <Row className="mb-4">
            <Col>
              <Alert variant="success">{requestSuccess}</Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={car.image && (car.image.startsWith('http://') || car.image.startsWith('https://')) ? car.image : getImageUrl(car.image)}
                  alt={`${car.make} ${car.model}`}
                  style={{ height: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/default-car.jpg';
                  }}
                />
                <div className="position-absolute top-0 end-0 m-3">
                  {getStatusBadge(car.status)}
                </div>
              </div>
              
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Card.Title className="h2 mb-2">
                      {car.make} {car.model}
                    </Card.Title>
                    <div className="car-price mb-3">
                      {formatPrice(car.price)}
                    </div>
                  </div>
                </div>

                <Row className="mb-4">
                  <Col sm={6} md={3} className="mb-2">
                    <div className="text-center p-3 bg-light rounded">
                      <i className="bi bi-calendar text-red fs-4"></i>
                      <div className="fw-bold mt-2">{car.year}</div>
                      <small className="text-muted">Year</small>
                    </div>
                  </Col>
                  <Col sm={6} md={3} className="mb-2">
                    <div className="text-center p-3 bg-light rounded">
                      <i className="bi bi-speedometer text-red fs-4"></i>
                      <div className="fw-bold mt-2">{car.mileage?.toLocaleString() || 0}</div>
                      <small className="text-muted">Miles</small>
                    </div>
                  </Col>
                  <Col sm={6} md={3} className="mb-2">
                    <div className="text-center p-3 bg-light rounded">
                      <i className="bi bi-fuel-pump text-red fs-4"></i>
                      <div className="fw-bold mt-2">{car.fuelType}</div>
                      <small className="text-muted">Fuel Type</small>
                    </div>
                  </Col>
                  <Col sm={6} md={3} className="mb-2">
                    <div className="text-center p-3 bg-light rounded">
                      <i className="bi bi-gear text-red fs-4"></i>
                      <div className="fw-bold mt-2">{car.transmission}</div>
                      <small className="text-muted">Transmission</small>
                    </div>
                  </Col>
                </Row>

                <div className="mb-4">
                  <h5>Description</h5>
                  <p className="text-muted">{car.description}</p>
                </div>

                {car.color && (
                  <div className="mb-4">
                    <h5>Color</h5>
                    <p className="text-muted">{car.color}</p>
                  </div>
                )}

                {car.features && car.features.length > 0 && (
                  <div className="mb-4">
                    <h5>Features</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {car.features.map((feature, index) => (
                        <Badge key={index} bg="secondary" className="p-2">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '100px' }}>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-calendar-check me-2"></i>
                  Request This Car
                </h5>
              </Card.Header>
              <Card.Body>
                {car.status === 'available' ? (
                  <>
                    <p className="text-muted mb-4">
                      Interested in this vehicle? Schedule a test drive or make a booking request.
                    </p>
                    
                    <div className="d-grid gap-2">
                      <Button
                        className="btn-primary"
                        onClick={() => openRequestModal('test_drive')}
                      >
                        <i className="bi bi-car-front me-2"></i>
                        Schedule Test Drive
                      </Button>
                      
                      <Button
                        variant="outline-primary"
                        onClick={() => openRequestModal('booking')}
                      >
                        <i className="bi bi-bookmark me-2"></i>
                        Make Booking Request
                      </Button>
                    </div>

                    {!user && (
                      <div className="mt-3 text-center">
                        <small className="text-muted">
                          <Button variant="link" onClick={() => navigate('/login')} className="p-0">
                            Login
                          </Button> to make a request
                        </small>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-warning fs-1"></i>
                    <h6 className="mt-3">Not Available</h6>
                    <p className="text-muted">
                      This car is currently {car.status}. Please check back later or browse other available cars.
                    </p>
                    <Button variant="outline-primary" onClick={() => navigate('/cars')}>
                      Browse Other Cars
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Request Modal */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi ${requestType === 'test_drive' ? 'bi-car-front' : 'bi-bookmark'} me-2`}></i>
            {requestType === 'test_drive' ? 'Schedule Test Drive' : 'Make Booking Request'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {requestError && <Alert variant="danger">{requestError}</Alert>}
          
          <div className="mb-3 p-3 bg-light rounded">
            <h6>{car.make} {car.model} ({car.year})</h6>
            <div className="text-red fw-bold">{formatPrice(car.price)}</div>
          </div>

          <Form onSubmit={handleRequestSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="preferredDate"
                    value={requestForm.preferredDate}
                    onChange={handleRequestFormChange}
                    min={minDate}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Time</Form.Label>
                  <Form.Select
                    name="preferredTime"
                    value={requestForm.preferredTime}
                    onChange={handleRequestFormChange}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Contact Phone</Form.Label>
              <Form.Control
                type="tel"
                name="contactPhone"
                value={requestForm.contactPhone}
                onChange={handleRequestFormChange}
                required
                placeholder="Your phone number"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Message (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={requestForm.message}
                onChange={handleRequestFormChange}
                placeholder="Any additional information or special requests..."
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                className="btn-primary flex-fill"
                disabled={requestLoading}
              >
                {requestLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  `Submit ${requestType === 'test_drive' ? 'Test Drive' : 'Booking'} Request`
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowRequestModal(false)}
                disabled={requestLoading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CarDetails;