# MERN-App

MERN-App is a simple product catalog application built with MongoDB, Express, React, Node.js, and TypeScript. Users can view listed products, sign up or log in, upload products with images, and manage the products they created.

## Features

- View all products as a guest
- Sign up and log in
- Upload product name, price, description, and image
- Edit or delete your own products
- Store product data in MongoDB

## How to Use

1. Open the `backend` folder and create a `.env` file with your MongoDB connection string:

```env
MONGO_DB=your_mongodb_connection_string
```

2. Start the backend:

```bash / cmd
cd backend
npm install
npm run server
```

3. Start the frontend in another terminal:

```bash / cmd
cd frontend
npm install
npm run dev
```

4. Open the frontend URL shown in the terminal. The backend runs on `http://localhost:3000`.