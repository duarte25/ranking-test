FROM node:23

WORKDIR /node-app

# Instala dependências do sistema (git é útil pro Prisma)
RUN apt-get update && apt-get install -y git

# Copia package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia todo o código da aplicação
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Constrói a aplicação Node.js
RUN npm run build

# Expõe a porta
EXPOSE 3020

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]