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
  // Imposta header corretti per PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=preventivo.pdf");

  const doc = new PDFDocument();

  // Invia il PDF al browser
  doc.pipe(res);

  // Contenuto del PDF (provvisorio, poi lo personalizziamo col tuo modello)
  doc.fontSize(20).text("Preventivo", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text("Questo è un PDF di test generato dal server.");

  // Chiudi il documento
  doc.end();
});

// Avvio del server
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
