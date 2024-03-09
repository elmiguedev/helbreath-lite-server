FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

ENV PORT=6699
EXPOSE 6699

CMD ["npm", "run", "start"]