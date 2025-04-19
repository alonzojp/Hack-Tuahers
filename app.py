from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
from ultralytics import YOLO
import magic

app = Flask(__name__)
CORS(app)

# Allowed MIME types
ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

def allowed_file(image_bytes):
    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(image_bytes[:1024])
    return mime_type in ALLOWED_MIME_TYPES

# Load the YOLOv8 model 
model = YOLO("yolov8s.pt")

@app.route('/detect', methods=['POST'])
def detect():
    if 'frame' not in request.files:
        return jsonify({"error": "No frame uploaded"}), 400

    file = request.files['frame']
    image_bytes = file.read()
    # Check file size
    if len(image_bytes) > MAX_IMAGE_SIZE:
        return jsonify({'error': 'File too large!'}), 413
    # Check MIME type
    if not allowed_file(image_bytes):
        return jsonify({'error': 'Invalid file type. Only images are allowed.'}), 400
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    results = model(image)

    detections = []
    # get bounding box coordinates
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            detections.append({
                "x1": int(x1),
                "y1": int(y1),
                "x2": int(x2),
                "y2": int(y2),
                "confidence": round(conf, 4),
                "class": label
            })

    return jsonify(detections)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
