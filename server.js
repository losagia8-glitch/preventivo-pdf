const express = require("express");
const path = require("path");

const app = express();

// Porta dinamica per Render
const PORT = process.env.PORT || 3000;

// Serve index.html dalla root del progetto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Avvio del server
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
