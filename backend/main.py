import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib"))

from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()
