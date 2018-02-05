const PORT = process.env.PORT || 3000;

var io = require('socket.io')({origins : '*:*'});

var sockets = {};

function handler (socket) {
	console.log(socket.id + ' connected.');
  let id = socket.id;
  io.to(id).emit('restore', JSON.stringify(sockets));
  socket.on('message', function (msg) {
    let player = JSON.parse(msg);
    sockets[id] = player;
    player.id = id;
	  socket.broadcast.emit('message', JSON.stringify(player));
    console.log('message: ' + msg);
  });

  socket.on('disconnect', function () {
    console.log(id + ' disconnected.');
    delete sockets[id];
    io.sockets.emit('disconnect', id);
  });
}

console.log('Server now running at port ' + PORT);

io.on('connection', handler);

io.listen(PORT);

