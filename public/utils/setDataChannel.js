function setDataChannelListeners(dataChannel) {
  dataChannel.onopen = () => {
    console.log("Data channel opened");
    // You can start sending data through the data channel here
  };

  let receivedChunks = [];
  let totalChunks;
  let fileType;
  let fileName;
  let fileSize;

  dataChannel.onmessage = (event) => {
    const data = event.data;
    thread.style.backgroundColor = "rgb(0, 106, 255)";
    progressBar.style.backgroundColor = "orange";
    if (isLargeDevice()) fileInformation.style.display = "block";
    // speedIndicator.style.display = "block";
    progressBar.style.width = "100%";

    // Check if the received data is a string (JSON)
    if (typeof data === "string") {
      const fileInfo = JSON.parse(data);

      if (fileInfo.type === "file-info") {
        const {
          name,
          size,
          totalChunks: receivedTotalChunks,
          fileType: receivedFileType,
        } = fileInfo;

        fileName = name;
        fileSize = size;
        totalChunks = receivedTotalChunks;
        fileType = receivedFileType;
        receivedChunks = [];
        if (fileName.length >= 20) {
          fileName = fileName.substr(0, 20);
          fileName = fileName + "....";
        }
        fileInformation.textContent = `Receiving: ${fileName}, Size: ${fileSize} bytes`;
        // speedIndicator.textContent = `Download Speed: ${uploadSpeedInMbps.toFixed(
        //   2
        // )} Mbps`;
      }
    } else {
      // Store the received chunk in the receivedChunks array
      receivedChunks.push(data);

      // Update the progress bar width
      const receivedPercentage = (receivedChunks.length / totalChunks) * 100;
      progressBar.style.width = `${100 - receivedPercentage}%`;

      // Check if all chunks have been received
      if (receivedChunks.length === totalChunks) {
        // Combine the received chunks into a Blob
        const fileBlob = new Blob(receivedChunks, { type: fileType });

        // Create a download link to download the received file
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(fileBlob);
        downloadLink.download = fileName;

        fileInformation.textContent = "Recieved";
        updateFilesSentContainerDisplay();
        recievedFilesContainer.style.display = "block";
        updateFilesRecievedContainer(fileName, downloadLink);

        // Clear the receivedChunks array for the next file
        receivedChunks = [];
        fileName = "";
        fileSize = 0;
        totalChunks = 0;
        fileType = "";

        // Reset the progress bar
        progressBar.style.width = "100%";
      }
    }
  };

  dataChannel.onclose = () => {
    console.log("Data channel closed");
  };
}
