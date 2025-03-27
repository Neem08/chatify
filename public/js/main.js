const chatForm = document.getElementById("chat-form")
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io()
const chatMessages = document.querySelector('.chat-messages')
//get username and room from url
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
})

// join chatroom
socket.emit('joinRoom', { username, room})

//get room and users
socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users);
})

// message from server
socket.on('message',message=>{
    outputMessage(message)

    //scrol down
     chatMessages.scrollTop = chatMessages.scrollHeight;
})

// message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault(); // prevent the default behaviour of form to submit in file

    // getting the message
    const msg = e.target.elements.msg.value;
    // emitting the message to server
    socket.emit('chatMessage',msg)

    // clear the text section after sending message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();



})

//output message to dom
function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}


// add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;

}

//add usersto DOM
function outputUsers(users){
  userList.innerHTML= `
  ${users.map(user=> `<li>${user.username}</li>`).join('')}
  `
}