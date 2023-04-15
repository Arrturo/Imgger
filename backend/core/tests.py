import json
from graphene_django.utils import GraphQLTestCase
from graphql_jwt.shortcuts import get_token
from .models import ExtendUser
from django.test import Client


class ExtendUserGraphQLTestCase(GraphQLTestCase):
    def setUp(self):
        # Create a user
        self.user = ExtendUser.objects.create_user(username='testuser',
                                                   password='testpassword',
                                                   email='test123@test.pl')
        self.user.save()

        # Generate a JWT token for the user
        self.token = get_token(self.user)

        self.client = Client()
        self.client.login(username='testuser', password='testpassword')

    def test_query(self):

        # Create a client
        headers = {'Authorization': f'JWT {self.token}'}

        # Create the query string
        query = '''query {
            me {
                username
                email
            }
        }'''

        # Make the request
        response = self.client.post('/graphql', data={'query': query},
                                    headers=headers)

        # Check the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), {
            'data': {
                'me': {
                    'username': 'testuser',
                    'email': 'test123@test.pl'
                }
            }
        })
