const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidV4} = require('uuid');

//setting up a view engine
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res)=>{
  res.render('room', {roomId: req.params.room});
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId)=> {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', ()=> {
      socket.to(roomId).broadcast.emit('user-disconned', userId);
    })
  })
})



server.listen(3000);
