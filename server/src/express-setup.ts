import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { prisma } from './lib/db.js';

const app = express();



app.use(cookieParser())
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());

app.use((req, _res, next)=>{
    console.log(req.path, req.body);
    
    next()
})


app.get('/test', async (_req, res) => {
    const users = await prisma.user.findMany()

    res.json(users)
})


//* I exported the app for testing vitest:
export default app
