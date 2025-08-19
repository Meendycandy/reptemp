const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyparser = require("body-parser");
const path = require("path");

const app = express();
const db = new sqlite3.Database("banco_de_dados.db");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, "publico")));

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
  )
`);

app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  db.run(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ message: "Email já cadastrado." });
        }
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
      }
      res.json({ message: "Usuário cadastrado com sucesso!" });
    }
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});