/**
 * Transcribe audio using OpenAI Whisper API.
 * Requires OPENAI_API_KEY in environment variables.
 * Usage: node transcribe.js <audio_file_path>
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

async function transcribe(audioPath) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not set in environment variables.');
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const fileName = path.basename(audioPath);
    
    // Use the OpenAI SDK instead of axios
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription error details:', error);
    if (error.response) {
      throw new Error(
        `OpenAI API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
      );
    }
    throw error;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node transcribe.js <audio_file>');
    process.exit(1);
  }
  transcribe(args[0])
    .then((text) => {
      console.log(text);
    })
    .catch((err) => {
      console.error('Transcription failed:', err.message);
    });
}

module.exports = { transcribe };