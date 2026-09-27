# Patrimônia — API + site de login/cadastro

Backend em Node/Express conectado ao Postgres, com endpoints de cadastro e
login, e um site estático simples para usar essas telas.

## 1. Pré-requisitos

- Node.js 18+
- Um banco Postgres já criado com o schema do Patrimônia (o schema revisado
  que você já tem, com as tabelas `usuario`, `conta`, etc.)

## 2. Instalar dependências

```bash
npm install
```

## 3. Configurar a conexão com o banco

```bash
cp .env.example .env
```

Edite o `.env`:

- Se usa Supabase/Neon/Railway/Render: cole a connection string em
  `DATABASE_URL` e deixe `PGSSL=true`.
- Se usa Postgres local: preencha `PGHOST`, `PGDATABASE`, `PGUSER`,
  `PGPASSWORD` e deixe `DATABASE_URL` vazio ou apague a linha.
- Gere um `JWT_SECRET` forte, por exemplo:
  ```bash
  openssl rand -hex 32
  ```

## 4. Rodar a migração de senha

O schema original não tinha campo de senha. Rode este script uma vez no seu
banco (psql, DBeaver, painel do Supabase, etc.):

```
sql/001_add_senha_usuario.sql
```

Ele adiciona a coluna `senha_hash` na tabela `usuario`.

## 5. Subir o servidor

```bash
npm start
```

Acesse `http://localhost:3000` — o próprio Express serve o site que está em
`public/`.

## 6. Endpoints da API

| Rota | Método | Body | O que faz |
|---|---|---|---|
| `/api/cadastro` | POST | `{ nome, email, senha }` | Cria o usuário (senha com hash bcrypt) e retorna um token JWT |
| `/api/login` | POST | `{ email, senha }` | Confere a senha e retorna um token JWT |
| `/api/perfil` | GET | — (header `Authorization: Bearer <token>`) | Rota protegida de exemplo |
| `/api/status` | GET | — | Healthcheck: confirma se a API está conectada ao Postgres |

O token retornado deve ser guardado no cliente (o site já faz isso no
`localStorage`) e enviado em `Authorization: Bearer <token>` nas próximas
chamadas a rotas protegidas.

## 7. Estrutura

```
patrimonia/
├── server.js              # Servidor Express
├── db.js                  # Conexão com o Postgres (pg Pool)
├── routes/auth.js         # /api/cadastro, /api/login, /api/perfil
├── middleware/auth.js      # Verificação do JWT
├── sql/001_add_senha_usuario.sql
├── public/                # Site (HTML/CSS/JS puro, sem build)
│   ├── index.html
│   ├── style.css
│   └── app.js
└── .env.example
```

## Segurança — pontos que valem atenção antes de ir para produção

- As senhas são armazenadas com hash `bcrypt` (nunca em texto puro).
- As mensagens de erro de login são propositalmente genéricas ("E-mail ou
  senha inválidos") para não revelar se um e-mail existe na base.
- Adicione um rate limit (ex.: `express-rate-limit`) nas rotas de login e
  cadastro para dificultar força bruta.
- Se for usar Supabase Auth em vez desse login próprio, prefira a
  abordagem descrita na nota do schema (tabela `perfil` + RLS) em vez desta
  API — são duas soluções alternativas, não use as duas ao mesmo tempo.
