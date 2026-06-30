const prisma = require("../config/prisma");

const listarPermissoes = async (req, res) => {
  try {
    const permissoes = await prisma.permissao.findMany({
      orderBy: { id: "asc" },
    });

    return res.status(200).json({
      sucesso: true,
      total: permissoes.length,
      dados: permissoes,
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar permissões.",
      erro: error.message,
    });
  }
};

const criarPermissao = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O nome da permissão é obrigatório.",
      });
    }

    const permissao = await prisma.permissao.create({
      data: { nome, descricao },
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Permissão criada com sucesso.",
      dados: permissao,
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar permissão.",
      erro: error.message,
    });
  }
};

module.exports = {
  listarPermissoes,
  criarPermissao,
};
