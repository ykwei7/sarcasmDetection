from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def api_health():
    response = jsonify('API is working!')
    return response


@app.route('/predict', methods=["POST"])
def predict():
    response = jsonify(request.json['text'])
    return response

if __name__ == '__main__':
    app.run(debug=True)