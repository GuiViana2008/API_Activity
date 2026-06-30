// src/routes/clienteRoutes.js

const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

// GET /clientes
router.get("/", clienteController.listarClientes);

// GET /clientes/:id
router.get("/:id", clienteController.buscarClientePorId);

// POST /clientes
router.post("/", clienteController.adicionarCliente);

//PUT /clientes/:id
router.put("/:id", clienteController.atualizarCliente);

//DELETE /clientes/:id
router.delete("/:id", clienteController.deleteCliente);

module.exports = router;
