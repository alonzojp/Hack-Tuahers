import { useEffect, useRef } from "react";
import "../styles/pages/Search.css";

const DETECT_URL = "https://8z24cqsd-5000.usw3.devtunnels.ms/detect";

const Search = () => {
    const video = useRef(null);
    const overlay = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (video.current) {
                video.current.srcObject = stream;

                return new Promise((resolve) => {
                    video.current.onloadedmetadata = () => resolve();
                });
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

        const mainLoop = async () => {
            await startCamera();
            setInterval(sendFrame, 333);
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