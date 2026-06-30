# API de Usuários com Permissões — Express + Prisma + MySQL

Projeto adaptado com base no arquivo enviado para atender à atividade do quadro: criar uma **API REST no Express** com **usuários**, **permissões**, **CRUD**, **banco de dados**, **usuário admin**, **regras de autorização** e o extra de **autenticação**.

---

## O que foi feito

- Mantido o projeto original de clientes.
- Criada API de usuários.
- Criada tabela `usuarios`.
- Criada tabela `permissoes`.
- Criado relacionamento entre usuário e permissão.
- Criado usuário administrador padrão.
- Criado login com JWT.
- Criado CRUD de usuários.
- Criadas regras de autorização por permissão.
- Criado README com instruções para rodar e testar.

---

## Tecnologias usadas

- Node.js
- Express
- Prisma
- MySQL
- JWT
- bcryptjs
- dotenv

---

## Estrutura principal

```txt
src/
├── app.js
├── config/
│   └── prisma.js
├── controllers/
│   ├── authController.js
│   ├── clienteController.js
│   ├── permissaoController.js
│   └── usuarioController.js
├── middlewares/
│   └── authMiddleware.js
└── routes/
    ├── authRoutes.js
    ├── clienteRoutes.js
    ├── permissaoRoutes.js
    └── usuarioRoutes.js
```

---

## Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o banco no MySQL

Abra o MySQL/phpMyAdmin e crie um banco com este nome:

```sql
CREATE DATABASE api_usuarios;
```

### 3. Configurar o `.env`

Copie o arquivo `.env.example` e renomeie para `.env`.

Exemplo:

```env
DB_CONNECTION="mysql://root:@localhost:3306/api_usuarios"
PORT=3000
JWT_SECRET="troque-essa-chave-secreta"
```

Se o seu MySQL tiver senha, coloque a senha depois de `root:`.

Exemplo com senha `123456`:

```env
DB_CONNECTION="mysql://root:123456@localhost:3306/api_usuarios"
```

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

### 5. Criar as tabelas no banco

```bash
npx prisma migrate dev
```

### 6. Criar permissões e usuário admin

```bash
npx prisma db seed
```

Esse comando cria as permissões:

- `admin`
- `editor`
- `user`

E cria o usuário administrador:

```txt
email: admin@etec.com
senha: admin123
```

### 7. Rodar a API

```bash
npm run dev
```

Ou:

```bash
npm start
```

A API vai rodar em:

```txt
http://localhost:3000
```

---

## Como fazer login

Rota:

```http
POST /auth/login
```

URL completa:

```txt
http://localhost:3000/auth/login
```

Body JSON:

```json
{
  "email": "admin@etec.com",
  "senha": "admin123"
}
```

Resposta esperada:

```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso.",
  "token": "SEU_TOKEN_AQUI"
}
```

Copie o token e use nas rotas protegidas no header:

```txt
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## Rotas de usuários

### Listar usuários

Permissões: `admin`, `editor`, `user`

```http
GET /usuarios
```

---

### Buscar usuário por ID

Permissões: `admin`, `editor`, `user`

```http
GET /usuarios/:id
```

Exemplo:

```http
GET /usuarios/1
```

---

### Criar usuário

Permissão: apenas `admin`

```http
POST /usuarios
```

Body JSON:

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "permissaoId": 3
}
```

---

### Atualizar usuário

Permissões: `admin` e `editor`

```http
PUT /usuarios/:id
```

Body JSON:

```json
{
  "nome": "João Atualizado",
  "email": "joao@email.com",
  "permissaoId": 2
}
```

---

### Remover usuário

Permissão: apenas `admin`

```http
DELETE /usuarios/:id
```

A remoção é lógica, ou seja, o usuário fica com `ativo = false`.

---

## Rotas de permissões

### Listar permissões

Precisa estar logado.

```http
GET /permissoes
```

---

### Criar permissão

Permissão: apenas `admin`

```http
POST /permissoes
```

Body JSON:

```json
{
  "nome": "supervisor",
  "descricao": "Pode supervisionar determinados cadastros."
}
```

---

## Regras de autorização usadas

| Ação | Permissões autorizadas |
|---|---|
| Login | público |
| Listar usuários | admin, editor, user |
| Buscar usuário por ID | admin, editor, user |
| Criar usuário | admin |
| Atualizar usuário | admin, editor |
| Remover usuário | admin |
| Listar permissões | usuário logado |
| Criar permissão | admin |

---

## Rotas antigas de clientes

O CRUD de clientes original continua funcionando:

```http
GET /clientes
GET /clientes/:id
POST /clientes
PUT /clientes/:id
DELETE /clientes/:id
```

---

## Observação para entrega

Depois de testar, envie o projeto para um repositório no GitHub e entregue o link do repositório, conforme a orientação do quadro.
