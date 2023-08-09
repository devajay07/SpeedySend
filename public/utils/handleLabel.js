function handleLabel() {
  if (buddy === "")
    document.getElementById("label").textContent = `share it with your buddy`;
  else {
    document.getElementById("label").textContent =
      "Share any file or send a message";
    roomIdInfoContainer.style.display = "none";
  }
}
