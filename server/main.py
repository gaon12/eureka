from flask import Flask, request, Response
from flask_cors import CORS
import requests
from detect import LicensePlateRecognizer
import os
import json

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

app = Flask(__name__)
CORS(app)

# Download Image -> AI Model Predict -> Delete Image
# POST /predict
# GET /predict -> delete request
# Request JSON
'''
    {
        "url" : "Image URL"
    }
'''
@app.route('/predict', methods=['POST'])
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
                "result": "success"
            }
            json_response = json.dumps(response_data)

            # 결과를 JSON 형식으로 반환
            return Response(json_response, status=201, mimetype='application/json')
        else:
            return Response(status=400, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
