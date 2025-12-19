# Base Image
FROM node:20-alpine

#supplementary informations for image's metadata
LABEL maintainer="ceci est un dockerfille (j'crois)"

# environement
ENV NODE_ENV=production

# switch to the project, repertory
WORKDIR /app

# get informations about the project
COPY react-bank/package.json ./

# install NPM
RUN npm install

# get all the project's files
COPY react-bank/ .

# use port 3000
EXPOSE 3000

# launch command
CMD ["npm", "start"] 