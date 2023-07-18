from flask import Flask, request, Response
from flask_cors import CORS
import requests
from detect import LicensePlateRecognizer
import os
import json

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
app = Flask(__name__)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    url = data['url']

    response = requests.get(url)
    if response.status_code == 200:
        # 이미지 저장
        with open('temp/image.png', 'wb') as f:
            f.write(response.content)

        # 이미지 인식을 위한 클래스 인스턴스 생성
        recognizer = LicensePlateRecognizer(model_path='Model/best.pt')

        # 이미지 인식 및 결과 반환
        result = recognizer.recognize_license_plates('temp/image.png')

        # 결과를 JSON 형식으로 변환
        response_data = {
            "result": result
        }
        json_response = json.dumps(response_data)

        # 결과를 JSON 형식으로 반환
        return Response(json_response, status=201, mimetype='application/json')
    else:
        return Response(status=400, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
