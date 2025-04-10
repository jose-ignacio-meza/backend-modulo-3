import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json' assert { type: 'json' };


dotenv.config();
const app = express();
const PORT = process.env.PORT||8080;

app.use(express.json());
app.use(cookieParser());

const connection = mongoose.connect(process.env.MOGNO_URL, {
}).then(() => {
    console.log('Conectado a la base de datos pets');
}).catch((err) => {
    console.error('Error al conectar con la base de datos pets', err);
});

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connection;
app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
