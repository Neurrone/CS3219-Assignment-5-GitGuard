import logging
import re

from telegram.ext import CommandHandler, Updater

from secrets import BOT_TOKEN, GIT_USER, GIT_TOKEN
import github_api

url_validator_pattern = re.compile(r"^https://github.com/([^/]+)/([^/]+)", flags=0)

# config telegram bot library logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO)

def parse_repo_url(url):
    """Parses a github repo url.
    Returns: a tuple with the repo's owner and name, raises a ValueError if this is an invalid repo url."""
    matches = url_validator_pattern.match(url)
    if matches:
        owner, repo_name = matches.group(1), matches.group(2)
        return owner, repo_name
    else:
        raise ValueError('Invalid github repository url')

# command handlers

def start(bot, update):
    bot.sendMessage(chat_id=update.message.chat_id, text="I'm a bot, please talk to me!")

def top3_contributors(bot, update, args):
    result = ''
    if len(args) > 0:
        repo_url = args[0]
        try:
            owner, repo_name = parse_repo_url(repo_url)
            contribution_data = github_api.get_author_contributions(owner, repo_name)
            top3_by_commits = sorted(contribution_data, key = lambda a: a['commits'], reverse=True)[:3]
            top3_commits_strings = list(map(lambda a: a['login'] + ': ' + str(a['commits']), top3_by_commits))
            top3_by_lines_changed = sorted(contribution_data, key = lambda a: a['additions'] + a['deletions'], reverse=True)[:3]
            top3_by_lines_changed_strings = list(map(lambda a: a['login'] + ': ' + str(a['additions'] + a['deletions']), top3_by_lines_changed))
            result = 'By commits: ' + ', '.join(top3_commits_strings) + '\n'
            result += 'By additions and deletions: ' + ', '.join(top3_by_lines_changed_strings)
        except ValueError as e:
            result = '{0}'.format(e)
    else:
        result = 'You must specify the repositorys url. For example, "/top3 https://github.com/TEAMMATES/teammates"'
    bot.sendMessage(chat_id=update.message.chat_id, text=result)

updater = Updater(token = BOT_TOKEN)
dispatcher = updater.dispatcher
start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)
top3_handler = CommandHandler('top3', top3_contributors, pass_args=True)
dispatcher.add_handler(top3_handler)
updater.start_polling()