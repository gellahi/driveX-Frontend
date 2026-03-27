import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { carsAPI } from '../services/api';
import CarCard from '../components/CarCard';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    description: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    color: '',
    status: 'available',
    features: '',
    image: null
  });

  const carMakes = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 
    'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia', 'Mazda',
    'Subaru', 'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln'
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await carsAPI.getAdminCars();
      setCars(response.data.cars);
    } catch (err) {
      setError('Failed to fetch cars. Please try again.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      description: '',
      mileage: '',
      fuelType: 'Petrol',
      transmission: 'Manual',
      color: '',
      status: 'available',
      features: '',
      image: null
    });
    setEditingCar(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      description: car.description,
      mileage: car.mileage || '',
      fuelType: car.fuelType,
      transmission: car.transmission,
      color: car.color || '',
      status: car.status,
      features: car.features ? car.features.join(', ') : '',
      image: null
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      };

      if (editingCar) {
        const response = await carsAPI.updateCar(editingCar._id, submitData);
        setCars(cars.map(car => car._id === editingCar._id ? response.data : car));
      } else {
        const response = await carsAPI.createCar(submitData);
        setCars([response.data, ...cars]);
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save car. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!carToDelete) return;

    try {
      setDeleteLoading(true);
      await carsAPI.deleteCar(carToDelete);
      setCars(cars.filter(car => car._id !== carToDelete));
      setShowDeleteModal(false);
      setCarToDelete(null);
    } catch (err) {
      setError('Failed to delete car. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (carId) => {
    setCarToDelete(carId);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading cars...</p>
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
                  <i className="bi bi-car-front me-3"></i>
                  Manage Cars
                </h1>
                <p className="lead text-muted">
                  Add, edit, and manage your car inventory
                </p>
              </div>
              <Button className="btn-primary" onClick={openAddModal}>
                <i className="bi bi-plus-circle me-2"></i>
                Add New Car
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

        {/* Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-red">{cars.length}</h3>
                <p className="mb-0 text-muted">Total Cars</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">{cars.filter(car => car.status === 'available').length}</h3>
                <p className="mb-0 text-muted">Available</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">{cars.filter(car => car.status === 'reserved').length}</h3>
                <p className="mb-0 text-muted">Reserved</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-danger">{cars.filter(car => car.status === 'sold').length}</h3>
                <p className="mb-0 text-muted">Sold</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <Row>
            {cars.map(car => (
              <Col key={car._id} lg={4} md={6} className="mb-4">
                <CarCard 
                  car={car} 
                  showAdminActions={true}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            <Col className="text-center py-5">
              <Card>
                <Card.Body className="py-5">
                  <i className="bi bi-car-front" style={{ fontSize: '5rem', color: '#ccc' }}></i>
                  <h3 className="mt-4 mb-3">No Cars Found</h3>
                  <p className="text-muted mb-4">
                    Start building your inventory by adding your first car.
                  </p>
                  <Button className="btn-primary" onClick={openAddModal}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Your First Car
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Add/Edit Car Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi ${editingCar ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Make *</Form.Label>
                  <Form.Select
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Make</option>
                    {carMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Model *</Form.Label>
                  <Form.Control
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter model"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Year *</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                    placeholder="Enter price"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Mileage</Form.Label>
                  <Form.Control
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Enter mileage"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Transmission</Form.Label>
                  <Form.Select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Enter color"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter car description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              <Form.Control
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="Enter features separated by commas (e.g., GPS, Leather Seats, Sunroof)"
              />
              <Form.Text className="text-muted">
                Separate multiple features with commas
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Car Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Upload a high-quality image of the car (JPG, PNG, max 5MB)
              </Form.Text>
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
                    {editingCar ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${editingCar ? 'bi-check' : 'bi-plus'} me-2`}></i>
                    {editingCar ? 'Update Car' : 'Add Car'}
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
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this car?</p>
          <p className="text-muted mb-0">
            <small>This action cannot be undone.</small>
          </p>
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
            onClick={handleDelete}
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
                Delete Car
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageCars;