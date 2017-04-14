import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib"))

from flask import Flask, jsonify, request, abort
import flask_cors
import requests

import github_api

app = Flask(__name__)
flask_cors.CORS(app) # allow cross-origin requests (e.g. from frontend)

@app.route("/")
def splash():
    return "GG backend running..."

@app.route('/<owner>/<repo>/contribution', methods=['GET'])
def get_contribution(owner, repo):
    response = github_api.make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    return jsonify(response)

@app.route('/<owner>/<repo>/collaborators', methods=['GET'])
def get_collaborators(owner, repo):
    response = github_api.make_request('repos/{}/{}/collaborators'.format(owner, repo))
    return jsonify(response)

@app.route('/<owner>/<repo>/<user>/commits_for_user', methods=['GET'])
def get_commits_for_user(owner, repo, user):
    response = github_api.make_request('repos/{}/{}/commits?author={}'.format(owner, repo, user))
    commitList = [];

    itrCount = 0;
    for i in range (0, len(response)-1):
        commitDate = response[i]['commit']['committer']['date'][:10];
        count = 0;
        for j in range (0, len(response)-1):
            compDate = response[j]['commit']['committer']['date'][:10];
            if (commitDate == compDate):
                i = j;
                count += 1;
        if (itrCount == i):
            commit = {'date': commitDate, 'count': count};
            commitList.append(commit);
        itrCount += 1;

    return jsonify(commitList);

# sums up the total contributions (additions, deletions and commits) for all contributors
@app.route('/<owner>/<repo>/sum_contribution', methods=['GET'])
def get_sum_contribution(owner, repo):
    return jsonify(github_api.get_author_contributions(owner, repo))

# gets tne summed contributions of each contributor, sorted by additions (for chatbot)
@app.route('/<owner>/<repo>/sum_contribution/addition', methods=['GET'])
def get_sum_contribution_sortedby_additions(owner, repo):
    response = github_api.make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    authorList = [];

    for set in response:
        authorName = set['author']['login'];
        a = 0;
        for week in set['weeks']:
            a += week['a'];
        author = {'login': authorName, 'additions':a}
        authorList.append(author);
        authorList.sort(reverse = True);
    return jsonify(authorList);

# gets tne summed contributions of each contributor, sorted by deletions (for chatbot)
@app.route('/<owner>/<repo>/sum_contribution/deletion', methods=['GET'])
def get_sum_contribution_sortedby_deletions(owner, repo):
    response = github_api.make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    authorList = [];

    for set in response:
        authorName = set['author']['login'];
        d = 0;
        for week in set['weeks']:
            d += week['d'];
        author = {'login': authorName, 'deletions':d}
        authorList.append(author);
        authorList.sort(reverse = True);
    return jsonify(authorList);

# gets tne summed contributions of each contributor, sorted by commits (for chatbot)
@app.route('/<owner>/<repo>/sum_contribution/commit', methods=['GET'])
def get_sum_contribution_sortedby_commits(owner, repo):
    response = github_api.make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    authorList = [];

    for set in response:
        authorName = set['author']['login'];
        c = 0;
        for week in set['weeks']:
            c += week['c'];
        author = {'login': authorName, 'commits':c}
        authorList.append(author);
        authorList.sort(reverse = True);
    return jsonify(authorList);

# returns a list containing the week data (additions, deletions and commits) for a specific user
@app.route('/<owner>/<repo>/<login>/commit_history', methods=['GET'])
def get_commit_history(owner, repo, login):
    response = github_api.make_request('repos/{}/{}/stats/contributors'.format(owner, repo))

    for set in response:
        if (login == set['author']['login']):
            author_commit_history = set['weeks']
            break;

    return jsonify(author_commit_history);

if __name__ == "__main__":
    app.run()
