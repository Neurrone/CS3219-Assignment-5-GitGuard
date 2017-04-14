import requests
import datetime
import time

from secrets import GIT_USER, GIT_TOKEN

def make_request(url_without_github_prefix):
    """Makes a request to a github url using a github API key for higher rate limits.
    Url should be specified without the "https://api.github.com/" prefix.
    Returns: the result as a  dictionary
    """
    headers = {'Authorization': 'token %s' % GIT_TOKEN}
    url = 'https://api.github.com/' + url_without_github_prefix
    print("Requesting ", url)
    r = requests.get(url, headers=headers)
    print('headers:')
    print(r.headers)
    print('response:')
    print(r)
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

def get_latest_commit(owner, repo):
    """Returns a dictionary containing info about the latest commit. See https://developer.github.com/v3/repos/commits/ for format specification."""
    response = make_request('repos/{}/{}/commits'.format(owner, repo))
    return response[0]

def get_commit_history(author, start, end):
    pass

