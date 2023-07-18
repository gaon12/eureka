import cv2
import os
from paddleocr import PaddleOCR
import yolov5


class LicensePlateRecognizer:
    def __init__(self, model_path='Model/best.pt', conf_threshold=0.25, iou_threshold=0.45, save_dir='results'):
        self.model = yolov5.load(model_path)
        self.model.conf = conf_threshold
        self.model.iou = iou_threshold
        self.model.agnostic = False
        self.model.multi_label = False
        self.model.max_det = 1000
        self.ocr = PaddleOCR(use_gpu=False, lang="korean")
        self.save_dir = save_dir

    def _preprocess_image(self, img):
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur_img = cv2.GaussianBlur(gray_img, (3, 3), 0)
        _, threshold_img = cv2.threshold(blur_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return threshold_img

    def recognize_license_plates(self, img_path):
        img = cv2.imread(img_path)
        results = self.model(img, size=640)
        image_index = 0

        if not os.path.exists(self.save_dir):
            os.makedirs(self.save_dir)

        result_text = ""
        for pred in results.pred:
            for i, p in enumerate(pred):
                x1, y1, x2, y2 = p[:4]
                cropped_img = img[int(y1):int(y2), int(x1):int(x2)]
                file_path = os.path.join(self.save_dir, f'image_{image_index}.jpg')
                cv2.imwrite(file_path, cropped_img)

                preprocessed_img = self._preprocess_image(cropped_img)
                ocr_result = self.ocr.ocr(preprocessed_img)
                for line in ocr_result:
                    line_text = ' '.join([word_info[1][0] for word_info in line])
                    result_text += line_text

                result_file_path = os.path.join(self.save_dir, f'image_{image_index}.txt')

                with open(result_file_path, 'w') as f:
                    f.write(result_text)

                image_index += 1

        return result_text
