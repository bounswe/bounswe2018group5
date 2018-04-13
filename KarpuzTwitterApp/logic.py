from requests import get
from utils.TwitterService import TwitterService
import tweepy
from decouple import config
from pprint import pprint

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


def get_followers_of_user(search_params):
    search_url = '{}1.1/followers/ids.json'.format(TwitterService().get_base_url())

    search_response = get(search_url, headers=TwitterService().get_request_headers(), params=search_params)

    if search_response.status_code != 200:
        print(search_response.json())
        return {'response': False, 'errors': search_response.json()}

    data = search_response.json()
    followings = set(data['ids'])

    return {'response': True, 'followings': followings}


def get_common_followers_of_two_users(search_params):
    params = {}
    params['screen_name'] = search_params['user_one']
    response_user_one = get_followers_of_user(params)
    if not response_user_one['response']:
        return {'response': False, 'errors': response_user_one['errors']}
    followers_user_one = response_user_one['followings']
    params['screen_name'] = search_params['user_two']
    response_user_two = get_followers_of_user(params)
    if not response_user_two['response']:
        return {'response': False, 'errors': response_user_two['errors']}
    followers_user_two = response_user_two['followings']

    common_followers = followers_user_one.intersection(followers_user_two)

    common_follower_details = get_user_details({'user_id': common_followers})

    data = {
        'users': common_follower_details['data'],
        'response': common_follower_details['response'],
        'errors': ""
    }

    return data


def get_user_timeline(screen_name):
    user_timeline_url = '{}1.1/statuses/user_timeline.json'.format(TwitterService().get_base_url())


    #Get the screen_name from the user, other parameters are set to default values
    user_timeline_params = {
        'screen_name' : screen_name,
        'count': 25,
        'exclude_replies': True,
        'include_rts': False
    }

    user_timeline_response = get(user_timeline_url, headers=TwitterService().get_request_headers(), params=user_timeline_params)

    #If not succes
    if user_timeline_response.status_code != 200:
        return {'response': False, 'errors': user_timeline_response.json()['errors']}

    # API directly returns tweets
    tweets = user_timeline_response.json()
    return {'response': True, 'tweets': tweets}


def get_followings_of_user(search_params):
    search_url = '{}1.1/friends/ids.json'.format(TwitterService().get_base_url())

    followings_response = get(search_url, headers=TwitterService().get_request_headers(), params=search_params)

    # If response code different than 200 (means success), then return the error.
    if followings_response.status_code != 200:
        return {'response': False, 'errors': followings_response.json()}

    data = followings_response.json()
    followings = set(data['ids'])

    return {'response': True, 'followings': followings}


def get_user_details(search_params):
    search_url = '{}1.1/users/lookup.json'.format(TwitterService().get_base_url())

    user_details_response = get(search_url, headers=TwitterService().get_request_headers(), params=search_params)

    # If response code different than 200 (means success), then return the error.
    if user_details_response.status_code != 200:
        return {'response': False, 'errors': user_details_response.json()['errors']}

    return {'response': True, 'data': user_details_response.json()}


def get_common_followings_of_two_user(search_params):
    params={}
    params['screen_name'] = search_params['user_one']
    response_user_one = get_followings_of_user(params)
    if not response_user_one['response']:
        return {'response': False, 'errors': response_user_one['errors']}
    followings_user_one = response_user_one['followings']
    params['screen_name'] = search_params['user_two']
    response_user_two = get_followings_of_user(params)
    if not response_user_two['response']:
        return {'response': False, 'errors': response_user_two['errors']}
    followings_user_two = response_user_two['followings']

    common_followings = followings_user_one.intersection(followings_user_two)

    return get_user_details({'user_id': common_followings})


def search_users(query):
    auth = tweepy.OAuthHandler(config("CUSTOMER_KEY"), config("CUSTOMER_SECRET_KEY"))
    auth.set_access_token(config("ACCESS_TOKEN"), config("ACCESS_TOKEN_SECRET"))

    api = tweepy.API(auth)

    search_response = list(api.search_users(query, 18))

    return search_response
