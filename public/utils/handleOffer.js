const handleOffer = (offer) => {
  if (!host) {
    rtcConnection = createPeerConnection(roomId);
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
