import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express();

dotenv.config()

app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))

const PORT = process.env.PORT
console.log(PORT)

app.listen(PORT, () => {
    console.log(`Server listerning on port ${process.env.PORT}`)
})