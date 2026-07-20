const express = require("express");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

// Porta dinamica per Render
const PORT = process.env.PORT || 3000;

// Per leggere JSON dal POST
app.use(express.json());

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rotta POST che genera il PDF
app.post("/genera-preventivo", (req, res) => {
  const { cliente, data, totale, voci } = req.body;

  // Header corretti per PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=preventivo.pdf");

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  // LOGO
  try {
    doc.image("assets/logo.jpeg", 40, 40, { width: 100 });
  } catch (err) {
    console.log("Logo non trovato:", err);
  }

  doc.moveDown(3);

  // Titolo
  doc.fontSize(22).text("Preventivo", { align: "center" });
  doc.moveDown();

  // Dati cliente
  doc.fontSize(12).text(`Cliente: ${cliente}`);
  doc.text(`Data: ${data}`);
  doc.moveDown();

  // Tabella voci
  doc.fontSize(14).text("Dettaglio voci:");
  doc.moveDown();

  const listaVoci = JSON.parse(voci);

  // Intestazione tabella
  doc.fontSize(12).text("Descrizione", 40, doc.y);
  doc.text("Qta", 250, doc.y);
  doc.text("Prezzo", 300, doc.y);
  doc.text("Subtotale", 380, doc.y);
  doc.moveDown();

  // Riga separatrice
  doc.moveTo(40, doc.y).lineTo(500, doc.y).stroke();
  doc.moveDown(0.5);

  // Righe tabella
  listaVoci.forEach(voce => {
    const subtotale = (voce.qta * voce.prezzo).toFixed(2);

    doc.text(voce.descrizione, 40, doc.y);
    doc.text(voce.qta, 250, doc.y);
    doc.text(`€${voce.prezzo}`, 300, doc.y);
    doc.text(`€${subtotale}`, 380, doc.y);
    doc.moveDown();
  });

  doc.moveDown();

  // Totale
  doc.fontSize(16).text(`Totale: €${totale}`, { align: "right" });

  doc.end();
});

// Avvio server
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
