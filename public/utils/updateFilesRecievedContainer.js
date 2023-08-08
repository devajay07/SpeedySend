function updateFilesRecievedContainer(fileName, downloadLink) {
  const fileElement = document.createElement("li");
  fileElement.classList.add("fileElement");
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download";
  downloadBtn.classList.add("downloadBtn");
  downloadBtn.addEventListener("click", () =>
    handleDownloadClick(downloadLink)
  );
  fileElement.textContent = fileName;
  fileElement.appendChild(downloadBtn);
  filesRecievedList.appendChild(fileElement);
}
