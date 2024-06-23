FROM node:20

WORKDIR /app

COPY package*.json ./

# Instal dependencies according to the lockfile
RUN if [ ! -d "node_modules" ]; then \
            npm install --loglevel verbose; \
    fi

COPY prisma ./prisma

RUN npx prisma generate

RUN chown -R node:node node_modules/.prisma

COPY . .

EXPOSE 4000

FROM inter AS prod

CMD ["npm", "start"]

FROM inter AS dev

CMD ["npm", "run", "start.dev"]
