FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    openssh-client

COPY package*.json ./
RUN npm install --production

COPY server.js ./
COPY engine/ ./engine/
COPY views/ ./views/
COPY public/ ./public/
COPY data/ ./data/
COPY uploads/ ./uploads/
COPY index.html.meta ./

EXPOSE 8080

CMD ["node", "server.js"]
