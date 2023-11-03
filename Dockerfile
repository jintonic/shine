# https://github.com/nodejs/docker-node
FROM node
EXPOSE 5173
# https://stackoverflow.com/a/65443098
WORKDIR /home/node/app
# https://threejs.org/docs/#manual/en/introduction/Installation
RUN npm install --save three && npm install --save-dev vite
