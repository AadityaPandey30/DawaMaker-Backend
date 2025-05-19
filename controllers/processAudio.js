// Handles upload -> whisper -> GPT -> report

const processAudio = async (req, res) => {
  // TODO: Implement audio upload, transcription (whisper), GPT processing, and report generation
  res.status(501).json({ message: "Not implemented yet." });
};

module.exports = { processAudio };
