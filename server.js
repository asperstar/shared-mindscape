const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('newPlayer', (data) => {
    socket.broadcast.emit('newPlayer', { id: socket.id, x: data.x, y: data.y });
  });

  socket.on('playerMoved', (data) => {
    socket.broadcast.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
  });

  socket.on('newCharacter', (data) => {
    io.emit('newCharacter', data);
  });

  socket.on('chatMessage', (data) => {
    io.emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socket.broadcast.emit('playerDisconnected', { id: socket.id });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));