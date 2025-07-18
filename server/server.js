import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';


const app = express()

const port = process.env.PORT || 4000;

connectDB()
const allowedOrigins = ['http://localhost:5173']


app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowedOrigins,credentials:true}))


// APi end points 
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(port,() => console.log(`server started on port:${port}`))

// MONGODB_URL = "mongodb+srv://bonguchandu:Chandu123456@cluster0.su81k.mongodb.net"