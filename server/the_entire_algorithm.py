from flask import Flask, request, jsonify
from ultralytics import YOLOE
import numpy as np
import cv2
import torch
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = YOLOE("yoloe-11l-seg.pt")
names = ["bottle"]
model.set_classes(names, model.get_text_pe(names))


@app.route("/set", methods=["POST"])
def set():
    data = request.get_json()
    print(data.get('name'))
    names = [data.get('name')]
    model.set_classes(names, model.get_text_pe(names))
    return jsonify({"message": "YIPPEE"}), 200

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
                freeze_time = 1 - size_ratio ** (1/2)
                freeze_time = max(0.25, min(freeze_time, 1))
                beeps = int(1 // freeze_time)

                # Determine direction
                if center_x < screen_width / 5 * 2:
                    direction = "left"
                elif center_x > screen_width / 5 * 3:
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

    print(detections)
    return jsonify(detections)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
