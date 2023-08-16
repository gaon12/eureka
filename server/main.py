from flask import Flask, request, Response, jsonify
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
    nodejs_server_url = "http://118.67.130.191:3000/car/info"  # Node.js 서버의 API 엔드포인트

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
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename))
        f.save(upload_path)

        recognizer = LicensePlateRecognizer(model_path='Model/best.pt')
        result = recognizer.recognize_license_plates(upload_path)

        data_to_send = {
            "car_number": result
        }
        print(result)
        # send_request 함수를 통해 요청 보내고 결과 받기
        response_data = send_request(data_to_send)
        try:
            os.remove(upload_path)
            print("File deleted successfully.")
        except OSError as e:
            print("Error:", e)

        if response_data is not None:
            # JSON 데이터를 그대로 클라이언트로 전송
            response = Response(json.dumps(response_data), status=200, mimetype='application/json')
            return response
        else:
            # Node.js 서버 응답이 실패한 경우
            error_response = {"error": "Failed to get response from Node.js server"}
            return Response(json.dumps(error_response), status=500, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9035)
