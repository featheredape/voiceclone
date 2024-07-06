            async function postAndPlayAudio() {
                const url = "http://10.50.10.129:58003/tts";
                //const url = "http://bff1-209-161-254-143.ngrok-free.app:58003/tts";
                const formData = new FormData();
                formData.append(
                    "text",
                    "Thank you for lending me your voice. Over time, I will start to sound more and more like you.",
                );
                //change stephen.m4a to outaudio.mp4
                formData.append(
                    "speaker_ref_path",
                    "https://bff1-209-161-254-143.ngrok-free.app/uploads/stephen.m4a",
                );
                formData.append("guidance", "5.0");
                formData.append("top_p", "0.98");

                try {
                    const response = await fetch(url, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        );
                    }

                    const data = await response.blob();
                    const audioURL = URL.createObjectURL(data);
                    playAudio(audioURL);
                } catch (error) {
                    console.error("Error fetching or playing audio:", error);
                }
            }

            function playAudio(audioURL) {
                const audio = new Audio(audioURL);
                audio
                    .play()
                    .catch((e) => console.error("Error playing audio:", e));
            }

            document
                .getElementById("playButton")
                .addEventListener("click", function () {
                    postAndPlayAudio();
                });
