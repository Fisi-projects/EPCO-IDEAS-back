import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
