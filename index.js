const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')

const MessageSchema = require("./MessageSchema")
const mongoose = require('mongoose')

const io = new Server(server)

// Connect DB
mongoose.connect('mongodb+srv://phutuan:1234@cluster0.u0olj5k.mongodb.net/test',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log("connect DB successfull"))
.catch((err)=>console.log(err));
///
app.use(express.json());
// Post
app.post('/', async (req, res) => {
    const newMessage = new MessageSchema(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
      } catch (err) {
        res.status(500).json(err);
      }
    //   io.emit('on-chat', {
    //     message: req.body
    // })
    // io.on('connection', (socket) => {
    //     socket.on('on-chat', data => {
    //         io.emit('user-chat', data)
    //     })
    // })
})

app.get('/chat', async (req, res) =>{
//     res.sendFile(__dirname+'/index.html')
    try {
        const Message=await MessageSchema.find();
        res.status(200).json(Message)
    }
    catch(e){
        res.status(500).json(e)
    }
})

io.on('connection', (socket) => {
    console.log('connected')
    socket.on('on-chat', data => {
        io.emit('user-chat', data)
    })
})

server.listen(process.env.PORT, () => {
    console.log('listening on port 2999')
})
