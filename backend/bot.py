import logging
import re
import datetime
import time

from telegram.ext import CommandHandler, Filters, MessageHandler, Updater

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
    bot.sendMessage(chat_id=update.message.chat_id, text='Valid commands are /top3, /top and /latest.')

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

def top_contributor_in_recent_period(bot, update, args):
    result = ''
    if len(args) >= 1:
        repo_url = args[0]
        period = "week" # default period
        try:
            if len(args) >= 2:
                period = args[1].lower()
                supported_periods = ["week", "fortnight", "month", "quarter", "year"]
                if period not in supported_periods:
                    raise ValueError('Supported periods are ' + ', '.join(supported_periods))
            
            owner, repo_name = parse_repo_url(repo_url)
            now = datetime.datetime.now()
            weeks_for_period = {'week':1, 'fortnight':2, 'month':4, 'quarter':12, 'year':52}
            contribution_data = github_api.get_author_contributions(owner, repo_name, start_time = now - datetime.timedelta(weeks=weeks_for_period[period]))
            
            top_by_commits = sorted(contribution_data, key = lambda a: a['commits'])[-1]
            top_by_lines_changed = sorted(contribution_data, key = lambda a: a['additions'] + a['deletions'])[-1]
            result = 'Top contributor last %s\nBy commits: %s\nBy lines modified: %s' \
                % (period, top_by_commits['login'], top_by_lines_changed['login'])
        except ValueError as e:
            result = '{0}'.format(e)
    else:
        result = 'You must specify the repositorys url. For example, "/top3 https://github.com/TEAMMATES/teammates"'
    bot.sendMessage(chat_id=update.message.chat_id, text=result, parse_mode='Markdown', disable_web_page_preview=True)

def latest_commit(bot, update, args):
    result = ''
    if len(args) > 0:
        repo_url = args[0]
        try:
            owner, repo_name = parse_repo_url(repo_url)
            latest_commit = github_api.get_latest_commit(owner, repo_name)
            commit_url = latest_commit['html_url']
            author_name = latest_commit['commit']['author']['name']
            author_url = latest_commit['author']['html_url']
            date_iso_8601 = latest_commit['commit']['author']['date']
            message = latest_commit['commit']['message']
            result = 'Latest commit:\n*Author*: [%s](%s)\n*Date*: %s\n*Description*: %s\n*Diff*: %s' \
                % (author_name, author_url, date_iso_8601, message, commit_url)
        except ValueError as e:
            result = '{0}'.format(e)
    else:
        result = 'You must specify the repositorys url. For example, "/latest https://github.com/TEAMMATES/teammates"'
    bot.sendMessage(chat_id=update.message.chat_id, text=result, parse_mode='Markdown', disable_web_page_preview=True)

def handle_unknown_command(bot, update):
    bot.sendMessage(chat_id=update.message.chat_id, text='Valid commands are /top3, /top and /latest.')

updater = Updater(token = BOT_TOKEN)
dispatcher = updater.dispatcher

start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)
top3_handler = CommandHandler('top3', top3_contributors, pass_args=True)
dispatcher.add_handler(top3_handler)
top_contributor_in_recent_period_handler = CommandHandler('top', top_contributor_in_recent_period, pass_args=True)
dispatcher.add_handler(top_contributor_in_recent_period_handler)
latest_handler = CommandHandler('latest', latest_commit, pass_args=True)
dispatcher.add_handler(latest_handler)
unknown_command_handler = MessageHandler(Filters.command, handle_unknown_command)
dispatcher.add_handler(unknown_command_handler)
updater.start_polling()