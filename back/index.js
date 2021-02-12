const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./config/db')
app.db = db

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(require('./src/routes'))

const http = require('http');
import WatchJS from 'melanke-watchjs'
const watch = WatchJS.watch;
const Sessions = require('./src/sessions')

const cron = require('node-cron');
import { loopBot } from './src/bot/cron'

const task = cron.schedule('*/30 * * * * *', () =>  {
    console.log('rodou task');
    loopBot();
    }, {
    scheduled: false
});
task.start();
import { saveNewUser, existUser } from './src/user/functions.js';

require('dotenv').config({  
    path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
  })
console.log(process.env.DB_HOST)
// let server
// if (process.env.HTTP == 1) { //with ssl
const server = http.createServer(app);
// console.log("Https server running on port " + process.env.HOST_PORT);
// } else { //http
//     server = app.listen(process.env.HOST_PORT, () => {
//         console.log("Http server running on port " + process.env.HOST_PORT);
//     });
// }//http

const io = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
server.listen(3000, "0.0.0.0", () => {
    const host = server.address().address
    const port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})
io.on('connection', socket => {
console.log("ouviu")

socket.on("getSessions", (a, cb) => {
    const sessions = getSessions()
    cb({
        a,
        sessions
    })
})

socket.on("pingteste", (time, cb) => {
    console.log("time", time)
    cb({
        time,
        data: new Date()
    })
})

socket.on("startSession", (name, cb) => {
    startSession(name)
    cb({
        name
    })
})

socket.on("getStatus", async (name, cb) => {
    console.log("name: ", name)
    const state = await getStatus(name)
    // console.log("sate", state)

    cb({
        name: name,
        state: state
    })
})

socket.on("getQRCode", (name) => {
    getQRCode(name)
})

socket.on("close", (name) => {
    console.log(name)
    close(name)
})
socket.on("getQRCode", (name) => {
    getQRCode(name)
})

socket.on("close", (name) => {
    console.log(name)
    close(name)
})

socket.on("getAllContacts", async (name, cb) => {
    console.log(name)
    const contacts = await getAllContacts(name)
    cb({
        contacts
    })
})
socket.on("save", async (name, cb) => {
    delete name.session
    console.log(name)
    const result = await saveNewUser(app, name)
    console.log(result)
    cb({
        result
    })
})
socket.on("existUser", async (name, cb) => {
    delete name.session
    console.log(name)
    const result = await existUser(app, name.phone)
    console.log(result)
    cb({
        result
    })
})






const id = socket.id;
console.log(id)
});
function emitData (set, data){
  io.emit(set, data)
}
export async function emitFrontGlobal(set, data){ 
    io.emit(set, data)
}

function getStatus(sessionName) {
    return Sessions.getSession(sessionName).state
}
function getAllContacts(sessionName) {
    return Sessions.getAllContacts(sessionName)
}

function getSessions() {
    return Sessions.getSessions()
}

async function startSession (sessionName) {
    console.log("starting..." + sessionName);
    const session = await Sessions.start(app, sessionName);

    watch(session, "state", function(){
        emitData('setMessage', session.state)
        console.log("setMessage", session.state);
    });

    console.log(session)
    watch(session, "qrcode", function(){
        emitData('setQRCode', session.qrcode)
        console.log("setQRCode");
    });

    if (["CONNECTED", "QRCODE", "STARTING"].includes(session.state)) {
        emitData('setState', {message: session.state, result: 'success'})
    } else {
        emitData('setState', {message: session.state, result: 'error'})
    }
    task.start();
    //task do cron start
};//start


async function getQRCode (sessionName) {
    console.log("qrcode..." + sessionName);
    let session = Sessions.getSession(sessionName);
    if (session != false) {
        if (session.status != 'isLogged') {
            emitData('setState', { result: "success", message: session.state })
            emitData('setQRCode', { qrcode: session.qrcode })
        } else {
            emitData('setState', { result: "error", message: session.state })
        }
    } else {
        emitData('setState', { result: "error", message: "NOTFOUND" })
    }
};//qrcode

async function close (sessionName) {
    console.log(sessionName)
    const result = await Sessions.closeSession(sessionName);
    console.log(result)
    emitData('setState', { result: result.result, message: result.message })
};

export async function sendMsgBot(sessionName, number, text) {
    const result = await Sessions.sendText(
       sessionName,
       number,
       text
    );
    console.log(result);
    return result;
}
//sendText

// app.post("/sendFile", async (req, res, next) => {
//     const result = await Sessions.sendFile(
//        sessionName,
//         req.body.number,
//         req.body.base64Data,
//         req.body.fileName,
//         req.body.caption
//     );
//     res.json(result);
// });//sendFile

app.get("/close", async (req, res, next) => {
    task.destroy();
    //task do cron start
    const result = await Sessions.closeSession(req.query.sessionName);
    res.json(result);
});//close

process.stdin.resume();//so the program will not close instantly

async function exitHandler(options, exitCode) {
    task.destroy();

    if (options.cleanup) {
        console.log('cleanup');
        await Sessions.getSessions().forEach(async session => {
            await Sessions.closeSession(session.sessionName);
        });
    }
    if (exitCode || exitCode === 0) {
        console.log(exitCode);
    }

    if (options.exit) {
        process.exit();
    }
} //exitHandler 
//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
                                                                                 