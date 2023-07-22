function getQueryParameterByName(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Retrieve the socket ID from the URL query parameter
const socketId = getQueryParameterByName("socketId");
let remoteSocketId;

const socket = io(`?socketId=${socketId}`);
const waiting = document.getElementById('waiting');

const handleRoomJoin = ({ username, id }) => {
  console.log(`${username} joined with id ${id}`);
  remoteSocketId = id;
  waiting.textContent = `Connected with ${username}`;
};


socket.on("user:joined", handleRoomJoin);

