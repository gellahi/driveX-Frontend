import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const CarCard = ({ car, showAdminActions = false, onEdit, onDelete }) => {
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
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  return (
    <Card className="car-card h-100">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={car.image && (car.image.startsWith('http://') || car.image.startsWith('https://')) ? car.image : getImageUrl(car.image)}
          alt={`${car.make} ${car.model}`}
          onError={(e) => {
            e.target.src = '/images/default-car.jpg';
          }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          {getStatusBadge(car.status)}
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-auto">
          <Card.Title className="h5 mb-2">
            {car.make} {car.model}
          </Card.Title>
          
          <div className="car-price mb-2">
            {formatPrice(car.price)}
          </div>
          
          <div className="car-specs mb-3">
            <span className="car-spec">
              <i className="bi bi-calendar me-1"></i>
              {car.year}
            </span>
            <span className="car-spec">
              <i className="bi bi-speedometer me-1"></i>
              {car.mileage?.toLocaleString() || 0} mi
            </span>
            <span className="car-spec">
              <i className="bi bi-fuel-pump me-1"></i>
              {car.fuelType}
            </span>
            <span className="car-spec">
              <i className="bi bi-gear me-1"></i>
              {car.transmission}
            </span>
          </div>
          
          <Card.Text className="text-muted small">
            {car.description?.length > 100 
              ? `${car.description.substring(0, 100)}...` 
              : car.description
            }
          </Card.Text>
        </div>
        
        <div className="mt-3">
          {showAdminActions ? (
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(car)}
                className="flex-fill"
              >
                <i className="bi bi-pencil me-1"></i>
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(car._id)}
                className="flex-fill"
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </Button>
            </div>
          ) : (
            <Button
              as={Link}
              to={`/cars/${car._id}`}
              className="btn-primary w-100"
              disabled={car.status !== 'available'}
            >
              <i className="bi bi-eye me-2"></i>
              View Details
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;