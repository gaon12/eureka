from flask import Flask, request, Response
from flask_cors import CORS
import requests
from detect import LicensePlateRecognizer
import os
import json
import re

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

app = Flask(__name__)
CORS(app)


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


@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'POST':
        data = request.get_json()
        url = data['url']
        slash = url.rfind('/')

        # File Name Parsing
        # at URL, split after find '/'
        if slash != -1:
            file_name = url[slash + 1:]
        else:
            file_name = 'image.png'

        # Verify Code Parsing
        # at File Name, split between '_' and '.'
        # Random 6 character
        # Using delete file
        vc_ub = file_name.rfind('_')
        vc_dot = file_name.rfind('.')
        vc = file_name[vc_ub:vc_dot]

        # Custom User-Agent
        cua = 'vwaiolet'
        params = {'useragent': cua}

        # address?useragent=vwaiolet
        response = requests.get(url, params=params)
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
                "result": "success",
                "car_number": "1234",
                "is_regist": "Y/N",
                "is_guest": "(Y/N)/null",
                "is_electric": "(Y/N)/null",
                "is_disabled": "(Y/N)/null",
            }
            json_response = json.dumps(response_data)

            return Response(json_response, status=201, mimetype='application/json')
        else:
            return Response(status=400, mimetype='application/json')

    elif request.method == 'GET':
        data = request.get_json()
        url = data['url']

        # URL에서 "username"과 "code" 추출
        pattern = r"https://api\.eureka\.uiharu\.dev/img/([^_]+)_([^_]+)\.(\w+)"
        matches = re.match(pattern, url)

        if matches:
            username = matches.group(1)
            code = matches.group(2)
            extension = matches.group(3)

            # 추출한 "username"과 "code"를 사용하여 GET 요청 보내기
            base_url = "https://api.eureka.uiharu.dev/img.php"
            params = {
                "filename": f"{username}_{code}.{extension}",
                "verify_code": code,
                "user-agent": "testua"
            }

            response = requests.get(base_url, params=params)
            print(response.text)
        else:
            print("No match found.")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9035)
