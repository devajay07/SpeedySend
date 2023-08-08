function updateFilesSentContainer(fileName) {
  const fileElement = document.createElement("li");
  fileElement.classList.add("fileElement");
  fileElement.textContent = fileName;
  filesSentList.appendChild(fileElement);
}
