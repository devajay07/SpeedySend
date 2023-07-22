const socket = io();

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

  return [randomAdjective,randomNoun];
};

// Display the generated username on the page
const a = generateUsername();
const username = `${a[0]}${a[1]}`;
document.getElementById("head").textContent = `${a[0].at(0)}${a[1].at(0)}`
document.getElementById("username").textContent = username;

  // Event listener for the "joined" event
  socket.on("joined", (data) => {
    console.log(`${data.username} joined room ${data.roomId}`);
    socket.emit("ready", data.roomId); // Trigger "ready" event after joining
  });


  // Event listener for the "full" event
  socket.on("full", () => {
    console.log("Room is full.");
    // Handle room full scenario (e.g., show an error message)
  });

  const initiateCall = ()=>{
    console.log('i am ready');
  }


function joinRoom() {
  const roomId = document.getElementById("roomIdInput").value.trim();

  if (roomId === "") {
    alert("Please enter a valid Room ID.");
    return;
  }

  socket.emit("join", { roomId, username });

  // Add other event listeners here if needed


  socket.on('ready',initiateCall);
  // socket.on('leave',onPeerLeave);

  // socket.on('offer',handleOffer);
  // socket.on('answer',handleAnswer);
  // socket.on('ice-candidate',handleIceCandidate);

}