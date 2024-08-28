const express = require("express");
const db = require("./Database/db");
const app = express();
const config = require("./config");
const bodyParser = require("body-parser");
const cors = require("cors");
const checkToken = require("./Middlewares/signInCheck");
const Game = require("./RSCOM/Game");
const MacroController = require("./Controllers/macroController");
const handleScoring = require("./RSCOM/scoringHandler");
const cronJobs = require('./Cronjob/Cron_index');
const QRCode = require('qrcode');
const moment = require('moment');

const User = require('./Models/userModel');
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json({ limit: '800mb' }));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

app.listen(config.portAPI, () => {
    console.log(`API Server started on ${config.ip}:${config.portAPI}`);
});

const webSocketSetup = require("./Sockets/Websocket.js");
webSocketSetup(app);
const unixSocketSetup = require("./Sockets/Unixsocket.js");
unixSocketSetup.startServer();

const { SerialPortConnection, sharedEmitter } = require("./RSCOM/SerialPorts/SerialPortConnection");
const sp = new SerialPortConnection();

sp.StartReading();
sharedEmitter.on("data", (data) => {
    Game.update(data);
});

cronJobs.startAllJobs();

let previousScoring = 0;
let previousMacrosDataMode = null;
let mode = 0;

sharedEmitter.on("scoring", handleScoring);

sharedEmitter.on("media", (media) => {
    unixSocketSetup.sendMedia(media);
});



let today = moment().format("YYYY-MM-DD");


let todayMoment = moment(today, "YYYY-MM-DD");
let targetDateMoment = moment(/*par ex*/"2024-08-27" /* <== La valeur de last updated */, "YYYY-MM-DD");



// Calculate the difference in days
let result = targetDateMoment.diff(todayMoment, 'days');

if (result > 0) {
    // Opération d'incrément 
    // Enregistrement dans base de données
    // Mise à jour de last updated
}

console.log(result);


const authRoutes = require("./Routes/authRoutes");
const activeSessionsRoutes = require("./Routes/activeSessionsRoutes");
const userRoutes = require("./Routes/userRoutes");
const spaceRoutes = require("./Routes/spaceRoutes");
const modeRoutes = require("./Routes/modeRoutes");
const dateRoutes = require("./Routes/dateRoutes");
app.get('/api/dates', (req, res) => {
    const serverDate = new Date();
    res.json({ date: serverDate });
  });

app.get("/qrcode", async (req, res) => {
    try {
        const ssid = process.env.SSID;
        const password = process.env.PASSWORD;
        const authType = process.env.AUTH_TYPE;

        const qrCode = `WIFI:T:${authType};S:${ssid};P:${password};;`;
        const qrImage = await QRCode.toDataURL(qrCode);

        res.send(`
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="${qrImage}" alt="QR Code" />
            </div>
        `);
    }
    catch (error) {
        console.error("Error while generating QR Code:", error.message);
        res.status(500).send("Error while generating QR Code");
    }
});

app.get('/api/server-time', (req, res) => {
    res.json({ serverTime: new Date().toISOString() });
  });
  
app.use("/activeSessions", activeSessionsRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/mode", modeRoutes);
app.use("/space", spaceRoutes);


app.use(checkToken);


const scoringRoutes = require("./Routes/scoringRoutes");
const mediaRoutes = require("./Routes/mediaRoutes");
const eventmediaRoutes = require("./Routes/eventmediaRoutes");
const eventRoutes = require("./Routes/eventRoutes");
const macroRoutes = require("./Routes/macroRoutes");
const buttonRoutes = require("./Routes/buttonRoutes");
const paramRoutes = require("./Routes/paramRoutes");
const veilleRoutes = require("./Routes/veilleRoutes");

const adminRoutes = require("./Routes/adminRoutes");

app.use("/scores", scoringRoutes);

app.use("/medias", mediaRoutes);
app.use("/events", eventRoutes);
app.use("/eventmedias", eventmediaRoutes);
app.use("/macros", macroRoutes);
app.use("/buttons", buttonRoutes);
app.use("/params", paramRoutes);
app.use("/veilles", veilleRoutes);

app.use("/admin", adminRoutes);


User.getInstance().createTable();



app.get("/", (req, res) => {
    res.send(`Le serveur fonctionne sur le port ${config.portAPI}`);
});


module.exports = app;
