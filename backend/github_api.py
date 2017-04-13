import requests
import datetime
import time

from secrets import GIT_USER, GIT_TOKEN

def make_request(url):
    """Makes a request to a github url using a github API key for higher rate limits.
    Url should be specified without the "https://api.github.com/" prefix.
    Returns: the result as a  dictionary
    """
    payload = {'Authorization': 'token %s' % GIT_TOKEN}
    r = requests.get("https://api.github.com/" + url, params=payload)
    print GIT_TOKEN
    return r.json()

def get_top_contributors_by_commits():
    pass

def get_top_contributors_by_lines():
    pass

def get_top_contributor_in_period(start):
    pass

def get_latest_commit_info():
    pass

def get_commit_history(author, start, end):
    pass

