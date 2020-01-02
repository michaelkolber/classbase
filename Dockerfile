
FROM node:12.13.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . ./
# Compile the source
RUN npx tsc

# The API defaults to port 1900
EXPOSE 1900

CMD [ "node", "build/server.js" ]
