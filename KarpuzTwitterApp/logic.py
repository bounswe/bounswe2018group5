from requests import get
from utils.TwitterService import TwitterService


def get_tweets_with_location_and_query(search_params):
    """ Searches all tweets that are in the given location and contains a query string. """
    search_url = '{}1.1/search/tweets.json'.format(TwitterService().get_base_url())

    search_response = get(search_url, headers=TwitterService().get_request_headers(), params=search_params)

    # If response code different than 200 (means success), then return the error.
    if search_response.status_code != 200:
        return {'response': False, 'errors': search_response.json()['errors']}

    # Subtracts the tweets from the twitter response
    tweet_data = search_response.json()
    tweets = tweet_data['statuses']

    return {'response': True, 'tweets': tweets}