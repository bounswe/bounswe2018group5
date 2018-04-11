import base64

from decouple import config
from requests import post


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class TwitterService:
    """Singleton Class for communication with Twitter."""
    __metaclass__ = Singleton

    def __init__(self):
        key_secret = '{}:{}'.format(config("CUSTOMER_KEY"), config("CUSTOMER_SECRET_KEY")).encode('ascii')
        b64_encoded_key = base64.b64encode(key_secret)
        b64_encoded_key = b64_encoded_key.decode('ascii')

        self.base_url = 'https://api.twitter.com/'
        auth_url = '{}oauth2/token'.format(self.base_url)

        auth_headers = {
            'Authorization': 'Basic {}'.format(b64_encoded_key),
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }

        auth_data = {
            'grant_type': 'client_credentials'
        }

        auth_resp = post(auth_url, headers=auth_headers, data=auth_data)

        access_token = auth_resp.json()['access_token']

        self.request_headers = {
            'Authorization': 'Bearer {}'.format(access_token)
        }

    def get_request_headers(self):
        """Gets the request header """
        return self.request_headers

    def get_base_url(self):
        """Gets Twitter API base url"""
        return self.base_url
