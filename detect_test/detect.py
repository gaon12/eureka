import cv2
import paddleocr
import yolov5
import os
from paddleocr import PaddleOCR, draw_ocr

# load model
# model = yolov5.load('keremberke/yolov5n-license-plate')
model = yolov5.load('./best.pt')

# set model parameters
model.conf = 0.25  # NMS confidence threshold
model.iou = 0.45  # NMS IoU threshold
model.agnostic = False  # NMS class-agnostic
model.multi_label = False  # NMS multiple labels per box
model.max_det = 1000  # maximum number of detections per image

# set image
img_path = '0.jpg'
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

# Save results into "results/" folder
save_dir = 'results'

# Check if directory exists, if not, create it
if not os.path.exists(save_dir):
    os.makedirs(save_dir)

# Initialize image index
image_index = 0

# Save results, one image per detection
for pred in results.pred:
    for i, p in enumerate(pred):
        x1, y1, x2, y2 = p[:4]
        cropped_img = img[int(y1):int(y2), int(x1):int(x2)]

        file_path = os.path.join(save_dir, f'image_{image_index}.jpg')
        cv2.imwrite(file_path, cropped_img)
        image_index += 1

print(f"Saved results to {save_dir}")

# Initialize PaddleOCR
ocr = PaddleOCR(use_gpu=False, lang="korean")

def preprocess_image(img):
    # Convert image to grayscale
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to the image
    blur_img = cv2.GaussianBlur(gray_img, (3, 3), 0)
    
    # Apply adaptive thresholding to the image
    _, threshold_img = cv2.threshold(blur_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    return threshold_img

# Loop over the bounding boxes of number plates
for box in boxes:
    # Crop the image to the specific detected box
    cropped_img = img[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
    
    # Preprocess the cropped image
    preprocessed_img = preprocess_image(cropped_img)
    
    # Use PaddleOCR to extract text from the preprocessed image
    result = ocr.ocr(preprocessed_img)
    
    # Print the result
    for line in result:
        line_text = ' '.join([word_info[1][0] for word_info in line])
        print(line_text)
