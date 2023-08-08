function updatePeerDetails() {
  peerProfileName.style.display = "block";
  peerProfile.style.display = "block";
  mainContainer.style.display = "block";
  thread.style.display = "block";
  peerProfile.textContent = getInitials(buddy);
  peerProfileName.textContent = buddy;
}
