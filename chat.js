const socket = io();

// Join room
function joinRoom() {
    const roomName = document.getElementById('roomName').value;
    const password = document.getElementById('roomPassword').value;
    socket.emit('joinRoom', { roomName, password });
}

// Listen for messages
socket.on('message', (message) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
});

// Send message
function sendMessage() {
    const roomName = document.getElementById('roomName').value;
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        socket.emit('chatMessage', { roomName, message });
        messageInput.value = '';
    }
}
