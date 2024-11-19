import express, { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import https from 'https'
import http from 'http'
import WebSocket from 'ws'
import fs from 'fs'
import fileUpload from 'express-fileupload'
import passport from 'passport'
import path from 'path'
import dotenv from 'dotenv'
import { CONFIG } from './app/config/config'
import appWss from './app/sockets'
import { db } from './app/models'
import dbConfig from './app/config/db.config'
import auth from './app/routes/auth.routes'
import swap from './app/routes/swap.routes'
import limitOrder from './app/routes/limit-order.routes'
import user from './app/routes/user.routes'
import appPassport from './app/middlewares/passport'
import * as infra from './app/infra-socket'

dotenv.config()

const app: Express = express()
appPassport(passport)
app.use(cors({}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload({ createParentPath: true }))
app.use(passport.initialize())
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

const httpsPort = CONFIG.port.https
const wssPort = CONFIG.port.wss
const privatekey = fs.readFileSync(CONFIG.sslPath.privatekey)
const certificate = fs.readFileSync(CONFIG.sslPath.certificate)
const credentials = {
    key: privatekey,
    cert: certificate
}

app.use((req, res, next) => {
    console.log('Request Type:', req.method);
    console.log('Time:', Date.now());
    next();
})
app.use("/api/auth", auth)
app.use("/api/swap", swap)
app.use("/api/user", user)
app.use("/api/limit-order", limitOrder)



// set port, listen for requests
app.listen(httpsPort, () => {
    console.log(`Server is running on port ${httpsPort}.`);
});

const server = http.createServer(app);
server.listen(wssPort, () => {
    console.log(`Server is running at port ${wssPort} as wss.`);
});

// https.createServer(credentials, app).listen(httpsPort, () => {
//     console.log(`Server is running at port ${httpsPort} as https.`);
// });

// const server = https.createServer(credentials, app);
// server.listen(wssPort, () => {
//     console.log(`Server is running at port ${wssPort} as wss.`);
// });


const wss = new WebSocket.Server({ server });
appWss(wss)

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit();
    });

infra.start()
