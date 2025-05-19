# Legal Case Documentation API

An AI-powered platform that simplifies legal case documentation by converting audio narrations into structured, judge-ready reports.

## Features

- Audio file upload and processing
- Speech-to-text transcription using OpenAI Whisper
- AI-powered analysis and structuring using GPT
- Professional PDF report generation
- API endpoints for integration with front-end applications

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Installation

1. Clone the repository
```
git clone <repository-url>
cd legal-case-documentation-api
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file from the template
```
cp .env.template .env
```

4. Add your OpenAI API key to the `.env` file
```
OPENAI_API_KEY=your_api_key_here
```

## Usage

### Start the server

```
npm start
```

For development with auto-restart:
```
npm run dev
```

### API Endpoints

#### Upload and Process Audio

**POST /api/audio/process**

Upload an audio file for processing. The file will be transcribed, analyzed, and a report will be generated.

**Request:**
- Content-Type: multipart/form-data
- Body: 
  - audio: Audio file (supported formats: .mp3, .wav, .m4a, .ogg)

**Response:**
```json
{
  "message": "Audio processed successfully",
  "report": {
    "path": "/path/to/report.pdf",
    "url": "/reports/report-12345.pdf"
  },
  "transcription": "Full text transcription...",
  "summary": "AI-generated summary and analysis..."
}
```

### Access Generated Reports

Reports are available at:
```
http://localhost:5000/reports/{filename}
```

## Project Structure

```
├── controllers/        # Request handlers
├── uploads/            # Uploaded audio files
├── reports/            # Generated PDF reports
├── routes/             # API routes
├── utils/              # Utility functions
│   ├── transcribe.js   # Whisper transcription 
│   ├── generateReport.js # PDF generation
│   └── gptPrompt.js    # GPT prompting
├── server.js           # Main entry point
└── .env                # Environment variables
```

## Next Steps

1. Frontend development with React
2. Authentication and user management
3. Report history and management dashboard
4. Additional export formats (DOCX, etc.)

## License

ISC