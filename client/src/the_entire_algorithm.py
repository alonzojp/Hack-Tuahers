from ultralytics import YOLOE
import cv2
import torch
import time
import winsound
import mss
import numpy as np
import winsound

FREEZE_TIME = 1

# model = YOLO("yolov8m.pt")
model = YOLOE("yoloe-11s-seg.pt")
names = ["person"]
model.set_classes(names, model.get_text_pe(names))

print(model.model.names)

# Opens default webcam 
cap = cv2.VideoCapture(0)

winsound.Beep(1000, 500)  # 1000 Hz, 500 ms duration

# with mss.mss() as sct:
    # monitor = sct.monitors[1]  # Captures default screen
    # screen_width = monitor['width']
    # screen_height = monitor['height']
    # while True:
    #     # Creates screenshot
    #     screenshot = sct.grab(monitor)
        
    #     # Converts screenshot to opencv format
    #     img = np.array(screenshot)
    #     img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

    # UNCOMMENT FOR WEBCAM USE
while True:
    ret, img = cap.read()
    if not ret:
        break
    screen_width = img.shape[2]
    screen_height = img.shape[1]
    
    # Run YOLOE model
    results = model(img)
    for object_name in results: # different objects can be identified at once
        try:
            max_conf = max(torch.flatten(object_name.boxes.conf)) # only look at highest object
            for object in object_name.boxes: # find max object
                width = float(torch.flatten(object.xywh)[2])
                height = float(torch.flatten(object.xywh)[3])
                x_coord = float(torch.flatten(object.xywh)[0])

                if(object.conf.item() == max_conf.item()): # if max object found
                    print("Processing", object.conf.item())
                    print(width, height)
                    print(x_coord + width / 2)
                    # print(FREEZE_TIME, FREEZE_TIME / 2 * 1000)
                    # winsound.Beep(1000 * (1 - FREEZE_TIME), 250)  # 1000 Hz, 100 ms duration

                    # FREEZE_TIME = 1 - max(width / 480, height / 640) * 2.25
                    FREEZE_TIME = 1 - (max(width / screen_width,  height / screen_height)) ** (1/3)
                                            # (width * height / 480 / 640) * 5

                    # if(FREEZE_TIME >= 0.5):
                    #     FREEZE_TIME = 1
                    if(FREEZE_TIME <= 0.25):
                        FREEZE_TIME = 0.25

                    print("FREEZE TIME", FREEZE_TIME)

                    beeps = int(1 // FREEZE_TIME)
                    # if(beeps > 5):
                    #     beeps = 5
                    
                    print("BEEPS:", beeps)
                    print(x_coord + screen_width // 2)
                    for test in range(0, beeps):
                        print("*beep*")
                        # time.sleep(round(1 / beeps))
                        if(x_coord >= 1248):
                            winsound.Beep(1250, 250)  # object on right
                        elif(x_coord < 672):
                            winsound.Beep(750, 250)  # object on left
                        else:
                            winsound.Beep(1000, 250)  # object in the middle
                        # winsound.Beep(1500, 150)  # 1000 Hz, 100 ms duration
                    # else:
                    #     winsound.Beep(1000, 150)  # 1000 Hz, 100 ms duration
                    #     winsound.Beep(1000, 150)  # 1000 Hz, 100 ms duration
                    time.sleep(1 - beeps * .25)

                    print(width * height)
                    print("HIGHEST:", round(width * height / 480 / 640 * 100, 2))
                # print(round(width * height / 480 / 640 * 100, 2))
        except:
            time.sleep(FREEZE_TIME)
            print("Nothing Found")

    # Render results to frame
    annotated_frame = results[0].plot()

    # Display frame
    cv2.imshow("Blind", annotated_frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# Clean up
cap.release()
cv2.destroyAllWindows()
