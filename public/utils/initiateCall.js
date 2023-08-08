const initiateCall = (username) => {
  buddy = username;
  handleLabel();
  updatePeerDetails();
  rtcConnection = createPeerConnection(roomId);
  rtcConnection.ondatachannel = (event) => {
    const incomingDataChannel = event.channel;
    setDataChannelListeners(incomingDataChannel);
  };
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
