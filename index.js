import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config()
const PORT = process.env.PORT

app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())


app.listen(PORT, () => {
    console.log(`Server listerning on port ${PORT}`)
})