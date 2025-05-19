// Main server entry point

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const audioRoutes = require("./routes/audioRoutes");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure required directories exist
const directories = ["uploads", "reports"];
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
});

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders for uploads and reports
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/reports", express.static(path.join(__dirname, "reports")));

// API routes
app.use("/api/audio", audioRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Legal Case Documentation API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server error",
    message: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`- Reports available at: http://localhost:${PORT}/reports`);
  console.log(`- API endpoint: http://localhost:${PORT}/api/audio/process`);
});