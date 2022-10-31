const socket = io('/')
const videoGrid = document.getElementById('videoGrid')
const myVideo = document.createElement('video')
myVideo.muted = true
const spanname = document.getElementById('spanname');
const spanclick = document.getElementById('spanclick');
const roomidh6 = document.getElementById('roomidh6');
var peer = new Peer()
let username;
const myPeer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',
	port: '3000',
})

function generate(n) {
    var add = 1, max = 12 - add;

    if ( n > max ) {
            return generate(max) + generate(n - max);
    }
    
    max        = Math.pow(10, n+add);
    var min    = max/10;
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add);
}

roomidh6.innerText = "Room ID: " + ROOM_ID;
localStorage.setItem("room-generated", ROOM_ID)
spanname.innerText = `Your Username is: ${localStorage.getItem("name")}`
spanclick.onclick = function() {
	copytext(localStorage.getItem("name"))
}

function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
	  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
  }
  var token1 = btoa(localStorage.getItem("name"));
  var token2 = btoa(localStorage.getItem("name-uid"));
  var token3 = btoa(`${generate(16)}`);
  var tokenfull = token1 + "." + token2 + "." + token3;
  localStorage.setItem("Token (DONT SHARE!!)", tokenfull)

if(!localStorage.getItem("name-uid")) {
   localStorage.setItem("name-uid", uuidv4());
   username = localStorage.getItem("name-uid")
} else {
	username = localStorage.getItem("name-uid");
}


function discord() {
	window.open("https://discord.gg/MuSRNNARc3", "Join the official discord!", 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=597,height=743,left = 390,top = 50')
}

const peers = {}
let myVideoStream
navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream, name) => {
		myVideoStream = stream
		addVideoStream(myVideo, stream)

		socket.on('user-connected', (userId) => {
			connectToNewUser(userId, stream)
			alert('Your friend has connected.', localStorage.getItem("name"))
		})

		peer.on('call', (call) => {
			call.answer(stream)
			const video = document.createElement('video')
			call.on('stream', (userVideoStream) => {
				addVideoStream(video, userVideoStream)
			})
		})

		let text = $('input')

		$('html').keydown(function (e) {
			if (e.which == 13 && text.val().length !== 0) {
				socket.emit('message', text.val())
				text.val('')
			}
		})

		socket.on('createMessage', (message, userId) => {
			$('ul').append(`<li >
								<span class="messageHeader">
									<span>
										From 
										<span class="messageSender">${localStorage.getItem("name")} | Uuid: ${localStorage.getItem("name-uid")}</span>
										to 
										<span class="messageReceiver">Everyone:</span>
									</span>

									${new Date().toLocaleString('es-ES', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</span>

								<span class="message">${message}</span>
							
							</li>`)
			scrollToBottom()
		})
	})

socket.on('user-disconnected', (userId) => {
	if (peers[userId]) peers[userId].close()
	alert('Say Goodbye to your friend.', localStorage.getItem("name"))
})

peer.on('open', (id) => {
	socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream)
	const video = document.createElement('video')
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream)
	})
	call.on('close', () => {
		video.remove()
	})

	peers[userId] = call
}

const addVideoStream = (video, stream) => {
	//document.querySelector('video').innerHTML += `<span style="color: white; position: absolute; font-size: 50px; top: 225px;">${localStorage.getItem("name")}</span>`
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videoGrid.append(video);
}

const scrollToBottom = () => {
	var d = $('.mainChatWindow')
	d.scrollTop(d.prop('scrollHeight'))
}

const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false
		setUnmuteButton()
	} else {
		setMuteButton()
		myVideoStream.getAudioTracks()[0].enabled = true
	}
}

function sharelink() {
	var inputc = document.body.appendChild(document.createElement("input"));
		 inputc.value = window.location.href;
		 inputc.focus();
		 inputc.select();
		 document.execCommand("copy");
		 inputc.parentNode.removeChild(inputc);
		 alert("Page URL Copied to Clipboard!");
 }

 function copytext(text) {
	var inputc = document.body.appendChild(document.createElement("input"));
		 inputc.value = text;
		 inputc.focus();
		 inputc.select();
		 document.execCommand("copy");
		 inputc.parentNode.removeChild(inputc);
		 alert("Text Copied to Clipboard!");
 }
const setMuteButton = () => {
	const html = `
	  <i class="fas fa-microphone"></i>
	  <span>Mute</span>
	`
	document.querySelector('.mainMuteButton').innerHTML = html
}

const setUnmuteButton = () => {
	const html = `
	  <i class="unmute fas fa-microphone-slash"></i>
	  <span>Unmute</span>
	`
	//const muteicon = `<i class="unmute fas fa-microphone-slash"></i>`
	document.querySelector('.mainMuteButton').innerHTML = html
	//document.getElementById("mainVideos").innerHTML += muteicon;
}

const playStop = () => {
	console.log('object')
	let enabled = myVideoStream.getVideoTracks()[0].enabled
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false
		setPlayVideo()
	} else {
		setStopVideo()
		myVideoStream.getVideoTracks()[0].enabled = true
	}
}

const setStopVideo = () => {
	const html = `
	  <i class="fas fa-video"></i>
	  <span>Stop Video</span>
	`
	document.querySelector('.mainVideoButton').innerHTML = html
}

const setPlayVideo = () => {
	const html = `
	<i class="stop fas fa-video-slash"></i>
	  <span>Play Video</span>
	`
	document.querySelector('.mainVideoButton').innerHTML = html
}
