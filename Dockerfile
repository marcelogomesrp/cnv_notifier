FROM node:14.13.1
WORKDIR /usr/src/cnv
COPY package*.json ./
COPY *.js ./
RUN npm install
CMD [ "npm", "run", "start" ]