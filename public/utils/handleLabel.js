function handleLabel() {
  if (buddy === "")
    document.getElementById("label").textContent = "Waiting for your buddy!🦉";
  else
    document.getElementById("label").textContent =
      "Share any file or send a message🍻";
}
