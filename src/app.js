import express from 'express';
import chatRoute from './routes/chat.routes.js';
import messageRoute from './routes/message.routes.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { messageModel } from './models/chat.model.js';


const app = express();
const PORT = 3000;
const message = []

dotenv.config()
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hello World!")
})

app.use('/chat', chatRoute);
app.use('/message', messageRoute);


app.post('/socketMessage', (req,res)=>{
    const {message} = req.body 
    socketServer.emit('message', message)

    messageModel.create(message)
    res.send('ok')
})
//handlebars
app.engine('handlebars',engine());
app.set('view engine', 'handlebars');
app.set('views', './src/view');
app.use(express.static('public'));


mongoose.connect(
    `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@codercluster.fsti35d.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`,
    (error)=>{  error ? console.log(error) : console.log('mongodb is connected 🍃')}
)


const httpServer = app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT} 🚀`);
    console.log('Starting socket.io 🌐');
});


const socketServer = new Server(httpServer);

socketServer.on('connection', (socket)=>{
    console.log('New user connected 🧑‍💻')

    socket.on('new-user', (data)=>{
        socket.user = data.user
        socket.id = socket.id
        socketServer.emit('new-user-connected', {
            user: data.user,
            id: socket.id
        })
    })

    socket.on('message', (data) => {
        message.push(data)
        socketServer.emit('messageLogs', message)
        messageModel.create(message)
    })
})

