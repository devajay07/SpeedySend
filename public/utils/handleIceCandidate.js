const handleIceCandidate = (incoming) => {
  const candidate = new RTCIceCandidate(incoming);
  rtcConnection.addIceCandidate(candidate).catch((e) => console.log(e));
};
