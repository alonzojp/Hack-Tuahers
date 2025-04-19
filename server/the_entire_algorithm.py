from flask import Flask, request, jsonify
from ultralytics import YOLOE
import numpy as np
import cv2
import torch
from PIL import Image
import io

app = Flask(__name__)

model = YOLOE("yoloe-11s-seg.pt")
names = ["person"]
model.set_classes(names, model.get_text_pe(names))

@app.route("/detect", methods=["POST"])
def detect():
    if "frame" not in request.files:
        return jsonify({"error": "No frame sent"}), 400

    # Read frame from request
    file = request.files["frame"]
    img_bytes = file.read()
    img_np = np.array(Image.open(io.BytesIO(img_bytes)).convert("RGB"))

    screen_height, screen_width, _ = img_np.shape

    results = model(img_np)

    detections = []
    for r in results:
        try:
            for box in r.boxes:
                conf = float(box.conf.item())
                cls = int(box.cls.item())
                label = model.model.names[cls]
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

                width = x2 - x1
                height = y2 - y1
                center_x = x1 + width / 2

                size_ratio = max(width / screen_width, height / screen_height)
                freeze_time = 1 - size_ratio ** (1/3)
                freeze_time = max(0.25, min(freeze_time, 1))
                beeps = int(1 // freeze_time)

                # Determine direction
                if center_x < screen_width / 3:
                    direction = "left"
                elif center_x > screen_width * 2 / 3:
                    direction = "right"
                else:
                    direction = "center"

                detections.append({
                    "label": label,
                    "confidence": round(conf, 4),
                    "bbox": [x1, y1, x2, y2],
                    "direction": direction,
                    "beeps": beeps
                })
        except Exception as e:
            print("Error in detection:", e)

    return jsonify(detections)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
