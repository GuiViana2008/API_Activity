const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

function formatarUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    ativo: usuario.ativo,
    permissao: usuario.permissao
      ? { id: usuario.permissao.id, nome: usuario.permissao.nome }
      : undefined,
    criadoEm: usuario.criadoEm,
    atualizadoEm: usuario.atualizadoEm,
  };
}

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { ativo: true },
      include: { permissao: true },
      orderBy: { id: "asc" },
    });

    return res.status(200).json({
      sucesso: true,
      total: usuarios.length,
      dados: usuarios.map(formatarUsuario),
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários.",
      erro: error.message,
    });
  }
};

const buscarUsuarioPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID inválido. Informe um número inteiro.",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { permissao: true },
    });

    if (!usuario || !usuario.ativo) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Usuário com ID ${id} não encontrado.`,
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: formatarUsuario(usuario),
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar usuário por ID.",
      erro: error.message,
    });
  }
};

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, permissaoId } = req.body;

    if (!nome || !email || !senha || !permissaoId) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Informe nome, email, senha e permissaoId.",
      });
    }

    const permissao = await prisma.permissao.findUnique({
      where: { id: Number(permissaoId) },
    });

    if (!permissao) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Permissão não encontrada.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        permissaoId: Number(permissaoId),
      },
      include: { permissao: true },
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuário criado com sucesso.",
      dados: formatarUsuario(usuario),
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar usuário.",
      erro: error.message,
    });
  }
};

const atualizarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, senha, permissaoId, ativo } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID inválido. Informe um número inteiro.",
      });
    }

    const usuarioExiste = await prisma.usuario.findUnique({ where: { id } });

    if (!usuarioExiste || !usuarioExiste.ativo) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Usuário com ID ${id} não encontrado.`,
      });
    }

    const dadosAtualizados = {};

    if (nome !== undefined) dadosAtualizados.nome = nome;
    if (email !== undefined) dadosAtualizados.email = email;
    if (ativo !== undefined) dadosAtualizados.ativo = Boolean(ativo);

    if (senha !== undefined && senha !== "") {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    if (permissaoId !== undefined) {
      const permissao = await prisma.permissao.findUnique({
        where: { id: Number(permissaoId) },
      });

      if (!permissao) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Permissão não encontrada.",
        });
      }

      dadosAtualizados.permissaoId = Number(permissaoId);
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: dadosAtualizados,
      include: { permissao: true },
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário atualizado com sucesso.",
      dados: formatarUsuario(usuario),
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar usuário.",
      erro: error.message,
    });
  }
};

const deletarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID inválido. Informe um número inteiro.",
      });
    }

    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario || !usuario.ativo) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Usuário com ID ${id} não encontrado.`,
      });
    }

    await prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: `Usuário com ID ${id} removido com sucesso.`,
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao remover usuário.",
      erro: error.message,
    });
  }
};

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
};
