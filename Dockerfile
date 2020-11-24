FROM node:14-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY src/ src/

RUN	npm install \
  && npm run lint
RUN	npm prune --production

EXPOSE 9001

CMD ["npm", "start"]