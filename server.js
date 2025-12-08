const express = require("express");
const path = require("path");

const app = express();

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Public (CSS/JS/IMG)
app.use(express.static(path.join(__dirname, "src/public")));

// ROTA PRINCIPAL
app.get("/", (req, res) => {
    res.render("gestao"); // dashboard.ejs
});

// Porta
const port = 3000;
app.listen(port, () => console.log(`🚀 Servidor rodando http://localhost:${port}`));
