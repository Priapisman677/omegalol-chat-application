FROM node:20-bullseye
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 3001
# RUN npx prisma generate
# CMD sleep infinity 
