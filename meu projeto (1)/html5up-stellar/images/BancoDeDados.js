const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const bodyparser = require("body-parser");
const path = require("path")

const app = express()
const db = new sqlite3.Database('banco_de_dados.db');

app.use(bodyparser.json());
app.use(express.static(__dirname))

db.run('CREATE TABLE IF NOT EXISTS usuarios (nome TEXT, email TEXT, idade integer)');

    app.post("/cadastro", (req, res) => {
        const { nome, email, idade } = req.body;

    db.run("INSERT INTO usuarios (nome, email, idade) VALUES (?, ?, ?)", [nome, email, idade], function (err) {
      if (err) {
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
      }
      res.json({ message: "Usuário cadastrado com sucesso!" });
    });
  });

  app.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
  });