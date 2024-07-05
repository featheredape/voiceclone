let mediaRecorder;
let audioChunks = [];

document.getElementById("startBtn").addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/m4a' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = audioUrl;
                a.download = "output.m4a";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(audioUrl);
            });

            document.getElementById("stopBtn").disabled = false;
            document.getElementById("startBtn").disabled = true;
        })
        .catch(error => console.error('Error accessing media devices.', error));
});

document.getElementById("stopBtn").addEventListener("click", function() {
    mediaRecorder.stop();
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
});

