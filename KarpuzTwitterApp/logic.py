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

<<<<<<< HEAD
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
=======

def get_followings_of_user(search_params):
    """ Searches all tweets that are in the given location and contains a query string. """
    search_url = '{}1.1/friends/ids.json'.format(TwitterService().get_base_url())

    search_response = get(search_url, headers=TwitterService().get_request_headers(), params=search_params)

    # If response code different than 200 (means success), then return the error.
    if search_response.status_code != 200:
        return {'response': False, 'errors': search_response.json()['errors']}

    # Subtracts the tweets from the twitter response
    data = search_response.json()
    # print(search_response.json())
    followings = set(data['ids'])

    return followings


def get_user_details(search_params):
    """ Searches all tweets that are in the given location and contains a query string. """
    search_url = '{}1.1/users/lookup.json'.format(TwitterService().get_base_url())

    search_response = get(search_url, headers=TwitterService().get_request_headers(), params=search_params)

    # If response code different than 200 (means success), then return the error.
    if search_response.status_code != 200:
        return {'response': False, 'errors': search_response.json()['errors']}

    # Subtracts the tweets from the twitter response
    data = search_response.json()

    return data


def get_common_followings_of_two_user():
    params={}
    params['screen_name'] = 'emin_gure'  # search_params['user_one']
    followings_user_one = get_followings_of_user(params)
    params['screen_name'] = '_mehmetemin_'  # search_params['user_two']
    followings_user_two = get_followings_of_user(params)

    common_followings = followings_user_one.intersection(followings_user_two)

    return get_user_details({'user_id': common_followings})


get_common_followings_of_two_user()
>>>>>>> Add logic for getting common followings of two user
