import git
import os, sys
import logging

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def get_remote_url(owner, repo):
    return 'https://github.com/{}/{}.git'.format(owner, repo)

def get_repo_path(owner, repo):
    return os.path.join(os.path.dirname(__file__), 'repos/{}/{}'.format(owner, repo))

def sync_repo(owner, repo):
    repo = git.Repo(get_repo_path(owner, repo))

    logging.info('Existing repo found; syncing...')
    repo.heads.master.checkout()
    repo.remotes.origin.fetch()
    repo.git.reset('--hard', 'origin/master')
    repo.git.clean('-ffdx')

    return repo

def clone_repo(owner, repo):
    try:
        return git.Repo.clone_from(get_remote_url(owner, repo), get_repo_path(owner, repo), branch='master')
    except:
        logging.info('Could not clone repo. Is it valid?')
        return None

def prepare_repo(owner, repo):
    try:
        logging.info('Checking for existing repo')
        return sync_repo(owner, repo)
    except:
        logging.info('No existing repo found; cloning...')
        return clone_repo(owner, repo)
