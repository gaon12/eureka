import yolov5
import easyocr
import numpy as np
import matplotlib.pyplot as plt
import os
import cv2

# YOLOv5 모델 로드
model = yolov5.load('keremberke/yolov5n-license-plate')
model.conf = 0.25
model.iou = 0.45
model.agnostic = False
model.multi_label = False
model.max_det = 1000

# easyocr Reader 초기화
reader = easyocr.Reader(['ko'])

# 'data' 폴더 내의 이미지 파일 읽기
image_paths = [os.path.join('data', filename) for filename in os.listdir('data') if filename.endswith('.jpg')]
images = [cv2.imread(path) for path in image_paths]

# 번호판 검출 및 글자 추출
for image_path, image in zip(image_paths, images):
    # 번호판 검출
    results = model(image, size=640)
    predictions = results.pred[0]
    boxes = predictions[:, :4]  # 번호판 영역

    # 번호판 영역 내의 글자 추출
    for box in boxes:
        license_plate = image[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
        result = reader.readtext(license_plate) # detail=1 by default

        # 결과 출력
        print(f"Image: {image_path}")
        print(f"License Plate Text: {' '.join([text for (_, text, _) in result])}")