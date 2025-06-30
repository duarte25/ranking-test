FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# RUN npm run start

EXPOSE 3022

ENV PORT=3022

CMD ["npm", "start"]