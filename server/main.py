from flask import Flask, request, Response
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Download Image -> AI Model Predict -> Delete Image
# POST /predict
# Request JSON
'''
    {
        "url" : "Image URL"
    }
'''
@app.route('/predict', methods=['POST'])
def predict():
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
    print(vc)

    # Custom User-Agent
    cua = 'vwaiolet'
    params = {'useragent': cua}

    # address?useragent=vwaiolet
    response = requests.get(url, params=params)
    if response.status_code == 200:
        # Download Image
        # Directory is temp/file_name
        with open('temp/' + file_name, 'wb') as f:
            f.write(response.content)
        return Response(status=201)
    else:
        return Response(status=400)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
