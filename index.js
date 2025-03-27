const express = require('express')
const path = require('path')
const http = require('http')
const socketio= require('socket.io')
const formatMessage = require('./utils/messages')
const {getCurrentUser, userJoin, userLeave, getRoomUsers} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const PORT = 3000 || process.env.PORT
const io= socketio(server)

const botName= 'ChatCord bot';
app.use(express.static(path.join(__dirname,'public')))


// run when client connrects
io.on('connection', socket =>{
    //console.log("new ws connection !!!!!");
       socket.on('joinRoom', ({username, room})=>{
        const user = userJoin( socket.id, username, room)
        socket.join(user.room)
    //welcome current user
    socket.emit('message',formatMessage('botName',`welcome to chatify ${user.username} !`)); // single client that's connecting
    // io.emit() all the cleints in general

    // broadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit('message',formatMessage('botName',` ${user.username}  has joined the chat`)); // everybody but the user


    //send users and room info to frontend
    io.to(user.room).emit('roomUsers',{
    room : user.room,
    users: getRoomUsers(user.room)

    })
       })
   
 
   //listen for chatMessage
   socket.on('chatMessage',(msg)=>{
    const user = getCurrentUser(socket.id);
    io.to(user.room)
    .emit('message', formatMessage(user.username,msg))
   })
      // runs when clients disconnects
   socket.on('disconnect', ()=>{
    const user = userLeave(socket.id);
    if(user){
  io.to(user.room)
  .emit('message',formatMessage('botName', `${user.username}  user has left the chat`)
);
  io.to(user.room)
  .emit('roomUsers',{
    room : user.room,
    users: getRoomUsers(user.room)

    })

    }
   
   });

})
server.listen(PORT,()=>{
    console.log(`the server has started at port : ${PORT}`)
})