Contact Form Fullstack App
This is a fullstack application with a React frontend and a Node.js/Express backend, deployed on Vercel from a single repository.
Project Structure

frontend/: React app built with Vite
backend/: Node.js/Express server with MongoDB
vercel.json: Vercel configuration for deploying both frontend and backend
package.json: Root dependencies and scripts

Setup

Install dependencies:
npm install
cd frontend
npm install


Environment variables:Create a .env file in the root with:
MONGO_URI=your_mongodb_connection_string


Run locally:

Backend: npm run dev:backend
Frontend: npm run dev:frontend


Build for production:
npm run build



Deployment

Push the repository to GitHub.
Connect to Vercel and import the repository.
Set the MONGO_URI environment variable in Vercel’s dashboard.
Deploy the app.

Endpoints

Frontend: Served at /
Backend API: Available at /api/* (e.g., /api/contact, /api/health)

Notes

The frontend is a React app that submits form data to /api/contact.
The backend uses MongoDB to store contact form submissions.
Ensure MongoDB is accessible from Vercel’s serverless environment.

#   f l a v o r p i x e l p r o s 5  
 