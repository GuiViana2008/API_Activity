const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Informe email e senha.",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { permissao: true },
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Email ou senha inválidos.",
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Email ou senha inválidos.",
      });
    }

    const segredo = process.env.JWT_SECRET || "segredo-desenvolvimento";
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        permissao: usuario.permissao.nome,
      },
      segredo,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      sucesso: true,
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        permissao: usuario.permissao.nome,
      },
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao realizar login.",
      erro: error.message,
    });
  }
};

module.exports = { login };
