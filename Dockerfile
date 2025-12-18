# 1. Image de base
FROM node:20-alpine
# 2. Métadonnées (facultatif)
LABEL maintainer="ceci est un dockerfille (j'crois)"
# 3. Variables d’environnement
ENV NODE_ENV=production
# 4. Répertoire de travail
WORKDIR /app
# 5. Dépendances en premier (important pour le cache)
COPY react-bank/package.json ./
RUN npm install 
# 6. Copie du code
COPY . .
# 7. Exposition du port
EXPOSE 3000
# 8. Commande de démarrage
CMD ["npm", "start"]
 #pour lancer le serveur = "cd my-react-app" puis "npm run dev"