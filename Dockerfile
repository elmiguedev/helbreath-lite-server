FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

EXPOSE 3000

CMD ["npm", "run", "start"]