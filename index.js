const { resolveObjectURL } = require('buffer')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
	debug: true,
})
//	const { v4: uuidv4 } = require('uuid')

app.use('/peerjs', peerServer)
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render("index")
})

//app.use(express.json());

app.get('/room/:room', (req, res) => {
	//	res.render('room', { roomId: req.params.room })
	if(req.params.room.length > 16) {
		res.send("Invalid room id. Room id need to have 16 characters")
	}
	if(req.params.room.length < 16) {
		res.send("Invalid room id. Room id need to have 16 characters")
	}
})
app.get('/:room', (req, res) => {
	if(req.params.room.length > 16) {
		res.send("Invalid room id. Room id need to have 16 characters")
	} else if(req.params.room === "api") {
		return res.send({title: "Live api!", message: "The api is working properly!",})
	}
	if(req.params.room.length < 16) {
		res.send("Invalid room id. Room id need to have 16 characters")
	}
	if(req.params.room.length === 16) {
		res.render('room', { roomId: req.params.room })
	}
})

app.get('/api/serverlive', (req, res) => {
    return res.status(200).json({
		title: "Live Server!",
		message: "Server is currently live!",
	  });
})


io.on('connection', (socket) => {
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.to(roomId).broadcast.emit('user-connected', userId)

		socket.on('message', (message) => {
			io.to(roomId).emit('createMessage', message, userId)
		})
		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId)
		})
	})
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
