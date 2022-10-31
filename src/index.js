const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')
const messageRoute = require('./routes/messagesRoute')
const socket = require('socket.io')

const app = express()
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoute)
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') })
})
app.use(express.static('public'))

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log('connected to the db'),
)

const server = app.listen(process.env.PORT, () => console.log(`Server started on Port ${process.env.PORT}`))

const io = socket(server, {
  cors: {
    origin: 'https://chat-app-front-swart.vercel.app',
    credentials: true,
  },
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {
  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message)
    }
  })
})

module.exports = app
