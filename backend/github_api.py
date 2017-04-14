import requests
import datetime
import time
import sys
import logging

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

from secrets import GIT_USER, GIT_TOKEN

def make_request(url):
    """Makes a request to a github url using a github API key for higher rate limits.
    Url should be specified without the "https://api.github.com/" prefix.
    Returns: the result as a  dictionary
    """
    headers = {'Authorization': 'token %s' % GIT_TOKEN}
    r = requests.get("https://api.github.com/" + url, headers=headers)
    logging.debug(r.headers)
    retry_count = 0
    while r.status_code == 202 and retry_count < 3:
        logging.info('Status 202 received; pausing and retrying...')
        time.sleep(2)
        r = requests.get("https://api.github.com/" + url, headers=headers)
        retry_count += 1
    return r.json()

def get_author_contributions(owner, repo):
    """Returns the number of additions, commits and deletions for each author."""
    response = make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    authorList = []

    for contributor in response:
        authorName = contributor['author']['login']
        a = 0
        d = 0
        c = 0
        for week in contributor['weeks']:
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
    print(response.json()[0])
    return response.json()[0]

def get_commit_history(author, start, end):
    pass

