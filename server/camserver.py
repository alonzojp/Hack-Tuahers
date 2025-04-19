import cv2
from flask import Flask, Response, render_template

app = Flask(__name__)
cam = cv2.VideoCapture(0)

@app.route("/")
def rendercam():
    return render_template('rendercam.html')

def get_frames():
    while True:
    # Capture frame-by-frame
        returned, frame = cam.read()
        
        if not returned:
            break
        else:
            # Display the resulting frame
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield(b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cam.release()
    cv2.destroyAllWindows()
    
@app.route('/video')
def video():
    return Response(get_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run()