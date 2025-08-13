import express from "express";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// data
const notes = [];

// API routes
app.get("/notes", (req, res) => {
  res.send({ notes });
});

app.post("/notes", (req, res) => {
  const { id, title, content } = req.body;
  const note = notes.find((note) => note.id === id);
  if (note) {
    note.title = title;
    note.content = content;
  } else {
    notes.push({ id, title, content });
  }
  res.sendStatus(200);
  console.log(notes);
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Serve static files from Vite build folder
app.use(express.static(path.join(__dirname, "..", "app", "dist")));

// Catch-all: send index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "app", "dist", "index.html"));
});
const PORT = 5000;
app.listen(5000, () => {
  console.log("Server is running on port " + PORT);
});
