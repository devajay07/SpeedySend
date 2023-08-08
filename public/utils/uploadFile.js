function uploadFile(index) {
  const file = fileInput.files[index];
  if (!file) {
    errorShowed = true;
    showErrorOrNot("No file selected for upload");
    return;
  }
  let fileName = file.name;
  if (isLargeDevice()) fileInformation.style.display = "block";
  speedIndicator.style.display = "block";
  if (file.name.length >= 20) {
    fileName = file.name.substr(0, 20);
    fileName = fileName + "...";
  }
  fileInformation.textContent = `Sending: ${fileName}, Size: ${file.size} bytes`;
  const CHUNK_SIZE = 8 * 1024; // 16 KB chunk size (you can adjust this as needed)
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  totalBytesToSend = file.size; // Store the total bytes to send

  // Send the file information over the data channel
  if (dataChannel.readyState === "open") {
    dataChannel.send(
      JSON.stringify({
        type: "file-info",
        name: file.name,
        size: file.size,
        totalChunks,
        fileType: file.type,
      })
    );
  } else {
    errorShowed = true;
    showErrorOrNot("Transfer Path is not ready");
  }
  let offset = 0;

  // Read and send file chunks
  startTime = new Date().getTime(); // Record the start time before sending the file
  const updateInterval = 500;
  setInterval(updateUploadSpeed, updateInterval);

  const readSlice = (file, offset) => {
    const slice = file.slice(offset, offset + CHUNK_SIZE);
    const reader = new FileReader();
    reader.onload = (event) => {
      dataChannel.send(event.target.result);
      offset += event.target.result.byteLength;
      bytesSent += event.target.result.byteLength; // Update the bytes sent
      const progress = (bytesSent / totalBytesToSend) * 100;
      progressBar.style.width = `${progress}%`; // Update the progress bar width
      if (offset < file.size) {
        readSlice(file, offset);
      } else {
        progressBar.style.width = "100%";
        fileInformation.textContent = "Completed";
        if (isLargeDevice()) recievedFilesContainer.style.display = "block";
        updateFilesSentContainer(fileName);
        speedIndicator.style.display = "none";
        updateFilesSentContainerDisplay();
        if (index < fileInput.files.length) {
          uploadFile(++index);
        }
      }
    };
    reader.readAsArrayBuffer(slice);
  };

  readSlice(file, offset);
}
