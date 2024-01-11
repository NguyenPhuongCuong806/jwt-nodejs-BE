import express from "express";
import configviewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initAPIRoutes from "./routes/api";
import bodyParser from 'body-parser';
import Connection from "./config/connectDB";
import configCors from './config/cors';
import cookieParser from 'cookie-parser';
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8081;

configviewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//config cookie parser
app.use(cookieParser())

configCors(app);

//test connection
Connection()

//test jwt
// createJWT()

//test verify
// let decodedData = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VvbmduZ3V5ZW4iLCJhZGRyZXNzIjoiVFBIQ00iLCJpYXQiOjE3MDI5MDU5NzJ9.A1CiG0wk5xa1oGz6mXZ3Iy4c5ttxmJSzjWLhfm9seB0")
// console.log(decodedData)

initWebRoutes(app);
initAPIRoutes(app);

app.use((req, res) => {
    return res.send('404 not found')
})

app.listen(PORT, () => {
    console.log('>>> JWT Backend is running on the port = ' + PORT);
})
