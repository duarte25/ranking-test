FROM node:23

WORKDIR /node-app

RUN apt-get update 

# Copia os arquivos de configuração e dependências do Node.js
COPY package.json package-lock.json ./

# Instala as dependências do Node.js
RUN npm ci

# Copia o restante dos arquivos da aplicação para o diretório de trabalho
COPY . .

# Copia o arquivo de exemplo de ambiente para o arquivo de ambiente real
RUN cp .env.example .env

# Gera os clientes Prisma
RUN npx prisma generate

# Constrói a aplicação Node.js
RUN npm run build

# Expõe a porta em que a aplicação Node.js será executada
EXPOSE 3020

# Define o comando para iniciar a aplicação quando o contêiner for executado
CMD ["npm", "start"]
