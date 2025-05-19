// Handles upload -> whisper -> GPT -> report
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { createGptPrompt } = require("../utils/gptPrompt");
const { generateReport } = require("../utils/generateReport");
const { transcribe } = require("../utils/transcribe");
const { OpenAI } = require("openai");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".mp3", ".wav", ".m4a", ".ogg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
}).single("audio");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const processAudio = async (req, res) => {
  try {
    // Handle file upload using multer
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
      }

      const audioFilePath = req.file.path;
      const filename = path.basename(audioFilePath);

      // Step 1: Transcribe audio using Whisper (via JavaScript module)
      console.log("Transcribing audio file:", audioFilePath);
      let transcription;
      
      try {
        transcription = await transcribe(audioFilePath);
        console.log("Transcription completed");
      } catch (error) {
        console.error("Transcription error:", error);
        return res.status(500).json({ error: "Transcription failed: " + error.message });
      }

      // Step 2: Process transcription with GPT
      console.log("Processing with GPT");
      const prompt = createGptPrompt(transcription);
      
      let gptResponse;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          max_tokens: 1500,
        });
        
        gptResponse = completion.choices[0].message.content;
        console.log("GPT processing completed");
      } catch (error) {
        console.error("GPT processing error:", error);
        return res.status(500).json({ error: "GPT processing failed" });
      }

      // Step 3: Generate PDF report
      console.log("Generating report");
      const reportData = {
        content: gptResponse,
        audioFilename: filename,
        transcription,
        timestamp: new Date().toISOString(),
      };
      
      const reportPath = await generateReport(reportData);
      
      if (!reportPath) {
        return res.status(500).json({ error: "Report generation failed" });
      }

      // Return success response
      res.status(200).json({
        message: "Audio processed successfully",
        report: {
          path: reportPath,
          url: `/reports/${path.basename(reportPath)}`,
        },
        transcription,
        summary: gptResponse,
      });
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { processAudio };