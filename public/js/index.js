const socket = io();

let rtcConnection;
let host = true;
let roomId = "l";
let buddy = "";
let totalBytesToSend = 0;
let totalBytesReceived = 0;
let bytesSent = 0;
let bytesReceived = 0;
let errorShowed = false;

// ............>>> UI Setup <<<<<<<...............

const a = generateUsername();
const username = `${a[0]}${a[1]}`;
document.getElementById("userprofile").textContent = `${a[0].at(0)}${a[1].at(
  0
)}`;
document.getElementById("username").textContent = username;
const peerProfile = document.getElementById("peerprofile");
const peerProfileName = document.getElementById("peernameDisplay");
const mainContainer = document.getElementById("maincontainer");
const browseSpan = document.querySelector(".browse-span");
const fileInput = document.querySelector("#file-input");
const progressBar = document.querySelector("#progressBar");
const thread = document.querySelector("#thread");
const userNameDisplay = document.querySelector("#usernameDisplay");
const peerNameDisplay = document.querySelector("#peernameDisplay");
const fileInformation = document.querySelector("#fileInfo");
const speedIndicator = document.querySelector("#speedIndicator");
const filesSentContainer = document.querySelector("#filesSent");
const recievedFilesContainer = document.querySelector("#recievedFiles");
const filesSentList = document.querySelector("#filesSentList");
const filesRecievedList = document.querySelector("#filesRecievedList");
const roomIdInputLabel = document.querySelector("#roomIdInputLabel");
const copyBtn = document.querySelector("#copy");
const roomIdInfoContainer = document.querySelector("#roomIdInfoContainer");
peerProfile.style.display = "none";
peerProfileName.style.display = "none";
mainContainer.style.display = "none";
fileInput.style.display = "none";
thread.style.display = "none";
fileInformation.style.display = "none";
speedIndicator.style.display = "none";
filesSent.style.display = "none";
recievedFiles.style.display = "none";
roomIdInfoContainer.style.display = "none";
progressBar.style.width = "0px";

browseSpan.addEventListener("click", () => {
  fileInput.click();
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(roomIdInputLabel.value);
  roomIdInfoContainer.removeChild(copyBtn);
  const tick = document.createElement("i");
  tick.classList.add("fa-solid");
  tick.classList.add("fa-check");
  tick.classList.add("fa-xl");
  roomIdInfoContainer.appendChild(tick);
});

fileInput.addEventListener("change", () => {
  uploadFile(0);
});
// Event listener for the "joined" event
socket.on("created", (data) => {
  host = true;
  roomIdInfoContainer.style.display = "flex";
  roomIdInputLabel.value = roomId;
  handleUi();
});
socket.on("joined", (data) => {
  host = false;
  socket.emit("ready", roomId, username);
  buddy = data.firstUserUsername;
  handleUi();
  handleLabel();
  updatePeerDetails();
});
// Event listener for the "full" event
socket.on("full", () => {
  console.log("Room is full.");
  showErrorOrNot("This room is currently full! Create one just for you🐶");
});

socket.on("ready", initiateCall);
socket.on("offer", handleOffer);
socket.on("answer", handleAnswer);
socket.on("ice-candidate", handleIceCandidate);
socket.on("peerLeave", handlePeerLeave);
socket.on("disconnect", () => handleSocketDisconnected);
socket.on("error", handleSocketError);

let startTime;
let bytesSend = 0;

function showErrorOrNot(message) {
  if (errorShowed) return;
  errorShowed = true;
  showError(message);
}

function handleDownloadClick(downloadLink) {
  downloadLink.click();
}

function isLargeDevice() {
  return window.matchMedia("(min-width: 768px)").matches;
}

// Function to handle the display of filesSentContainer based on the screen size
function updateFilesSentContainerDisplay() {
  if (isLargeDevice()) {
    filesSentContainer.style.display = "block";
  } else {
    filesSentContainer.style.display = "none";
  }
}
