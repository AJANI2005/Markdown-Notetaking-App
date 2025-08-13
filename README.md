# How to Run the Markdown Notetaking App

## Prerequisites
- Node.js installed (v16 or later recommended)
- npm (comes with Node.js)

---

## Setup

1. Clone the repository:

   ```bash
   git clone https://your-repo-url.git
   cd Markdown-Notetaking-App

    Install dependencies:

        In root (if applicable):

npm install

In backend (server):

npm install --prefix server

In frontend (app):

        npm install --prefix app

Development

To run both backend and frontend concurrently:

npm run dev

    Backend runs on http://localhost:5000

    Frontend runs on http://localhost:5173

Production Build and Run

    Build the frontend:

npm run build --prefix app

Start the backend server:

    npm start --prefix server

    Backend serves the built frontend from app/dist

    App available at http://localhost:5000

Cleaning

To delete all node_modules folders:

npm run clean

Then reinstall dependencies as above.
Notes

    Build frontend before starting backend in production

    Backend API available at /notes (GET, POST, DELETE)
