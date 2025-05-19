// API endpoints for audio processing

const express = require("express");
const router = express.Router();
const { processAudio } = require("../controllers/processAudio");

// POST /api/audio/process
router.post("/process", processAudio);

module.exports = router;
