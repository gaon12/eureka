from flask import Flask, request, Response
from flask_cors import CORS
import requests
from detect import LicensePlateRecognizer
import os
import json
from flask_sqlalchemy import SQLAlchemy

# Download Image -> AI Model Predict -> Delete Image
# POST /predict
# GET /predict -> delete request
# Request JSON
'''
    {
        "url" : "Image URL"
    }
'''

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
app = Flask(__name__)
CORS(app)

# 데이터베이스 연결 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/db_name'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SQLAlchemy 객체 생성
db = SQLAlchemy(app)


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Custom User-Agent
        data = request.get_json()
        url = data['url']

        # Custom User-Agent
        # cua = 'vwaiolet'
        # params = {'useragent': cua}

        # address?useragent=vwaiolet
        response = requests.get(url)
        if response.status_code == 200:
            # Download Image
            # Directory is temp/file_name
            with open('temp/image.png', 'wb') as f:
                f.write(response.content)

            # 이미지 인식을 위한 클래스 인스턴스 생성
            recognizer = LicensePlateRecognizer(model_path='Model/best.pt')

            # 이미지 인식 및 결과 반환
            result = recognizer.recognize_license_plates('temp/image.png')

            # 결과를 JSON 형식으로 변환
            response_data = {
                "result": "success"
            }
            json_response = json.dumps(response_data)

            # 결과를 JSON 형식으로 반환
            return Response(json_response, status=201, mimetype='application/json')
        else:
            return Response(status=400, mimetype='application/json')
    elif request.method == 'GET':
        return "GET request received"


@app.route('/user', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user():
    if request.method == 'POST':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=201, mimetype='application/json')
    elif request.method == 'GET':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=200, mimetype='application/json')
    elif request.method == 'PUT':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=200, mimetype='application/json')
    elif request.method == 'DELETE':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=200, mimetype='application/json')


@app.route('/car', methods=['GET', 'POST', 'PUT', 'DELETE'])
def car():
    if request.method == 'POST':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=201, mimetype='application/json')
    elif request.method == 'GET':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=200, mimetype='application/json')
    elif request.method == 'PUT':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=200, mimetype='application/json')
    elif request.method == 'DELETE':
        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": "success"
        }
        json_response = json.dumps(response_data)
        return Response(json_response, status=200, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
