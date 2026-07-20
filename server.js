const express = require('express');
const PDFDocument = require('pdfkit');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/genera-preventivo', (req, res) => {
    const dati = req.body;

    const doc = new PDFDocument();
    let chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
        const pdf = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=preventivo.pdf');
        res.send(pdf);
    });

    doc.fontSize(20).text("PREVENTIVO", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Cliente: ${dati.cliente}`);
    doc.text(`Data: ${dati.data}`);
    doc.moveDown();

    const voci = JSON.parse(dati.voci);
    voci.forEach(voce => {
        doc.text(`${voce.descrizione} - ${voce.qta} x €${voce.prezzo}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Totale: €${dati.totale}`);

    doc.end();
});

app.listen(3000, () => {
    console.log("Server attivo su http://localhost:3000");
});
