# E-commerce Frontend

A modern e-commerce frontend built with React, Material-UI, and Redux Toolkit. This project is designed to work with the e-commerce backend API and provides a user interface similar to Flipkart.

## Features

- User authentication (Login/Register)
- Product listing with filters and search
- Product details with image gallery
- Shopping cart management
- Wishlist functionality
- Checkout process with Razorpay integration
- Order history and tracking
- Responsive design for all devices
- Material-UI components for a modern look
- Toast notifications for user feedback

## Tech Stack

- React 18
- Vite
- Material-UI
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Formik & Yup for form handling
- React Toastify for notifications
- Razorpay for payments

## Prerequisites

- Node.js 14+ installed
- Backend API running (refer to backend README)
- Razorpay account for payments

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecom-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The build files will be available in the `dist` directory.

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── layout/        # Layout components (Header, Footer)
│   └── ui/           # UI components
├── pages/             # Page components
├── store/             # Redux store setup
│   └── slices/       # Redux slices
├── utils/             # Utility functions
├── App.jsx           # Main App component
└── main.jsx         # Entry point
```

## API Integration

The frontend integrates with the following API endpoints:

- `/api/users` - User authentication and profile management
- `/api/products` - Product listing and details
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order management
- `/api/wishlist` - Wishlist management

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For support, email support@example.com or create an issue in the repository. 