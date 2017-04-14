import git
import os

def clone_repo(owner, repo):
    url = 'https://github.com/{}/{}.git'.format(owner, repo)
    git.Repo.clone_from(url, os.path.join(os.path.dirname(__file__), 'repos/{}/{}'.format(owner, repo)), branch='master')
