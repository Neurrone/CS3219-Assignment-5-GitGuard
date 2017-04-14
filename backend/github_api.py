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
    return r.json()

def get_author_contributions(owner, repo):
    """Returns the number of additions, commits and deletions for each author."""
    response = make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    authorList = []

    for set in response:
        authorName = set['author']['login']
        a = 0
        d = 0
        c = 0
        for week in set['weeks']:
            a += week['a']
            d += week['d']
            c += week['c']
        author = {'login': authorName, 'additions':a, 'deletions':d, 'commits':c}
        authorList.append(author)
    return authorList

def get_top_contributors_by_lines():
    pass

def get_top_contributor_in_period(start):
    pass

def get_latest_commit_info():
    pass

def get_commit_history(author, start, end):
    pass

