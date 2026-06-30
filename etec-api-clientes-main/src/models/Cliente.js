// src/models/Cliente.js

class Cliente {
  constructor(id, nome, telefone, endereco) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
  }
}

module.exports = Cliente;
