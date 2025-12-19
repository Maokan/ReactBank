FROM node:20-alpine #Image de base
LABEL maintainer="ceci est un dockerfille (j'crois)" #info supplémentaire dans les métadata de l'image
ENV NODE_ENV=production #Variables d’environnement
WORKDIR /app# 4. change sur le répertoire du projet
COPY react-bank/package.json ./# récupère les infos du projets
RUN npm install # installe NPM
COPY . .# 6. récupère tous le code
EXPOSE 3000 # utilise le port 3000
CMD ["npm", "start"] # Commande de démarrage