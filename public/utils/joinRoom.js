function joinRoom() {
  roomId = document.getElementById("roomIdInput").value.trim();

  if (roomId === "") {
    showErrorOrNot("Enter a valid room id");
  } else {
    socket.emit("join", { roomId, username });
  }

  // Add other event listeners here if needed
  // socket.on('leave',onPeerLeave);
}
