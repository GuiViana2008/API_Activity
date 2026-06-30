const prisma = require("../config/prisma");

// GET /clientes — retorna todos os clientes

const listarClientes = async (req, res) => {
  try {
    const resultado = await prisma.cliente.findMany({
      where: { ativo: true },
    });
    return res.status(200).json({
      sucesso: true,
      total: resultado.length,
      dados: resultado.map((c) => ({ id: c.id, nome: c.nome, telefone: c.telefone, endereco: c.endereco })),
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar clientes.",
      erro: error.message,
    });
  }
};

// GET /clientes/:id — retorna um cliente pelo ID

const buscarClientePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID inválido. Deve ser um número inteiro.",
      });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: id },
    });

    if (!cliente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Cliente com ID ${id} não encontrado.`,
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: cliente,
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar cliente por ID.",
      erro: error.message,
    });
  }
};

// POST /clientes — cria um novo cliente

const adicionarCliente = async (req, res) => {
  try {
    const { nome, telefone, endereco } = req.body;
    const novo_cliente = await prisma.cliente.create({
      data: {
        nome: nome,
        telefone: telefone,
        endereco: endereco,
      },
    });
    return res.status(201).json({
      sucesso: true,
      mensagem: `Usuário ${novo_cliente.nome} adicionado com sucesso!`,
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar cliente",
      erro: error.message,
    });
  }
};

//PUT /clientes/:id — atualiza um cliente pelo ID

const atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, endereco } = req.body;

    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });
    if (!cliente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Cliente de id ${id} não encontrado.`,
      });
    } else {
      await prisma.cliente.update({
        where: { id: parseInt(id) },
        data: { nome, telefone, endereco },
      });

      return res.status(200).json({
        sucesso: true,
        mensagem: "Cliente atualizado com sucesso!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar cliente",
      erro: error.message,
    });
  }
};

// DELETE /clientes/:id - remove um cliente pelo id

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cliente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Cliente de id ${id} não encontrado.`,
      });
    } else {
      await prisma.cliente.update({
        where: { id: parseInt(id) },
        data: { ativo: false },
      });
      return res.status(200).json({
        sucesso: true,
        mensagem: `Cliente de id ${id} removido com sucesso!`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao remover cliente",
      error: error.message,
    });
  }
};

module.exports = {
  listarClientes,
  buscarClientePorId,
  adicionarCliente,
  atualizarCliente,
  deleteCliente,
};
