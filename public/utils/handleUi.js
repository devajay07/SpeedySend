function handleUi() {
  document.getElementById("roomIdInput").style.display = "none";
  document.getElementById("joinBtn").style.display = "none";
  document.getElementById("usernameLabel").textContent = username;
  userNameDisplay.style.color = "white";
  peerNameDisplay.style.color = "white";
  handleLabel(roomId);
  showConnectionAnimatiion();
}
