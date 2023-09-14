FROM node

WORKDIR /usr/local/app

COPY . .

RUN npm i 

RUN npm i @prisma/client 

RUN npx prisma generate

RUN npm run build

CMD ["npm","run","start:prod"]
