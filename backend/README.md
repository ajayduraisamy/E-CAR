# E-CAR Backend

Backend for **E-CAR (Car Comparison & Marketplace System)** built with:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Role-based authorization (`user`, `admin`)
- Multer local image upload

## What Is Implemented

### 1) Authentication + Authorization
- User registration: `POST /api/auth/register`
- User login: `POST /api/auth/login`
- Password hashing using `bcryptjs`
- JWT token generation with payload:
  - `id`
  - `role`
- Protected route middleware:
  - `authMiddleware` (token verify)
  - `adminMiddleware` (admin only access)

### 2) Car Management
- Admin can create a car: `POST /api/cars`
- Anyone can list cars: `GET /api/cars`
- Anyone can fetch car by ID: `GET /api/cars/:id`
- Admin can delete car: `DELETE /api/cars/:id`

Car includes:
- Basic info: `name`, `brand`, `price`, `image`
- Engine/performance: `engine`, `horsepower`, `torque`, `mileage`, `top_speed`
- Fuel/transmission: `fuel_type`, `transmission`
- Dimensions: `seating_capacity`, `boot_space`, `fuel_tank_capacity`
- Features: `airbags`, `abs`, `infotainment_system`, `sunroof`, `gps`

### 3) Car Comparison
- Compare 2 cars: `GET /api/cars/compare/:id1/:id2`
- Comparison categories:
  - `price` (lower is better)
  - `horsepower` (higher is better)
  - `mileage` (higher is better)
  - `top_speed` (higher is better)
- Returns better car per category + summary text

### 4) Marketplace (Buy/Sell Listings)
- Create listing: `POST /api/market` (auth required)
- Get all listings: `GET /api/market`
- Get logged-in user listings: `GET /api/market/user`

Listing fields:
- `title`, `price`, `description`, `contact`, `location`, `image`, `user`

### 5) Order + Simulated Payment
- Create order: `POST /api/order/create`
- Get logged-in user's orders: `GET /api/order/user`
- Simulate payment: `POST /api/payment/pay`

Order supports:
- `pending` / `paid` status
- optional `car` reference
- `payment_method` (`card` or `upi`)

Payment supports:
- `amount`, `method`, `status`, `transaction_id`
- `card_last4` only for card
- `upi_id` only for UPI
- No full card/CVV storage

### 6) Local Image Upload (Multer)
- Upload directory: `backend/uploads`
- Folder auto-created if missing
- Static serving enabled:
  - `app.use('/uploads', express.static('uploads'))`
- Car create supports file upload field: `image`
- Marketplace create supports file upload field: `image`
- Stored path format in DB: `uploads/<filename>`

## Project Structure

```text
backend/
  config/
    db.js
  controllers/
    authController.js
    carController.js
    marketController.js
    orderController.js
    paymentController.js
  middleware/
    adminMiddleware.js
    authMiddleware.js
    uploadMiddleware.js
  models/
    User.js
    Car.js
    Listing.js
    Order.js
    Payment.js
  routes/
    authRoutes.js
    carRoutes.js
    marketRoutes.js
    orderRoutes.js
    paymentRoutes.js
  uploads/
  .env
  .gitignore
  app.js
  package.json
  README.md
```

## Environment Variables

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=secret123
```

## Install & Run

```bash
npm install
npm run dev
```

Production:

```bash
npm start
```

Base URL:
- `http://localhost:5000`

Health route:
- `GET /` -> `API is running`

## API Quick Reference

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Cars
- `POST /api/cars` (Auth + Admin, multipart/form-data supported)
- `GET /api/cars`
- `GET /api/cars/:id`
- `DELETE /api/cars/:id` (Auth + Admin)
- `GET /api/cars/compare/:id1/:id2`

### Marketplace
- `POST /api/market` (Auth, multipart/form-data supported)
- `GET /api/market`
- `GET /api/market/user` (Auth)

### Order
- `POST /api/order/create` (Auth)
- `GET /api/order/user` (Auth)

### Payment
- `POST /api/payment/pay` (Auth)

## Authentication Header

Use token returned from login/register:

```http
Authorization: Bearer <your_jwt_token>
```

## Upload Notes

For image upload routes (`/api/cars`, `/api/market`):
- Use `multipart/form-data`
- File field name must be `image`
- Allowed types: JPG, JPEG, PNG, WEBP
- Max size: 5MB

Static URL example:
- If DB stores `uploads/image-123.png`
- Access at: `http://localhost:5000/uploads/image-123.png`

## Manual Test Flow

1. Register an admin user:
   - `POST /api/auth/register` with `"role": "admin"`
2. Login admin and copy token.
3. Create a car using admin token.
4. Register/login normal user.
5. Create marketplace listing with user token.
6. Create order with user token.
7. Pay order with user token.
8. Check user orders.

