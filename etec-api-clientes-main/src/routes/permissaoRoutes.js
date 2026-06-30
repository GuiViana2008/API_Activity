const express = require("express");
const router = express.Router();
const permissaoController = require("../controllers/permissaoController");
const { autenticarToken, autorizarPermissoes } = require("../middlewares/authMiddleware");

router.get("/", autenticarToken, permissaoController.listarPermissoes);
router.post("/", autenticarToken, autorizarPermissoes("admin"), permissaoController.criarPermissao);

module.exports = router;
