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
    Returns: the result as a  dictionary, raises ValueError if a 404 is encountered.
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

    if r.status_code == 404:
        raise ValueError('Invalid  repository url')
    else:
        return r.json()

def get_author_contributions(owner, repo, start_time=None):
    """Returns the number of additions, commits and deletions for each author, and the author's profile page, starting from an optional timestamp."""
    response = make_request('repos/{}/{}/stats/contributors'.format(owner, repo))
    authorList = []

    for contributor in response:
        authorName = contributor['author']['login']
        author_url = contributor['author']['html_url']
        a = 0
        d = 0
        c = 0
        for week in contributor['weeks']:
            if not start_time or datetime.datetime.fromtimestamp(week['w']) >= start_time:
                a += week['a']
                d += week['d']
                c += week['c']
        author = {'login': authorName, 'additions':a, 'deletions':d, 'commits':c, 'url':author_url}
        authorList.append(author)
    return authorList

def get_latest_commit(owner, repo):
    """Returns a dictionary containing info about the latest commit. See https://developer.github.com/v3/repos/commits/ for format specification."""
    response = make_request('repos/{}/{}/commits'.format(owner, repo))
    return response[0]
