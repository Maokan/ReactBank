#Image de base
FROM node:20-alpine

#info supplémentaire dans les métadata de l'image
LABEL maintainer="ceci est un dockerfille (j'crois)"

#Variables d’environnement
ENV NODE_ENV=production

#change sur le répertoire du projet
WORKDIR /app

# récupère les infos du projets
COPY react-bank/package.json ./

# installe NPM
RUN npm install

#récupère tous le code
COPY . .

# utilise le port 3000
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"] 