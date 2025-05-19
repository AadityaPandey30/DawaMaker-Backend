// GPT prompt helper

const createGptPrompt = (transcription) => {
  // TODO: Implement prompt formatting for GPT
  return `You are a legal assistant. Given the following narration by an advocate, convert it into a structured, judge-ready report.

Include:
- Date of recording (use today's date)
- Summary of the case in professional legal language
- Parties involved
- Chronological facts
- Statements or evidence mentioned
- Final action or request

Narration:\n\n${transcription}`;
};

module.exports = { createGptPrompt };
