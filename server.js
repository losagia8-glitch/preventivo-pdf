const express = require("express");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

// Porta dinamica per Render
const PORT = process.env.PORT || 3000;

// Serve index.html dalla root del progetto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rotta per generare il PDF
app.get("/genera-pdf", (req, res) => {
  // Header corretti per PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=preventivo.pdf");

  const doc = new PDFDocument();
  doc.pipe(res);

  // Contenuto di test (poi lo sostituiamo col tuo modello)
  doc.fontSize(20).text("Preventivo", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text("PDF generato correttamente dal server.");

  doc.end();
});

// Avvio del server
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
