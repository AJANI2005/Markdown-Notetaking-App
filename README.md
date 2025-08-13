# How to Run the Markdown Notetaking App

## Prerequisites
- Node.js installed (v16 or later recommended)
- npm (comes with Node.js)

---

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/AJANI2005/Markdown-Notetaking-App.git
   cd Markdown-Notetaking-App

## How to Run the App


2. Install all dependencies for the root, backend, and frontend:

```bash
npm run install-all

```
## Development

To start both the frontend and backend servers concurrently in development mode:

```bash
npm run dev
```

    Frontend Vite dev server runs on http://localhost:5173
    Backend Express server runs on http://localhost:5000

## Production Build and Start

To build the frontend and start the backend server (which serves the built frontend):

npm start

    This runs the frontend build (app/dist) then starts the Express server.

    The full app will be available at http://localhost:5000

Cleaning

To remove all node_modules folders from root, backend, and frontend:

```bash
npm run clean
```

After cleaning, run npm run install-all to reinstall dependencies.
