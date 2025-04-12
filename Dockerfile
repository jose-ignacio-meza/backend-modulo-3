# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos de dependencias primero
COPY package*.json ./

# Instala las dependencias DENTRO del contenedor (sin heredar binarios de tu máquina)
RUN npm install

# Luego copia el resto del proyecto
COPY . .

# Expone el puerto (ajustalo según el que uses)
EXPOSE 8080

# Comando por defecto al iniciar el contenedor
CMD ["npm", "start"]