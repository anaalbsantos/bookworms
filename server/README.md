# Server

Back-end development with Node.js🛠️

## Running the project

1. Assegure-se de ter o **docker/docker-compose**, bem como um gerenciador de pacotes como **npm** ou **pnpm**, instalados em sua máquina.

2. Instale as dependências:

```bash
npm install
# or
pnpm install
```

3. Crie um arquivo **.env** na raiz do projeto, com as seguintes variáveis de ambiente:

```dotenv
# ###### GENERAL SETTINGS #######
PROJECT_NAME=bookworms

# ###### SERVER SETTINGS #######
SERVER_PORT=3001
NODE_ENV=development

# ----> UNICA PARTE CRIADA PARA BOOKWORMS// A SENHA É: Livrosminhocas
DATABASE_URL=postgresql://postgres.erbtihwtnntpgrzueyfo:Livrosminhocas@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
DATABASE_PORT=5432
DATABASE_PASSWORD=Livrosminhocas

# ###### JWT SETTINGS FOR AUTHENTICATION #######
JWT_ACCESS_SECRET=0551c0ed-6389-46b1-839e-2e28fc191c89 # token for 30sec
JWT_REFRESH_SECRET=92fba49f6912d14733332bb9ebaac1562f51ee685594acf103d71f685f70868b # token for 7 days

# ###### S3 SETTINGS FOR FILE UPLOADS #######
S3_ENDPOINT=XXXXXX.digitaloceanspaces.com
S3_BUCKET=exemplo-bucket
S3_KEY=
S3_SECRET=
```

4. Para rodar o servidor, execute:

```bash
docker compose up
```

5. Para rodar as migrations, execute com o servidor rodando em outro terminal:

```bash
npm run migration
# or
pnpm run migration
```

6. O servidor está rodando :)
