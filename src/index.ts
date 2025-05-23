import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import ClubRouter from './routes/club.routes'
import StudentRouter from './routes/student.routes'
import bodyParser from 'body-parser'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.DATABASE_URL

app.use(cors({
    origin: "*",
    credentials: true,
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/v1/clubs', ClubRouter)
app.use("/api/v1/students", StudentRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
//sam chakka