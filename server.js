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

  const doc = new PDFDocument();
  doc.pipe(res);

  // Titolo
  doc.fontSize(20).text("Preventivo", { align: "center" });
  doc.moveDown();

  // Dati cliente
  doc.fontSize(12).text(`Cliente: ${cliente}`);
  doc.text(`Data: ${data}`);
  doc.moveDown();

  // Voci del preventivo
  doc.fontSize(14).text("Dettaglio voci:");
  doc.moveDown();

  const listaVoci = JSON.parse(voci);

  listaVoci.forEach(voce => {
    doc.fontSize(12).text(
      `${voce.descrizione} - Qta: ${voce.qta} - Prezzo: €${voce.prezzo}`
    );
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
