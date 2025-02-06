import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
