from flask import Flask, request, Response
from flask_cors import CORS
import requests
from detect import LicensePlateRecognizer
import os
import json
import re
from werkzeug.utils import secure_filename

# from db_connector import db, Car

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

app = Flask(__name__)
CORS(app)

# img 폴더 경로 설정
UPLOAD_FOLDER = os.path.join(app.root_path, 'temp')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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


# send_request 함수
def send_request(data_to_send, retries=3):
    nodejs_server_url = "http://your-nodejs-server-url.com/api/data"

    for _ in range(retries):
        try:
            response = requests.post(nodejs_server_url, json=data_to_send)
            response_data = response.json()

            if response.status_code == 200:
                return response_data
        except requests.exceptions.RequestException:
            pass

    return None


@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'POST':
        f = request.files['file']
        # img 폴더에 저장하기 위한 경로 생성
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename))
        f.save(upload_path)
        # Custom User-Agent
        cua = 'vwaiolet'
        params = {'useragent': cua}

        # 이미지 인식을 위한 클래스 인스턴스 생성
        recognizer = LicensePlateRecognizer(model_path='Model/best.pt')

        # 이미지 인식 및 결과 반환
        result = recognizer.recognize_license_plates('temp/' + f.filename)

        # address?useragent=vwaiolet
        # response = requests.get(url, params=params)

        nodejs_server_url = "http://118.67.130.191:3000/car/info"  # Node.js 서버의 API 엔드포인트
        data_to_send = {
            "car_number": result
        }

        # send_request 함수를 통해 요청 보내고 결과 받기
        response_data = send_request(data_to_send)
        # 결과를 JSON 형식으로 변환
        # response_data = {
        #     "result": "success",
        #     "car_number": "1234",
        #     "is_regist": "Y/N",
        #     "is_guest": "(Y/N)/null",
        #     "is_electric": "(Y/N)/null",
        #     "is_disabled": "(Y/N)/null"
        # }
        try:
            os.remove(upload_path)
            print("File deleted successfully.")
        except OSError as e:
            print("Error:", e)

        if response_data is not None:
            if result:
                if response_data['is_regist'] == 0:
                    response_data = {
                        "result": "success",
                        "car_number": result,
                        "is_regist": "X",
                        "is_guest": None,
                        "is_electric": None,
                        "is_disabled": None
                    }
                else:
                    is_guest = 'O' if response_data['is_guest'] == 1 else 'X'
                    is_electric = 'O' if response_data['is_electric'] == 1 else 'X'
                    is_disabled = 'O' if response_data['is_disabled'] == 1 else 'X'
                    response_data = {
                        "result": "success",
                        "car_number": result,
                        "is_regist": 'O',
                        "is_guest": is_guest,
                        "is_electric": is_electric,
                        "is_disabled": is_disabled
                    }

                json_response = json.dumps(response_data)
                return Response(json_response, status=201, mimetype='application/json')
            else:
                response_data = {"result": "false"}
                json_response = json.dumps(response_data)
                return Response(json_response, status=400, mimetype='application/json')

        else:
            # Node.js 서버 응답이 실패한 경우
            return Response(status=400, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9035)
