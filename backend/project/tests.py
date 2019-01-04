from django.contrib.auth.models import User
from project.models import Project
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
        host='mongodb',
        port=config('MONGODB_PORT', cast=int),
        authentication_source='admin',
        connect=False
    )

def test_db_tearDown():
    connection = mongoengine.connection.get_connection()
    connection.drop_database(config('MONGODB_TEST_DB'))
    mongoengine.connection.disconnect()

class TestProject(TestCase):

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

    # workaround to not to raise settings.DATABASE error
    def _post_teardown(self):
        return

    def test_project(self):
        url = reverse('get_projects')

        # GET Guest call
        response = self.client.get(url)
        self.assertTrue('projects' in response.json() and response.json()['response'] == True)

        # Token missing
        body = {
            'title': "Project Title",
        	'description': "Simple Desc",
        	'project_deadline': "2018-10-10",
        	'budget': 200
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json')
        exp_data = {
            'error': 'Unauthorized',
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Title missing
        body = {
        	'description': "Simple Desc",
        	'project_deadline': "2018-10-10",
        	'budget': 200
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        exp_data = {
            'error': "'title'", 
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Description missing
        body = {
        	'title': "Simple Title",
        	'project_deadline': "2018-10-10",
        	'budget': 200
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        exp_data = {
            'error': "'description'", 
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # project_deadline missing
        body = {
        	'title': "Simple Title",
            'description': "Simple Desc",
        	'budget': 200
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        exp_data = {
            'error': "'project_deadline'", 
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # budget missing
        body = {
        	'title': "Simple Title",
            'description': "Simple Desc",
        	'project_deadline': "2018-10-10",
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        exp_data = {
            'error': "'budget'", 
            'response': False
        }
        self.assertEqual(exp_data, response.json())

        # Valid Project
        body = {
            'title': "Project Title",
        	'description': "Simple Desc",
        	'project_deadline': "2018-10-10",
        	'budget': 200
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue('project' in response.json() and response.json()['response'] == True)

        project_id = response.json()['project']['project_id']

        # GET projects and project
        response = self.client.get(url, {'ids': project_id}, content_type='application/json')
        self.assertTrue('projects' in response.json() and response.json()['response'] == True)

        # PUT project
        body = {
            'project_id': project_id,
            'title': "Project Title",
        }
        response = self.client.put(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue(body['title'] == response.json()['project']['title'] and response.json()['response'] == True)

    def test_bid_accept_and_finish(self):
        # Create Freelancer 
        body = {
            'email': self.fake.first_name()+'@karpuz.ml',
            'username': self.fake.first_name(),
            'password': "karpuz123",
            'full_name': self.fake.name()
        }
        response = self.client.post(reverse('register'), json.dumps(body), content_type='application/json')
        token = response.json()['api_token']
        headers = {
            'HTTP_AUTHORIZATION': token
        }

        url = reverse('get_user')
        response = self.client.get(url, **self.headers)
        self.assertTrue('user' in response.json() and response.json()['response'] == True)
        freelancer = response.json()['user']['id']

        url = reverse('get_projects')
        # Create Project
        body = {
            'title': "Project Title",
        	'description': "Simple Desc",
        	'project_deadline': "2018-10-10",
        	'budget': 0
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue('project' in response.json() and response.json()['response'] == True)

        project_id = response.json()['project']['project_id']

        # Add Bid to the project from freelancer
        url = reverse('add_bid')
        body = {
            'project_id': project_id,
            'freelancer': freelancer,
            'note': "I am the best for this job.",
        	'offer': 0
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **headers)
        self.assertTrue(response.json()['response'] == True)
        
        # Get project
        url = reverse('get_projects')

        response = self.client.get(url, {'ids': project_id}, content_type='application/json')
        self.assertTrue('projects' in response.json() and response.json()['response'] == True)
        bid_id = response.json()['projects'][0]['bids'][0]['bid_id']

        # Accept Bid from client
        url = reverse('accept_bid')
        body = {
            'bid_id': bid_id,
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue(response.json()['response'] == True)

        # Finish Project
        url = reverse('finish_project')
        body = {
            'project_id': project_id,
        }
        response = self.client.put(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue(2 == response.json()['project']['status'] and response.json()['response'] == True)

    def test_bid_discard(self):
        # Create Freelancer 
        body = {
            'email': self.fake.first_name()+'@karpuz.ml',
            'username': self.fake.first_name(),
            'password': "karpuz123",
            'full_name': self.fake.name()
        }
        response = self.client.post(reverse('register'), json.dumps(body), content_type='application/json')
        token = response.json()['api_token']
        headers = {
            'HTTP_AUTHORIZATION': token
        }

        url = reverse('get_user')
        response = self.client.get(url, **self.headers)
        self.assertTrue('user' in response.json() and response.json()['response'] == True)
        freelancer = response.json()['user']['id']

        url = reverse('get_projects')
        # Create Project
        body = {
            'title': "Project Title",
        	'description': "Simple Desc",
        	'project_deadline': "2018-10-10",
        	'budget': 0
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue('project' in response.json() and response.json()['response'] == True)

        project_id = response.json()['project']['project_id']

        # Add Bid to the project from freelancer
        url = reverse('add_bid')
        body = {
            'project_id': project_id,
            'freelancer': freelancer,
            'note': "I am the best for this job.",
        	'offer': 0
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **headers)
        self.assertTrue(response.json()['response'] == True)
        
        # Get project
        url = reverse('get_projects')

        response = self.client.get(url, {'ids': project_id}, content_type='application/json')
        self.assertTrue('projects' in response.json() and response.json()['response'] == True)
        bid_id = response.json()['projects'][0]['bids'][0]['bid_id']

        # Accept Bid from client
        url = reverse('discard_bid')
        body = {
            'bid_id': bid_id,
        }
        response = self.client.post(url, json.dumps(body), content_type='application/json', **self.headers)
        self.assertTrue(response.json()['response'] == True)