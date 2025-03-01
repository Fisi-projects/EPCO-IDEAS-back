import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import solicitudRouter from './routes/solicitud';
import productoRouter from './routes/producto';
import 'dotenv/config'
import swaggerDocs from './utils/swagger';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/solicitudes', solicitudRouter);
app.use('/productos', productoRouter);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);

  swaggerDocs(app, PORT);
});
