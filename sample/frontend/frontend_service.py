from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return "playground is healthy"


@app.route('/', methods=['GET'])
def handle():
    return ''


@app.route('/number', methods=['GET'])
def handle_python():
    req = requests.post('http://backend-service/number')
    return req.text


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
