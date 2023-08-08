const iceServers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};
let dataChannel;

function createPeerConnection(roomId) {
  const connection = new RTCPeerConnection(iceServers);
  const dataChannelOptions = { ordered: true, maxRetransmits: 3 };
  try {
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
        showErrorOrNot("Disconnected from your buddy, Retrying!!");
      } else if (connection.iceConnectionState === "failed") {
        showErrorOrNot("Session Failed!! Retry");
        console.log("failed");
      }
    };
    return connection;
  } catch (error) {
    console.log(error);
    showErrorOrNot("Error Connecting to Peer ! Try Again");
  }
}
