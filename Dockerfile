FROM node:latest
LABEL authors="michael"
COPY . .
ENV PORT=3000
RUN npm install
CMD npm start