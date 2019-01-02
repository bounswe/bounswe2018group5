from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse
from django.core import validators
import mongoengine
from decouple import config
import json
from faker import Faker

# def setUp(self):
#         credentials = base64.b64encode('username:password')
#         self.client.defaults['HTTP_AUTHORIZATION'] = 'Basic ' + credentials

def test_db_setup():
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

def test_db_tearDown():
    connection = mongoengine.connection.get_connection()
    connection.drop_database(config('MONGODB_TEST_DB'))
    mongoengine.connection.disconnect()

class TestUser(TestCase):

    headers = {}

    @classmethod
    def setUpClass(self):
        super().setUpClass()

        test_db_setup()
        self.fake = Faker()
        self.client = Client()


    @classmethod
    def tearDownClass(self):
        test_db_tearDown()

        super().tearDownClass()

    def setUp(self):
        super().setUp()
        # Valid user registered
        body = {
            'email': self.fake.first_name()+'@karpuz.ml',
            'username': self.fake.first_name(),
            'password': "karpuz123",
            'full_name': self.fake.name()
        }
        response = self.client.post(reverse('register'), json.dumps(body), content_type='application/json')
        token = response.json()['api_token']
        self.headers = {
            'HTTP_AUTHORIZATION': token
        }

    def test_register(self):

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


    def test_login(self):
        url = reverse('login')

        # Valid user registered
        body = {
        	'email': "user@karpuz.ml",
        	'username': "username",
        	'password': "karpuz123",
        	'full_name': "User Name"
        }
        response = self.client.post(reverse('register'), json.dumps(body), content_type='application/json')
        # self.assertTrue('api_token' in response.json() and response.json()['response'] == True)

        # GET call
        response = self.client.get(url)
        exp_data = {
            'response': False,
            'error': 'wrong request method'
        }
        self.assertEqual(exp_data, response.json())

        # Password invalid
        body = {
        	'username': "username",
        	'password': "karpuz1"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        exp_data = {
            'error': 'Credentials are not correct!',
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Username invalid
        body = {
        	'username': "usernam",
        	'password': "karpuz123"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        exp_data = {
            'error': 'Credentials are not correct!',
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Password doesn't exist
        body = {
        	'username': "username2"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        exp_data = {
            'error': 'Credentials are not correct!',
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Valid
        body = {
        	'username': "username",
        	'password': "karpuz123"
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        self.assertTrue('api_token' in response.json() and response.json()['response'] == True)

    def test_profile(self):
        url = reverse('get_user')

        # GET call without token
        response = self.client.get(url)
        exp_data = {
            'error': 'Unauthorized',
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # GET call with token
        response = self.client.get(url, **self.headers)
        # print(response.json())
        self.assertTrue('user' in response.json() and response.json()['response'] == True) # TODO: Might be expanded

        # Invalid Update (without header)
        body = {
        	'bio': self.fake.text()
        }
        response = self.client.put(url, json.dumps(body), content_type='application/json')
        exp_data = {
            'error': 'Unauthorized',
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Invalid Update (wrong email format)
        body = {
        	'email': self.fake.first_name()
        }
        response = self.client.put(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue('Invalid email' in str(response.json()))

        # Invalid Update (wrong password format)
        body = {
        	'password': 'karpuz'
        }
        self.assertRaises(validators.ValidationError,lambda:
            self.client.put(url, json.dumps(body), content_type='application/json', **self.headers)
        )

        # Invalid Update (wrong type format)
        body = {
        	'type': 'freelancer'
        }
        response = self.client.put(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue('ValidationError' in str(response.json()))

        # Valid Update
        body = {
        	'bio': self.fake.text()
        }
        response = self.client.put(url, json.dumps(body), content_type='application/json', **self.headers)
        exp_data = {
            'response': True
        }
        self.assertEqual(exp_data, response.json())

    def test_logout(self):
        url = reverse('logout')

        # GET call without token
        response = self.client.get(url)
        exp_data = {
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # GET call with token
        response = self.client.get(url, **self.headers)
        exp_data = {
            'response': True
        }
        self.assertEqual(exp_data, response.json())
