// GPT prompt helper

const createGptPrompt = (transcription) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  return `You are a professional legal assistant. You need to convert the following audio narration from an advocate/lawyer into a structured, judge-ready legal report.

Today's Date: ${currentDate}

Please organize the report with the following sections:
1. CASE TITLE: Generate an appropriate title based on the content.
2. CASE SUMMARY: A 2-3 paragraph summary of the case in professional legal language.
3. PARTIES INVOLVED: List all parties mentioned in the narration (plaintiff, defendant, etc.).
4. CHRONOLOGY OF EVENTS: List important dates and events in chronological order.
5. EVIDENCE & STATEMENTS: Highlight any evidence or statements mentioned.
6. LEGAL ISSUES: Identify the primary legal issues at stake.
7. ACTION REQUESTED: Specify the final action or request mentioned by the advocate.

Use formal legal terminology and maintain a professional tone throughout. Format the response clearly with appropriate headings and bullet points where necessary.

ADVOCATE'S NARRATION:
${transcription}`;
};

module.exports = { createGptPrompt };