from flask import Flask, request, jsonify
from random import randint

app = Flask(__name__)

number = None

@app.route("/health", methods=['GET'])
def health():
    return "backend service is healthy"


@app.route("/number", methods=['GET', 'POST'])
def handle():
    return number

if __name__ == '__main__':
    number = str(randint(0, 8888))
    app.run(threaded=True, debug=True, host="0.0.0.0", port=6000)
