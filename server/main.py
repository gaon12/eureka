from flask import Flask, request, Response
from flask_cors import CORS
import requests

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
        return Response(status=201, mimetype='application/json')
    else:
        return Response(status=400, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
