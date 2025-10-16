FROM node:20-alpine

# Ceci crée et définit /app comme répertoire de travail DANS le conteneur
WORKDIR /app

# Copie package*.json depuis votre dossier local vers /app dans le conteneur
COPY package*.json ./

# Installe les dépendances dans /app du conteneur
RUN npm install

# Copie tout votre code local vers /app dans le conteneur
COPY . .

# Build dans /app du conteneur
RUN npm run build

# Install serve globalement dans le conteneur
RUN npm install -g serve

EXPOSE 3000

# Lance serve depuis /app dans le conteneur
CMD ["serve", "-s", "dist", "-l", "3001"]