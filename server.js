const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const rooms = {}; // Store rooms with passwords and users

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room
    socket.on('joinRoom', ({ roomName, password }) => {
        if (rooms[roomName]) {
            // Room exists, check password
            if (rooms[roomName].password === password) {
                socket.join(roomName);
                rooms[roomName].users.push(socket.id);
                io.to(socket.id).emit('message', 'Welcome to the private room!');
            } else {
                io.to(socket.id).emit('message', 'Incorrect password.');
                return;
            }
        } else {
            // Create new room if it doesn't exist
            rooms[roomName] = { password, users: [socket.id] };
            socket.join(roomName);
            io.to(socket.id).emit('message', 'Room created and joined!');
        }

        io.to(roomName).emit('message', `User ${socket.id} joined ${roomName}`);
    });

    // Handle chat messages
    socket.on('chatMessage', ({ roomName, message }) => {
        io.to(roomName).emit('message', `${socket.id}: ${message}`);
    });

    // Disconnect user
    socket.on('disconnect', () => {
        for (const room in rooms) {
            const index = rooms[room].users.indexOf(socket.id);
            if (index !== -1) {
                rooms[room].users.splice(index, 1);
                if (rooms[room].users.length === 0) delete rooms[room];
                else io.to(room).emit('message', `User ${socket.id} left`);
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
