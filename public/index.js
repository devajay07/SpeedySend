const socket = io();
const iceServers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};
let rtcConnection;
let host = true;
let roomId = "l";
let dataChannel;
let buddy = "";
let totalBytesToSend = 0;
let totalBytesReceived = 0;
let bytesSent = 0;
let bytesReceived = 0;

const generateUsername = () => {
  const adjectives = [
    "Happy",
    "Silly",
    "Curious",
    "Brave",
    "Clever",
    "Kind",
    "Cool",
    "Ninja",
    "Saiyan",
    "Wizard",
    "Cosmic",
    "Mystic",
    "Heroic",
    "Epic",
    "Legendary",
    "Daring",
    "Sneaky",
    "Spectacular",
    "Fantastic",
    "Super",
    "Magical",
    "Galactic",
    "Incredible",
    "Phantom",
    "Eternal",
  ];
  const nouns = [
    "Dog",
    "Cat",
    "Panda",
    "Tiger",
    "Elephant",
    "Kangaroo",
    "Dolphin",
    "Samurai",
    "Ninja",
    "Dragon",
    "Shinobi",
    "Jedi",
    "Sorcerer",
    "Wizard",
    "Champion",
    "Warrior",
    "Avenger",
    "Guardian",
    "Savior",
    "Legend",
    "Master",
    "Hero",
    "Villain",
    "Mystery",
    "Specter",
    "Phantom",
    "Unicorn",
    "Wanderer",
    "Pirate",
    "Cyborg",
    "Goddess",
    "Beast",
    "Alien",
    "Titan",
    "Vampire",
    "Mercenary",
    "Saiyan",
    "Hunter",
    "Sentinel",
    "Doctor",
    "Rebel",
    "Luminary",
    "Daredevil",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return [randomAdjective, randomNoun];
};

function sendMessage() {
  const message = "hii how are you"; // The message to send
  if (dataChannel.readyState === "open") {
    dataChannel.send(message);
    console.log("Sent message:", message); // Display the actual message variable
  } else {
    console.log("Data channel is not ready.");
  }
}

// Display the generated username on the page
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
peerProfile.style.display = "none";
peerProfileName.style.display = "none";
mainContainer.style.display = "none";
fileInput.style.display = "none";
thread.style.display = "none";
fileInformation.style.display = "none";
progressBar.style.width = "0px";

browseSpan.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  uploadFile();
});
// Event listener for the "joined" event
socket.on("created", (data) => {
  host = true;
});
socket.on("joined", (data) => {
  host = false;
  socket.emit("ready", roomId, username);
  buddy = data.firstUserUsername;
  handleLabel();
  updatePeerDetails();
});
// Event listener for the "full" event
socket.on("full", () => {
  console.log("Room is full.");
  // Handle room full scenario (e.g., show an error message)
});

const initiateCall = (username) => {
  buddy = username;
  handleLabel();
  updatePeerDetails();
  rtcConnection = createPeerConnection();
  rtcConnection
    .createOffer()
    .then((offer) => {
      rtcConnection.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleOffer = (offer) => {
  if (!host) {
    rtcConnection = createPeerConnection();
    rtcConnection.setRemoteDescription(offer);
    rtcConnection.ondatachannel = (event) => {
      const incomingDataChannel = event.channel;
      setDataChannelListeners(incomingDataChannel);
    };

    rtcConnection.createAnswer().then((answer) => {
      rtcConnection.setLocalDescription(answer);
      socket.emit("answer", answer, roomId);
    });
  }
};

const handleAnswer = (answer) => {
  rtcConnection.setRemoteDescription(answer).catch((err) => console.log(err));
};

const handleIceCandidate = (incoming) => {
  const candidate = new RTCIceCandidate(incoming);
  rtcConnection.addIceCandidate(candidate).catch((e) => console.log(e));
};

function createPeerConnection() {
  const connection = new RTCPeerConnection(iceServers);
  const dataChannelOptions = { ordered: true, maxRetransmits: 3 };

  dataChannel = connection.createDataChannel(
    "myDataChannel",
    dataChannelOptions
  );

  setDataChannelListeners(dataChannel);

  connection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate, roomId);
    }
  };
  connection.oniceconnectionstatechange = () => {
    if (connection.iceConnectionState === "disconnected") {
      console.log("disconnected");
    } else if (connection.iceConnectionState === "failed") {
      console.log("failed");
    }
  };
  return connection;
}

socket.on("ready", initiateCall);
socket.on("offer", handleOffer);
socket.on("answer", handleAnswer);
socket.on("ice-candidate", handleIceCandidate);

function joinRoom() {
  roomId = document.getElementById("roomIdInput").value.trim();

  if (roomId === "") {
    alert("Please enter a valid Room ID.");
    return;
  }

  socket.emit("join", { roomId, username });

  handleUi();

  // Add other event listeners here if needed
  // socket.on('leave',onPeerLeave);
}

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
    fileInformation.style.display = "block";
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
        if (fileName.length >= 10) {
          fileName = fileName.substr(0, 10);
          fileName = fileName + "....";
        }
        fileInformation.textContent = `Receiving: ${fileName}, Size: ${fileSize} bytes`;
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
        downloadLink.click();

        fileInformation.textContent = "Recieved";

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

function handleUi() {
  document.getElementById("roomIdInput").style.display = "none";
  document.getElementById("joinBtn").style.display = "none";
  document.getElementById("usernameLabel").textContent = username;
  userNameDisplay.style.color = "white";
  peerNameDisplay.style.color = "white";
  handleLabel();
  showConnectionAnimatiion();
}

function handleLabel() {
  if (buddy === "")
    document.getElementById("label").textContent = "Waiting for your buddy!🦉";
  else
    document.getElementById("label").textContent =
      "Share any file or send a message🍻";
}

function showConnectionAnimatiion() {
  const userProfileContainer = document.getElementById("userprofileContainer");
  const userDisplayNameContainer = document.getElementById(
    "usernamedisplayContainer"
  );

  userProfileContainer.classList.add("moveUserProfileContainer");
  userDisplayNameContainer.classList.add("moveuserNameDisplayContainer");
}

function updatePeerDetails() {
  peerProfileName.style.display = "block";
  peerProfile.style.display = "block";
  mainContainer.style.display = "block";
  thread.style.display = "block";
  peerProfile.textContent = getInitials(buddy);
  peerProfileName.textContent = buddy;
}

function getInitials(fullName) {
  const firstLetter = fullName.charAt(0).toUpperCase();
  const lastLetterIndex = fullName.lastIndexOf(
    fullName
      .match(/[A-Z][a-z]+/g)
      .pop()
      .charAt(0)
  );
  const lastLetter = fullName.charAt(lastLetterIndex).toUpperCase();

  return firstLetter + lastLetter;
}

function uploadFile() {
  const file = fileInput.files[0];
  let fileName;
  fileInformation.style.display = "block";
  if (file.name.length >= 10) {
    fileName = file.name.substr(0, 10);
    fileName = fileName + "....";
  }
  fileInformation.textContent = `Sending: ${fileName}, Size: ${file.size} bytes`;
  const CHUNK_SIZE = 8 * 1024; // 16 KB chunk size (you can adjust this as needed)
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  totalBytesToSend = file.size; // Store the total bytes to send

  // Send the file information over the data channel
  dataChannel.send(
    JSON.stringify({
      type: "file-info",
      name: file.name,
      size: file.size,
      totalChunks,
      fileType: file.type,
    })
  );

  let offset = 0;

  // Read and send file chunks
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
        progressBar.style.width = "0%";
        fileInformation.textContent = "Completed";
      }
    };
    reader.readAsArrayBuffer(slice);
  };

  readSlice(file, offset);
}
