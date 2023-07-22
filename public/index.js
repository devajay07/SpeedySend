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
document.getElementById("head").textContent = `${a[0].at(0)}${a[1].at(0)}`;
document.getElementById("username").textContent = username;

// Event listener for the "joined" event
socket.on("created", (data) => {
  console.log(`${data.username} joined room ${data.roomId}`);
  host = true;
});
socket.on("joined", (data) => {
  console.log(`${data.username} joined room ${data.roomId}`);
  host = false;
  socket.emit("ready", roomId);
});

// Event listener for the "full" event
socket.on("full", () => {
  console.log("Room is full.");
  // Handle room full scenario (e.g., show an error message)
});

const initiateCall = () => {
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

  // dataChannel.onopen = () => {
  //   console.log("Data channel opened");
  //   // You can start sending data through the data channel here
  // };

  // dataChannel.onmessage = (event) => {
  //   console.log("Received message:", event.data);
  // };

  // dataChannel.onclose = () => {
  //   console.log("Data channel closed");
  // };

  // dataChannel.onerror = (error) => {
  //   console.error("Data channel error:", error);
  // };

  connection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(event.candidate);
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

  // Add other event listeners here if needed
  // socket.on('leave',onPeerLeave);
}

function setDataChannelListeners(dataChannel) {
  dataChannel.onopen = () => {
    console.log("Data channel opened");
    // You can start sending data through the data channel here
  };

  dataChannel.onmessage = (event) => {
    console.log("Received message:", event.data);
  };

  dataChannel.onclose = () => {
    console.log("Data channel closed");
  };
}
