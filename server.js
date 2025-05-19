// Main server entry point

require("dotenv").config();
const express = require("express");
const audioRoutes = require("./routes/audioRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders for uploads and reports
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/reports", express.static(path.join(__dirname, "reports")));

// API routes
app.use("/api/audio", audioRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Audio Processing Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
