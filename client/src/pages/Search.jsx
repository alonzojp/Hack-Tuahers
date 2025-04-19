import { useEffect, useRef } from "react";
import "../styles/pages/Search.css";
import { useLocation } from "react-router-dom";

const DETECT_URL = "https://8z24cqsd-5000.usw3.devtunnels.ms/detect";
const SET_URL = "https://8z24cqsd-5000.usw3.devtunnels.ms/set";


const Search = () => {
    const video = useRef(null);
    const overlay = useRef(null);
    const audioCtxRef = useRef(null);

    const location = useLocation();
    const { objectToFind } = location.state;

    useEffect(() => {
        const startCamera = async () => {

            const input_string = {name : objectToFind}

            const res = await fetch(SET_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input_string),
            });

            const output_message = await res.json();

            const constraints = {
                video: {
                    facingMode: { exact: "environment" }  // back camera
                }
            };
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (video.current) {
                    video.current.srcObject = stream;
    
                    return new Promise((resolve) => {
                        video.current.onloadedmetadata = () => resolve();
                    });
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        const sendFrame = async () => {
            if (!video.current || !overlay.current) return;

            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = video.current.videoWidth;
            tempCanvas.height = video.current.videoHeight;

            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.drawImage(video.current, 0, 0, tempCanvas.width, tempCanvas.height);

            const blob = await new Promise((resolve) =>
                tempCanvas.toBlob(resolve, "image/jpeg")
            );

            const formData = new FormData();
            formData.append("frame", blob, "frame.jpg");

            try {
                const res = await fetch(DETECT_URL, {
                    method: "POST",
                    body: formData,
                });

                const detections = await res.json();
                drawDetections(detections);
                if (detections.length > 0) {
                    const { direction, beeps } = detections[0]; // assuming one main detection
                    handleBeeps(direction, beeps);
                }
            } catch (error) {
                console.error("Detection error:", error);
            }
        };

        const drawDetections = (detections) => {
            const canvas = overlay.current;
            const ctx = canvas.getContext("2d");

            canvas.width = video.current.videoWidth;
            canvas.height = video.current.videoHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "lime";

            detections.forEach((det) => {
                const { x1, y1, x2, y2, class: label, confidence } = det;
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                ctx.fillText(`${label} (${(confidence * 100).toFixed(1)}%)`, x1 + 4, y1 + 16);
            });
        };

        const playBeep = (frequency = 1000, duration = 240) => {
            if (!audioCtxRef.current) return;

            const oscillator = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();
        
            oscillator.connect(gain);
            gain.connect(audioCtxRef.current.destination);
        
            oscillator.frequency.value = frequency;
            oscillator.type = "sine";
        
            // const now = audioCtxRef.current.currentTime;
            // const rampTime = 0.005; 

            // gainNode.gain.setValueAtTime(0, now);
            // gainNode.gain.linearRampToValueAtTime(1, now + rampTime);

            // gainNode.gain.linearRampToValueAtTime(0, now + (duration / 1000) - rampTime);

            oscillator.start();
            oscillator.stop(audioCtxRef.current.currentTime + duration / 1000);
        };

        const resumeAudio = () => {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
                console.log("AudioContext created.");
            } else if (audioCtxRef.current.state === "suspended") {
                audioCtxRef.current.resume().then(() => {
                    console.log("AudioContext resumed.");
                });
            }
            document.removeEventListener("click", resumeAudio);
        };

        document.addEventListener("click", resumeAudio);
        
        const handleBeeps = (direction, beeps) => {
            let freq;
            if (direction === "left") freq = 750;
            else if (direction === "right") freq = 1250;
            else freq = 1000;
            console.log(beeps);

            for (let i = 0; i < beeps; i++) {
                console.log("HELLO");
                // playBeep();
                setTimeout(() => playBeep(freq), i * 250);
            }
        };

        window.testBeep = () => {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            audioCtxRef.current.resume().then(() => {
                playBeep(1000);
            });
        };

        const mainLoop = async () => {
            await startCamera();
            setInterval(sendFrame, 1000);
            // sendFrame()
            // await new Promise(r => setTimeout(r, 5000));
        };

        mainLoop();
    }, []);

    return (
        <>
            <div className="search-container">
                <video ref={video} autoPlay playsInline muted />
                <canvas ref={overlay} />
            </div>
        </>
    );
};

export default Search;
