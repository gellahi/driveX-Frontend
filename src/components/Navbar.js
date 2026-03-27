import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar expand="lg" className="navbar fixed-top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-brand">
          <i className="bi bi-car-front-fill me-2"></i>
          DriveX
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/cars">Cars</Nav.Link>
            {user && (
              <>
                {isAdmin() ? (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/cars">Manage Cars</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/requests">Manage Requests</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown title="Dashboard" id="customer-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/dashboard">Overview</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-requests">My Requests</NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <NavDropdown title={`Welcome, ${user.name}`} id="user-nav-dropdown" align="end">
                <NavDropdown.Item>
                  <small className="text-muted">Role: {user.role}</small>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;