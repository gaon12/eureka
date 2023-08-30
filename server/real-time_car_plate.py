import cv2
import requests
import tkinter as tk
from PIL import Image, ImageTk
from threading import Thread
import numpy as np
import time
import json
from tkinter import messagebox

def login(session):
    payload = {
        'dong': '123',
        'ho': '456',
        'pw': 'password'
    }
    response = session.post("http://test.com:3000/user/signin/", data=payload)
    if response.status_code == 200:
        return True
    else:
        return False

def capture_video(session):
    global frame_rate
    cap = cv2.VideoCapture(1)

    if not login(session):
        label.config(text="Login Failed")
        return

    while True:
        ret, frame = cap.read()

        if ret:
            _, buffer = cv2.imencode('.jpg', frame)
            img_bytes = buffer.tobytes()

            response = session.post("http://test.com:3000/car/info", files={"image": img_bytes})
            
            response_data = response.json()
            status = response_data.get('status', 'Unknown')

            if status == 200:
                messagebox.showinfo("Info", "차량 정보 조회 성공")
            elif status == 400:
                messagebox.showinfo("Error", "등록되지 않은 차량")

            print(f"Status: {status}")
            
            label.config(text=f"Status: {status}")

            img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            img_tk = ImageTk.PhotoImage(image=img)
            canvas.create_image(0, 0, anchor=tk.NW, image=img_tk)
            canvas.image = img_tk

            time.sleep(1 / frame_rate)

def update_frame_rate(val):
    global frame_rate
    frame_rate = int(val)

root = tk.Tk()
root.title("Real-Time Capture & Predict")

frame_rate = 30

canvas = tk.Canvas(root, width=640, height=480)
canvas.pack()

label = tk.Label(root, text="Status: N/A")
label.pack()

frame_rate_slider = tk.Scale(root, from_=1, to=60, orient=tk.HORIZONTAL, label="Frame Rate",
                             command=update_frame_rate)
frame_rate_slider.set(30)
frame_rate_slider.pack()

with requests.Session() as session:
    thread = Thread(target=capture_video, args=(session,))
    thread.daemon = True
    thread.start()

root.mainloop()
