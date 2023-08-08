let uploadSpeedInMbps;

function updateUploadSpeed() {
  const endTime = new Date().getTime();
  const timeTakenInMs = endTime - startTime;

  const uploadSpeedInbps = (bytesSent * 8) / (timeTakenInMs / 1000);

  // Convert upload speed to Mbps
  uploadSpeedInMbps = uploadSpeedInbps / 10000000;

  speedIndicator.textContent = `Upload Speed: ${uploadSpeedInMbps.toFixed(
    2
  )} Mbps`;
}
