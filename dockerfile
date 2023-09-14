FROM node

WORKDIR /usr/local/app

COPY . .

RUN npm i 

RUN npm i @prisma/client 

RUN npx prisma migrate deploy

RUN npm run build

CMD ["npm","run","start:prod"]
