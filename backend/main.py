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

class BadRequest(Exception):
    status_code = 500

    def __init__(self, message, status_code=None, payload=None, logger=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
        if logger:
            logger(message)

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        return rv

class InvalidParametersError(BadRequest):
    def __init__(self, message):
        BadRequest.__init__(self, message=message, status_code=400, logger=logging.info)

class InvalidRepoError(BadRequest):
    def __init__(self):
        BadRequest.__init__(self, message='Could not get repo information. Is it valid?', status_code=404, logger=logging.info)

class LocalRepoError(BadRequest):
    def __init__(self):
        BadRequest.__init__(self, message='Could not clone repo. Is it valid?', status_code=404, logger=logging.info)

class GgError(BadRequest):
    def __init__(self, message):
        BadRequest.__init__(self, message=message, logger=logging.info)

@app.errorhandler(ValueError)
def handle_value_error(error):
    return handle_bad_request(InvalidRepoError())

@app.errorhandler(BadRequest)
def handle_bad_request(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

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
            commit = {'user': user, 'date': commitDate, 'count': count};
            commitList.append(commit);
        itrCount += 1;

    return jsonify(commitList);

def get_commits_for_file(owner, repo, file, start=None, end=None):
    import git_api
    from git.exc import GitCommandError
    import re

    args = ["--format=%H%n%ai%n%an <%ae>%n%s%n%H_DIFF_START"]

    if start:
        if not start.isdigit() or not end.isdigit():
            raise InvalidParametersError('Invalid line range: line numbers must be digits')

        try:
            start = int(start)
            end = int(end)
        except:
            raise InvalidParametersError('Invalid line range: line numbers must be integers')

        if start <= 0:
            raise InvalidParametersError('Invalid line range: line numbers must be positive')

        if end < start:
            raise InvalidParametersError('Invalid line range: end must not be before start')

        args.append('-L {},{}:{}'.format(start, end, file))
    else:
        args.append('-p')
        args.append(file)

    repo = git_api.prepare_repo(owner, repo)
    if not repo:
        raise LocalRepoError()

    try:
        git_output = repo.git.log(*args)
        # f = open('log.txt', 'w')
        # f.write(git_output.encode('utf8'))
        # f.close()
    except GitCommandError as e:
        msg = str(e).split('\n')[-1]
        if 'file {} has only '.format(file) in msg:
            line_count = [int(s) for s in msg.split() if s.isdigit()][0]
            raise InvalidParametersError('Invalid line range: file only has {} lines'.format(line_count))

        raise GgError('Error running git log: ' + msg)

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
        if start and end:
            return get_commits_for_file(owner, repo, file, start=start, end=end)
        else:
            return get_commits_for_file(owner, repo, file)

    raise InvalidParametersError('Please specify user or file params')

# sums up the total contributions (additions, deletions and commits) for all contributors
@app.route('/<owner>/<repo>/sum_contribution', methods=['GET'])
def get_sum_contribution(owner, repo):
    return jsonify(github_api.get_author_contributions(owner, repo))

@app.route('/<owner>/<repo>/lines', methods=['GET'])
def get_lines(owner, repo):
    import git_api
    from git.exc import GitCommandError
    import re

    repo = git_api.prepare_repo(owner, repo)
    if not repo:
        raise LocalRepoError()

    try:
        filenames = repo.git.ls_files().split('\n')
    except GitCommandError as e:
        msg = str(e).split('\n')[-1]
        raise GgError('Error running git ls-files: ' + msg)

    counts = {}
    name_mail_map = {}
    for filename in filenames:
        try:
            git_output = repo.git.blame('--line-porcelain', filename)
        except GitCommandError as e:
            logging.warning('Error running git blame %s; skipping...', filename)
            continue

        lines = git_output.split('\n')
        for i in range(len(lines)):
            line = lines[i]
            if not re.search('^author-mail ', line):
                continue

            mail = line[12:].strip().lower().lstrip('<').rstrip('>')
            if counts.get(mail) == None:
                counts[mail] = 1
                name_mail_map[mail] = lines[i - 1][7:].strip()
            else:
                counts[mail] += 1

    output = []
    for mail, count in counts.iteritems():
        name = name_mail_map[mail]
        output.append({
            'name': name,
            'count': count,
            'email': mail
        })

    output.sort(key=lambda k: k['count'], reverse=True)

    return jsonify(output)

if __name__ == "__main__":
    app.run()
