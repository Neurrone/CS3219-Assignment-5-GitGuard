import os, sys, argparse, logging

parser = argparse.ArgumentParser()
parser.add_argument(
    '-d', '--debug',
    help="More logging output for debugging purposes",
    action="store_const", dest="log_level", const=logging.DEBUG,
    default=logging.INFO,
)

logging.basicConfig(stream=sys.stdout, level=parser.parse_args().log_level,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

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

def get_commits_for_file(owner, repo, file, start=None, end=None):
    import git_api
    from git.exc import GitCommandError
    import re

    repo = git_api.prepare_repo(owner, repo)
    if not repo:
        return jsonify('TODO: error')

    args = ["--format=%H%n%ai%n%an <%ae>%n%s%n%H_DIFF_START"]

    if start:
        args.append('-L {},{}:{}'.format(start, end, file))
    else:
        args.append('-p')
        args.append(file)

    try:
        git_output = repo.git.log(*args)
        # f = open('log.txt', 'w')
        # f.write(git_output.encode('utf8'))
        # f.close()
    except GitCommandError as e:
        return jsonify('TODO: error: ' + str(e).split('\n')[-1])

    lines = git_output.split('\n')
    commit_start_locations = []
    commit_diff_locations = []
    for i in range(len(lines)):
        line = lines[i]
        if re.search('^[0-9a-f]{40}$', line):
            commit_start_locations.append(i)
        elif re.search('^[0-9a-f]{40}_DIFF_START$', line):
            commit_diff_locations.append(i)

    commit_end_locations = []
    for i in commit_start_locations[1:]:
        commit_end_locations.append(i)
    commit_end_locations.append(len(lines))

    commits = []
    for idx in range(len(commit_start_locations)):
        start_loc = commit_start_locations[idx]
        diff_loc = commit_diff_locations[idx]
        end_loc = commit_end_locations[idx]

        commit_hash = lines[start_loc]
        commit_date = lines[start_loc + 1]
        commit_author = lines[start_loc + 2]
        commit_message = '\n'.join(lines[start_loc + 3:diff_loc]).strip()
        commit_diff = '\n'.join(lines[diff_loc + 1:end_loc]).strip()

        commit = {
            'hash': commit_hash,
            'date': commit_date,
            'author': commit_author,
            'message': commit_message,
            'diff': commit_diff
        }

        commits.append(commit)

    return jsonify(commits)

@app.route('/<owner>/<repo>/commits', methods=['GET'])
def get_commits(owner, repo):
    user = request.args.get('user')
    if user:
        return get_commits_for_user(owner, repo, user)

    file = request.args.get('file')
    start = request.args.get('start')
    end = request.args.get('end')
    if file:
        if start and end and start.isdigit() and end.isdigit():
            return get_commits_for_file(owner, repo, file, start=int(start), end=int(end))
        else:
            return get_commits_for_file(owner, repo, file)

    return jsonify('TODO: error')

# sums up the total contributions (additions, deletions and commits) for all contributors
@app.route('/<owner>/<repo>/sum_contribution', methods=['GET'])
def get_sum_contribution(owner, repo):
    return jsonify(github_api.get_author_contributions(owner, repo))

if __name__ == "__main__":
    app.run()
