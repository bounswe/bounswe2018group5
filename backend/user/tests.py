from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse
import mongoengine
from decouple import config
import json


class TestUserRegistrationView(TestCase):

    def setUp(self):
        super().setUpClass()
        mongoengine.connection.disconnect()
        mongoengine.connect(
            db=config('MONGODB_TEST_DB'),
            username=config('MONGODB_USER'),
            password=config('MONGODB_PASSWORD'),
            host='localhost',
            port=config('MONGODB_PORT', cast=int),
            authentication_source='admin',
            connect=False
        )
        self.client = Client()

    def tearDown(self):
        connection = mongoengine.connection.get_connection()
        print(connection)
        connection.drop_database(config('MONGODB_TEST_DB'))
        mongoengine.connection.disconnect()
        super().tearDownClass()

    def test_registration(self):
        url = reverse('register')

        # GET call
        response = self.client.get(url)
        exp_data = {
            'response': False,
            'error': 'wrong request method'
        }
        self.assertEqual(exp_data, response.json())

        # Password invalid
        body = {
        	'email': "user@karpuz.ml",
        	'username': "username",
        	'password': "karpuz1",
        	'full_name': "User Name"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        exp_data = {
            'error': "['Password does not meet requirements']",
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Email adress invalid
        email = 'invalidemail@'
        body = {
        	'email': email,
        	'username': "username",
        	'password': "karpuz123",
        	'full_name': "User Name"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        exp_data = {
            "error": "ValidationError (User:None) (Invalid email address: " + email + ": ['email'])",
            "response": False
        }
        self.assertEqual(exp_data, response.json())

        # Full Name doesn't exist
        body = {
        	'email': "user@karpuz.ml",
        	'username': "username2",
        	'password': "karpuz11"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        exp_data = {
            'error': "'full_name'",
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Valid
        body = {
        	'email': "user1@karpuz.ml",
        	'username': "username1",
        	'password': "karpuz11",
        	'full_name': "User Name"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        self.assertTrue('api_token' in response.json() and response.json()['response'] == True)
