const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async () => {
  let email = document.querySelector('input[name="email"]').value;
  const feedback = document.querySelector('textarea[name="feedback"]').value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (feedback !== "") {
    const response = await fetch("/submit-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the correct content type
      },
      body: JSON.stringify({ email, feedback }), // JSON.stringify the data
    });

    try {
      const responseData = await response.json(); // Parse the response JSON
      if (responseData.success) {
        alert("Feedback submitted successfully");
        window.location.href = "/feedback";
      } else {
        alert("Something went wrong with submitting feedback");
      }
    } catch (error) {
      alert("An error occurred while processing your request");
    }
  } else alert("Feedback cannot be blank");
});
