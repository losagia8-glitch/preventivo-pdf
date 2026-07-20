const express = require("express");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve file statici (CSS, immagini, ecc.)
app.use(express.static(__dirname));

// Per leggere JSON dal POST
app.use(express.json());

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Genera PDF stile INV24
app.post("/genera-preventivo", (req, res) => {
  const { cliente, data, totale, voci } = req.body;
  const listaVoci = JSON.parse(voci);

  const subtotale = listaVoci.reduce((sum, v) => sum + (v.qta * v.prezzo), 0);
  const iva = (subtotale * 0.22).toFixed(2);
  const totaleFinale = (subtotale + parseFloat(iva)).toFixed(2);

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

  doc.fontSize(18).font("Helvetica-Bold").text("MG2 PONTEGGI", 160, 50);
  doc.fontSize(10).font("Helvetica").text("Soluzioni professionali per ponteggi", 160, 70);

  doc.moveDown(3);

  doc.fontSize(22).text("Preventivo", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).font("Helvetica-Bold").text("Cliente:");
  doc.font("Helvetica").text(cliente);
  doc.moveDown();

  doc.fontSize(12).font("Helvetica-Bold").text("Data:");
  doc.font("Helvetica").text(data);
  doc.moveDown(2);

  const startX = 40;
  let y = doc.y;

  doc.fontSize(12).font("Helvetica-Bold");
  doc.text("Descrizione", startX, y);
  doc.text("Qta", startX + 250, y);
  doc.text("Prezzo", startX + 300, y);
  doc.text("Subtotale", startX + 380, y);

  y += 20;

  doc.moveTo(startX, y).lineTo(500, y).stroke();
  y += 10;

  doc.font("Helvetica");

  listaVoci.forEach(voce => {
    const subt = (voce.qta * voce.prezzo).toFixed(2);

    doc.text(voce.descrizione, startX, y);
    doc.text(voce.qta, startX + 250, y);
    doc.text(`€${voce.prezzo}`, startX + 300, y);
    doc.text(`€${subt}`, startX + 380, y);

    y += 20;

    doc.moveTo(startX, y).lineTo(500, y).stroke();
    y += 10;
  });

  doc.moveDown(2);

  doc.fontSize(14).font("Helvetica-Bold");
  doc.text(`Subtotale: €${subtotale.toFixed(2)}`, { align: "right" });
  doc.text(`IVA (22%): €${iva}`, { align: "right" });
  doc.text(`Totale: €${totaleFinale}`, { align: "right" });

  doc.moveDown(3);

  doc.fontSize(12).font("Helvetica-Bold").text("Dati azienda", startX);
  doc.moveDown(0.5);

  doc.font("Helvetica").text("MG22 PONTEGGI");
  doc.text("Via Roma 123, Bergamo");
  doc.text("P.IVA: 12345678901");
  doc.moveDown();

  doc.fontSize(12).font("Helvetica-Bold").text("Dati bancari");
  doc.font("Helvetica").text("Banca Intesa Sanpaolo");
  doc.text("IBAN: IT00A0000000000000000000000");
  doc.text("SWIFT/BIC: BCITITMM");

  doc.end();
});

app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
