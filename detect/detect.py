import cv2
import paddleocr
from paddleocr import PaddleOCR, draw_ocr
import yolov5

# load model
model = yolov5.load('keremberke/yolov5n-license-plate')

# set model parameters
model.conf = 0.25  # NMS confidence threshold
model.iou = 0.45  # NMS IoU threshold
model.agnostic = False  # NMS class-agnostic
model.multi_label = False  # NMS multiple labels per box
model.max_det = 1000  # maximum number of detections per image

# set image
img_path = 'a.jpg'
img = cv2.imread(img_path)

# perform inference
results = model(img, size=640)

# inference with test time augmentation
results = model(img, augment=True)

# parse results
predictions = results.pred[0]
boxes = predictions[:, :4]  # x1, y1, x2, y2
scores = predictions[:, 4]
categories = predictions[:, 5]

# show detection bounding boxes on image
results.show()

# save results into "results/" folder
results.save(save_dir='results/')

# Initialize PaddleOCR
ocr = PaddleOCR(use_gpu=False, lang="korean")

# Loop over the bounding boxes of number plates
for box in boxes:
    # Crop the image to the specific detected box
    cropped_img = img[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
    # Use PaddleOCR to extract text
    result = ocr.ocr(cropped_img)
    # Print the result
    for line in result:
        line_text = ' '.join([word_info[1][0] for word_info in line])
        print(line_text)
