const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

async function main() {
  const permissoes = [
    { nome: "admin", descricao: "Pode criar, listar, editar e excluir usuários." },
    { nome: "editor", descricao: "Pode listar usuários e editar dados." },
    { nome: "user", descricao: "Pode apenas consultar informações permitidas." },
  ];

  for (const permissao of permissoes) {
    await prisma.permissao.upsert({
      where: { nome: permissao.nome },
      update: permissao,
      create: permissao,
    });
  }

  const admin = await prisma.permissao.findUnique({ where: { nome: "admin" } });
  const senhaHash = await bcrypt.hash("admin123", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@etec.com" },
    update: {
      nome: "Administrador",
      senha: senhaHash,
      ativo: true,
      permissaoId: admin.id,
    },
    create: {
      nome: "Administrador",
      email: "admin@etec.com",
      senha: senhaHash,
      ativo: true,
      permissaoId: admin.id,
    },
  });

  console.log("Seed executado com sucesso!");
  console.log("Usuário admin: admin@etec.com | senha: admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
