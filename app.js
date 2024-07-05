let mediaRecorder;
let audioChunks = [];

document.getElementById("startBtn").addEventListener("click", function () {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/m4a" });
        sendAudioToServer(audioBlob);
      });

      document.getElementById("stopBtn").disabled = false;
      document.getElementById("startBtn").disabled = true;
    })
    .catch((error) => console.error("Error accessing media devices.", error));
});

document.getElementById("stopBtn").addEventListener("click", function () {
  mediaRecorder.stop();
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
});

function sendAudioToServer(blob) {
  const formData = new FormData();
  formData.append("audio", blob, "output.m4a");

  fetch("10.50.10.129:3000/uploads", {
    // Replace 'https://your-server.com/upload' with your actual upload URL
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log("Success:", data))
    .catch((error) => console.error("Error:", error));
}
