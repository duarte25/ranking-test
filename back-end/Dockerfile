# Usa a imagem base do Node.js 23
FROM node:23

# Define o diretório de trabalho dentro do container
WORKDIR /node-app

# Instala dependências do sistema (git é útil pro Prisma, embora não estritamente necessário para deploy)
RUN apt-get update && apt-get install -y git

# Copia package.json e package-lock.json para instalar as dependências
# Isso aproveita o cache do Docker se as dependências não mudarem
COPY package.json package-lock.json ./
RUN npm ci

# Copia todo o código da aplicação (incluindo a pasta prisma/migrations)
COPY . .

# Gera o cliente Prisma (necessário para que o código do seu app funcione)
RUN npx prisma generate

# Constrói a aplicação Node.js (se você tiver um script de build, ex: TypeScript)
RUN npm run build

# Expõe a porta que a aplicação vai usar
EXPOSE 3020

# Define o comando para iniciar a aplicação
# Primeiro, aplica as migrações pendentes, e *só então* inicia o servidor Node.js.
# O '&&' garante que 'npm start' só será executado se 'npx prisma migrate deploy' for bem-sucedido.
CMD sh -c "npx prisma migrate deploy && npm start"
