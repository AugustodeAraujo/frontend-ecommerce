# Mini Autoparts API - Estudos SQLite

Cliente for an automotive e-commerce. Built with React, TypeScript, Shadcn, Tailwind JWT authentication.

## Pre-requisitos

- Node.js 24.8.0
- npm 10+

## Variaveis de ambiente

1. Crie um arquivo `.env` na raiz do projeto (ou copie `.env.example`, se existir).
2. Configure pelo menos as variaveis abaixo antes de iniciar a aplicacao:

   ```env
   PORT=3333                # opcional (padrao 3333)
   JWT_SECRET=troque-isto   # obrigatorio para autenticacao
   SQLITE_DB_PATH=database.sqlite
   ```

## Instalacao

```bash
npm install
```

## Fluxo de desenvolvimento

1. Garanta que o `.env` esteja configurado.
2. Execute as migracoes do banc (database\migrations ):

   ```bash
   npm run migrate
   ```

3. Popule os dados iniciais com os seeders (usuários e produtos database\seeders):

   ```bash
   npm run seed
   ```

4. Suba a API em modo desenvolvimento (ts-node-dev):

   ```bash
   npm run dev
   ```

Durante o desenvolvimento o banco SQLite padrao fica em `database.sqlite`.

## Build e execucao em producao

1. Gere o build TypeScript -> JavaScript:

   ```bash
   npm run build
   ```

2. Rode as migracoes no ambiente de destino (caso necessario):

   ```bash
   npm run migrate
   ```

3. Opcionalmente rode os seeders:

   ```bash
   npm run seed
   ```

4. Inicie a aplicacao compilada:

   ```bash
   npm run start
   ```

## Atalhos de banco de dados

- Desfazer a ultima migracao: `npm run migrate:undo`
- Resetar tudo (drop + migrate + seed, se configurado): `npm run reset`

Tenha certeza de remover ou atualizar o arquivo `database.sqlite` se o esquema mudar de forma incompativel.
