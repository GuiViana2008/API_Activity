const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { autenticarToken, autorizarPermissoes } = require("../middlewares/authMiddleware");

// Todos os endpoints de usuários exigem login.
router.use(autenticarToken);

// Admin, editor e user podem consultar.
router.get("/", autorizarPermissoes("admin", "editor", "user"), usuarioController.listarUsuarios);
router.get("/:id", autorizarPermissoes("admin", "editor", "user"), usuarioController.buscarUsuarioPorId);

// Apenas admin pode criar e remover usuários.
router.post("/", autorizarPermissoes("admin"), usuarioController.criarUsuario);
router.delete("/:id", autorizarPermissoes("admin"), usuarioController.deletarUsuario);

// Admin e editor podem editar usuários.
router.put("/:id", autorizarPermissoes("admin", "editor"), usuarioController.atualizarUsuario);

module.exports = router;
