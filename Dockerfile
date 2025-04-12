# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos de dependencias primero
COPY package*.json ./

# Instala dependencias dentro del contenedor (con binarios correctos)
RUN npm install

# Luego copiá el resto del proyecto
COPY . .

# Exponé el puerto usado por tu app
EXPOSE 8080

# Comando por defecto para iniciar la app
CMD ["npm", "start"]
