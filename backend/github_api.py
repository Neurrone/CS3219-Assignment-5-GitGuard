import requests
import datetime
import time
import sys
import logging

logger = logging.getLogger(__name__)

from secrets import GIT_USER, GIT_TOKEN

def make_request(url_without_github_prefix):
    """Makes a request to a github url using a github API key for higher rate limits.
    Url should be specified without the "https://api.github.com/" prefix.
    Returns: the result as a  dictionary
    """
    headers = {'Authorization': 'token %s' % GIT_TOKEN}
    url = 'https://api.github.com/' + url_without_github_prefix

    logger.info("Requesting %s", url)
    r = requests.get(url, headers=headers)
    logger.debug('Headers:\n%s\nResponse:\n%s', r.headers, r.text)

    retry_count = 0
    while r.status_code == 202 and retry_count < 3:
        logger.info('Status 202 received; pausing and retrying...')

        time.sleep(2)
        r = requests.get(url, headers=headers)
        logger.debug('Headers:\n%s\nResponse:\n%s', r.headers, r.text)

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
    return response[0]

def get_commit_history(author, start, end):
    pass

