# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto (si tu app lo usa)
EXPOSE 8080

# Comando por defecto al iniciar el contenedor
CMD ["npm", "start"]