/**
 * Test script for the audio processing API
 * 
 * Usage: node test.js <audio_file_path>
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();

async function testAudioProcessing(audioFilePath) {
  if (!fs.existsSync(audioFilePath)) {
    console.error(`File not found: ${audioFilePath}`);
    process.exit(1);
  }

  const form = new FormData();
  form.append('audio', fs.createReadStream(audioFilePath));

  try {
    console.log(`Uploading ${audioFilePath} for processing...`);
    const response = await axios.post('http://localhost:5000/api/audio/process', form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('Processing successful!');
    console.log('--------------------------');
    console.log('Transcription:');
    console.log(response.data.transcription.substring(0, 500) + '...');
    console.log('--------------------------');
    console.log('Report URL:', `http://localhost:5000${response.data.report.url}`);
    console.log('--------------------------');
    console.log('AI-Generated Summary:');
    console.log(response.data.summary);
    
    return response.data;
  } catch (error) {
    console.error('Error processing audio:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node test.js <audio_file>');
    process.exit(1);
  }
  
  testAudioProcessing(args[0]);
}

module.exports = { testAudioProcessing };