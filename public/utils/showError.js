function showError(message) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  const removeBtn = document.createElement("button");
  toast.classList.add("toast");
  removeBtn.classList.add("toastBtn");
  toast.textContent = message;
  removeBtn.textContent = "X";
  removeBtn.addEventListener("click", () => {
    toast.remove();
    removeBtn.remove();
    errorShowed = false;
  });

  toastContainer.appendChild(toast);
  toastContainer.appendChild(removeBtn);
}
