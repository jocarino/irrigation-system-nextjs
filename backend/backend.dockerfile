FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

RUN chown -R node:node node_modules/.prisma

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start.dev"]
