//引用函式庫,建立express instance
const express = require('express')
const app = express()
//create server
const http = require('http').Server(app)
//create WebSocket Server
const io = require('socket.io')(http)
//客戶端靜態資源
app.use('/style', express.static(__dirname + '/style'))
//建立root的回覆訊息，當app get到HTTP的request的時候，respond 在該js檔的絕對路徑的index.html!!!!
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))


//when a client connects,what we wanna do?
io.on('connection', (socket) => {
    socket.username = "anonymous"
    socket.on('message', (msg) => io.emit('message', {'user' : socket.username, 'message' : msg }))
    //監聽setUsername 的 join事件
    socket.on('join', (username) => {
        if (username != null) {
            socket.username = username
        }
        socket.broadcast.emit('message', { user: 'Server','message':socket.username + ' has joined the server!'})
    })
});

http.listen(3000, () => console.log("Listing on port 3000!"))