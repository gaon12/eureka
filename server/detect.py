import cv2
import os
from paddleocr import PaddleOCR
import yolov5
import easyocr
import pytesseract


class LicensePlateRecognizer:
    def __init__(self, model_path='Model/best.pt', conf_threshold=0.25, iou_threshold=0.45, save_dir='results',  language='ko'):
        self.model = yolov5.load(model_path)
        self.model.conf = conf_threshold
        self.model.iou = iou_threshold
        self.model.agnostic = False
        self.model.multi_label = False
        self.model.max_det = 1000
        self.reader = easyocr.Reader([language])

    def recognize_license_plates(self, img_path):
        img = cv2.imread(img_path)
        results = self.model(img, size=640)

        license_plate_images = []  # 번호판 이미지들을 저장할 리스트

        for pred in results.pred:
            for i, p in enumerate(pred):
                x1, y1, x2, y2 = p[:4]
                cropped_img = img[int(y1):int(y2), int(x1):int(x2)]
                license_plate_images.append(cropped_img)

        return license_plate_images

    def read_text(self, image):
        preprocessed_img = self._preprocess_image(image)
        ocr_result = self.reader.readtext(preprocessed_img)

        result_text = ""
        for detection in ocr_result:
            result_text += detection[1] + ' '

        return result_text.strip()

    @staticmethod
    def _preprocess_image(img):
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur_img = cv2.GaussianBlur(gray_img, (3, 3), 0)
        _, threshold_img = cv2.threshold(blur_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return threshold_img
