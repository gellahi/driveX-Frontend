# 🚗 DriveX Frontend

React.js frontend for the DriveX Car Dealership Management System.

## Features
- Modern, bold UI/UX (black/red/white)
- Responsive design (Bootstrap 5, React Bootstrap)
- Car browsing, details, and requests
- Admin dashboard & management
- Customer dashboard & request history
- Protected routes (role-based)
- Context API for state management

## Tech Stack
- React 18, React Router 6
- Bootstrap 5, React Bootstrap
- Axios
- Context API

## Setup
1. From project root:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   Runs at http://localhost:3000

## Project Structure
- `src/components/` — Navbar, Footer, CarCard, PrivateRoute, AdminRoute
- `src/pages/` — Home, Login, Signup, Cars, CarDetails, Dashboard, MyRequests, AdminDashboard, ManageCars, ManageRequests
- `src/contexts/` — AuthContext
- `src/services/` — api.js (Axios config)

## Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=DriveX
REACT_APP_VERSION=1.0.0
```

## Testing
- Run tests: `npm test`

## License
MIT License. See root LICENSE file.

## Support
Email: support@drivex.com