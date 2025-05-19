// Generates PDF report
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReport = async (data) => {
  try {
    const { content, audioFilename, timestamp, transcription } = data;
    
    // Create a unique filename for the report
    const reportFilename = `report-${Date.now()}.pdf`;
    const reportPath = path.join(__dirname, "../reports", reportFilename);
    
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Pipe output to file
    const stream = fs.createWriteStream(reportPath);
    doc.pipe(stream);
    
    // Add title
    doc.fontSize(20).font("Helvetica-Bold").text("Legal Case Report", { align: "center" });
    doc.moveDown();
    
    // Add metadata
    doc.fontSize(12).font("Helvetica");
    doc.text(`Generated: ${new Date(timestamp).toLocaleString()}`);
    doc.text(`Audio Source: ${audioFilename}`);
    doc.moveDown();
    
    // Add horizontal line
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown();
    
    // Add formatted content
    doc.fontSize(12).font("Helvetica-Bold").text("Case Summary:");
    doc.fontSize(11).font("Helvetica").text(content);
    doc.moveDown(2);
    
    // Add original transcription
    doc.fontSize(12).font("Helvetica-Bold").text("Original Transcription:");
    doc.fontSize(10).font("Helvetica").text(transcription, {
      paragraphGap: 5,
      lineGap: 2
    });
    
    // Add page numbers
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(10).text(
        `Page ${i + 1} of ${pageCount}`,
        50,
        doc.page.height - 50,
        { align: "center" }
      );
    }
    
    // Finalize PDF
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on("finish", () => {
        resolve(reportPath);
      });
      
      stream.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return null;
  }
};

module.exports = { generateReport };