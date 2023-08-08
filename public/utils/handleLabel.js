function handleLabel() {
  if (buddy === "")
    document.getElementById("label").textContent =
      "Share the roomId with your buddy!";
  else
    document.getElementById("label").textContent =
      "Share any file or send a message";
}
