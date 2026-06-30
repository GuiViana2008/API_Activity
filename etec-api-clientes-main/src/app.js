const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const prisma = require("./config/prisma");
const clienteRoutes = require("./routes/clienteRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const permissaoRoutes = require("./routes/permissaoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API ETEC - Clientes, Usuários, Permissões e Autenticação",
    versao: "2.0.0",
    observacao: "Faça POST /auth/login para receber o token JWT.",
    loginPadrao: {
      email: "admin@etec.com",
      senha: "admin123",
    },
    endpoints: {
      auth: {
        login: "POST /auth/login",
      },
      usuarios: {
        criar: "POST /usuarios",
        listarTodos: "GET /usuarios",
        buscarPorId: "GET /usuarios/:id",
        atualizar: "PUT /usuarios/:id",
        remover: "DELETE /usuarios/:id",
      },
      permissoes: {
        listarTodas: "GET /permissoes",
        criar: "POST /permissoes",
      },
      clientesExistenteNoProjeto: {
        listarTodos: "GET /clientes",
        buscarPorId: "GET /clientes/:id",
        adicionar: "POST /clientes",
        atualizar: "PUT /clientes/:id",
        remover: "DELETE /clientes/:id",
      },
    },
  });
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/permissoes", permissaoRoutes);
app.use("/clientes", clienteRoutes);

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: "Rota não encontrada.",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Conexão com o banco encerrada.");
  process.exit(0);
});

module.exports = app;
