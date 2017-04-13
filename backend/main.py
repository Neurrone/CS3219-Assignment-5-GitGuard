import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib"))

from flask import Flask, jsonify, request, abort
import flask_cors
import requests

import github_api as api

app = Flask(__name__)
flask_cors.CORS(app) # allow cross-origin requests (e.g. from frontend)

@app.route("/")
def splash():
    return "GG backend running..."

@app.route('/<owner>/<repo>/contribution', methods=['GET'])
def get_contribution(owner, repo):
    response = api.make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    return jsonify(response)

@app.route('/<owner>/<repo>/sum_contribution', methods=['GET'])
def get_sum_contribution(owner, repo):
    response = api.make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    authorList = [];

    for author in response:
        authorName = author['author']['login'];
        a = 0;
        d = 0;
        c = 0;
        for week in author['weeks']:
            a += week['a'];
            d += week['d'];
            c += week['c'];
        author = {'login': authorName, 'additions':a, 'deletions':d, 'commits':c}
        print author;
        authorList.append(author);
    return jsonify(response);

if __name__ == "__main__":
    app.run()
