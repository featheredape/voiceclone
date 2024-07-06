document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const statusElement = document.getElementById('status');
    const audioPlayback = document.getElementById('audioPlayback');

    let mediaRecorder;
    let audioChunks = [];

    startButton.addEventListener('click', async () => {
        // Request access to the user's microphone
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;
                audioChunks = [];

                // Upload the audio file to the server
                const formData = new FormData();
                formData.append('audio_data', audioBlob, 'outaudio.webm');
                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        statusElement.innerText = 'File successfully saved';
                    } else {
                        statusElement.innerText = 'Failed to save file';
                    }
                } catch (err) {
                    console.error('Error uploading file: ', err);
                    statusElement.innerText = 'Error uploading file';
                }
            };

            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
            statusElement.innerText = 'Recording...';
        } catch (err) {
            console.error('Error accessing microphone: ', err);
            alert('Could not access your microphone. Please check your permissions and try again.');
        }
    });

    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
        statusElement.innerText = 'Recording stopped.';
    });
});
