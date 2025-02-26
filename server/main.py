from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import requests
from detect import LicensePlateRecognizer
import os
import json

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

app = Flask(__name__)
CORS(app)

# app.config[
#     'SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://guest1:0YYL!i[-}F)UTkt8G@apt-manager.mysql.database.azure.com/car'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db.init_app(app)

# Download Image -> AI Model Predict -> Delete Image
# POST /predict
# GET /predict -> delete request
# Request JSON
'''
    {
        "url" : "Image URL",
        "verify_code" : ""
    }
'''


# nodejs에 /car/info 요청 보내기
def send_request(data_to_send, retries=3, config_path='config.json'):
    with open(config_path, 'r') as config_file:
        config = json.load(config_file)

    nodejs_server_url = config.get('nodejs_car_info', '')

    for _ in range(retries):
        try:
            response = requests.post(nodejs_server_url, json=data_to_send)
            response_data = response.json()

            if response.status_code == 200:
                return response_data
        except requests.exceptions.RequestException:
            pass

    return None


# 파일 확장자 확인
def is_allowed_file(filename, allowed_extensions=None):
    if allowed_extensions is None:
        allowed_extensions = {'jpg', 'jpeg', 'png'}
    _, file_extension = os.path.splitext(filename)
    file_extension = file_extension.lower()
    return file_extension in allowed_extensions


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        # 파일 확장자 확인
        if is_allowed_file(file.filename):
            recognizer = LicensePlateRecognizer()
            license_plate_images = recognizer.recognize_license_plates(file)

            result = None  # 초기값 설정

            # 각 번호판 이미지의 텍스트 추출 및 출력
            for image in license_plate_images:
                result = recognizer.read_text(image)

            if result:
                # 한글 'ㅇ'을 숫자 '0'으로 변경
                result = result.replace('ㅇ', '0')

                if len(result) <= 5:
                    # 에러코드
                    response_data = {
                        "status": 400,
                        "error": {
                            "errorCode": "F401",
                            "message": "번호판 인식 실패"
                        }
                    }
                    return Response(json.dumps(response_data), status=400, mimetype='application/json')

                # 숫자만 있는 경우 마지막 숫자 4개를 뺀 나머지 숫자 중에 마지막 숫자가 '7'인 경우 '가'로 치환
                if result.isdigit() and len(result) >= 5 and result[-5] == '7':
                    result = result[:-5] + '가' + result[-4:]

                if result[-5] in '가나다라마거너더러머버서어저고노도로모보소오조구누두루무부수우주아바사자하허호배':
                    data_to_send = {
                        "car_number": result if result else ""
                    }

                    # send_request 함수를 통해 요청 보내고 결과 받기
                    response_data = send_request(data_to_send)
                    
                    if response_data is not None:
                        # JSON 데이터를 그대로 클라이언트로 전송
                        response = Response(json.dumps(response_data), status=200, mimetype='application/json')
                        return response
                    else:
                        # 에러코드
                        response_data = {
                            "status": 500,
                            "error": {
                                "errorCode": "F500",
                                "message": "Node.js서버와의 연결 실패"
                            }
                        }
                        return Response(json.dumps(response_data), status=500, mimetype='application/json')
                else:
                    # 에러코드
                    response_data = {
                        "status": 400,
                        "error": {
                            "errorCode": "F402",
                            "message": "있을 수 없는 용도기호"
                        }
                    }
                    return Response(json.dumps(response_data), status=400, mimetype='application/json')

        else:
            # 에러코드
            response_data = {
                "status": 400,
                "error": {
                    "errorCode": "F400",
                    "message": "올바르지 않는 확장자"
                }
            }
            response = Response(json.dumps(response_data), status=400, mimetype='application/json')
            return response


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() in ['true', '1', 't']
    app.run(debug=debug_mode, host='0.0.0.0', port=9035)
