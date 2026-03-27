import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { carsAPI } from '../services/api';
import CarCard from '../components/CarCard';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    year: '',
    minPrice: '',
    maxPrice: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const carMakes = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 
    'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia', 'Mazda',
    'Subaru', 'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.make) params.make = filters.make;
      if (filters.year) params.year = filters.year;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      params.page = filters.page;
      params.limit = 12;

      const response = await carsAPI.getAllCars(params);
      setCars(response.data.cars);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (err) {
      setError('Failed to fetch cars. Please try again.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      make: '',
      year: '',
      minPrice: '',
      maxPrice: '',
      page: 1
    });
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-3">
              <i className="bi bi-car-front me-3"></i>
              Premium Car Collection
            </h1>
            <p className="lead text-muted">
              Discover your perfect ride from our extensive collection of premium vehicles
            </p>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="mb-3">
              <i className="bi bi-funnel me-2"></i>
              Filter Cars
            </h5>
            <Row>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by make, model..."
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Make</Form.Label>
                  <Form.Select
                    name="make"
                    value={filters.make}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Makes</option>
                    {carMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="$0"
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="$100,000"
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="mb-3 d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  onClick={clearFilters}
                  className="w-100"
                >
                  <i className="bi bi-x-circle"></i>
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Results Info */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {pagination.total} Cars Found
            </h5>
            <small className="text-muted">
              Page {pagination.currentPage} of {pagination.totalPages}
            </small>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Loading Spinner */}
      {loading && (
        <Row className="mb-4">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading cars...</p>
          </Col>
        </Row>
      )}

      {/* Cars Grid */}
      {!loading && cars.length > 0 && (
        <Row>
          {cars.map(car => (
            <Col key={car._id} lg={4} md={6} className="mb-4">
              <CarCard car={car} />
            </Col>
          ))}
        </Row>
      )}

      {/* No Cars Found */}
      {!loading && cars.length === 0 && !error && (
        <Row>
          <Col className="text-center py-5">
            <i className="bi bi-car-front" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <h4 className="mt-3">No Cars Found</h4>
            <p className="text-muted">
              Try adjusting your search filters to find more cars.
            </p>
            <Button variant="outline-primary" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </Col>
        </Row>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Row className="mt-5">
          <Col className="d-flex justify-content-center">
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <i className="bi bi-chevron-left"></i>
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.currentPage ? 'primary' : 'outline-primary'}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline-primary"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
                <i className="bi bi-chevron-right"></i>
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cars;