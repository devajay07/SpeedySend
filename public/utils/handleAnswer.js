const handleAnswer = (answer) => {
  rtcConnection.setRemoteDescription(answer).catch((err) => console.log(err));
};
