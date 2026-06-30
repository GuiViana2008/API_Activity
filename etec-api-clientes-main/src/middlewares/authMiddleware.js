const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Token não informado. Faça login para acessar esta rota.",
    });
  }

  const [tipo, token] = authHeader.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Formato inválido. Use: Bearer SEU_TOKEN",
    });
  }

  try {
    const segredo = process.env.JWT_SECRET || "segredo-desenvolvimento";
    const dados = jwt.verify(token, segredo);
    req.usuarioLogado = dados;
    return next();
  } catch (error) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Token inválido ou expirado.",
    });
  }
}

function autorizarPermissoes(...permissoesPermitidas) {
  return (req, res, next) => {
    const permissao = req.usuarioLogado?.permissao;

    if (!permissao || !permissoesPermitidas.includes(permissao)) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Acesso negado. Sua permissão não permite esta ação.",
      });
    }

    return next();
  };
}

module.exports = {
  autenticarToken,
  autorizarPermissoes,
};
