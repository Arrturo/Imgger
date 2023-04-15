import json
from graphene_django.utils import GraphQLTestCase
from graphql_jwt.shortcuts import get_token
from .models import ExtendUser, Category
from django.test import Client


class ExtendUserGraphQLTestCase(GraphQLTestCase):
    def setUp(self):
        # Create a user
        self.user = ExtendUser.objects.create_user(username='testuser',
                                                   password='testpassword',
                                                   email='test123@test.pl',
                                                   is_staff=True)
        self.user.save()

        # Generate a JWT token for the user
        self.token = get_token(self.user)

        self.client = Client()
        self.client.login(username='testuser', password='testpassword')

        self.category = Category.objects.create(name='TestowanieCategory')
        self.category.save()

    # def test_query(self):
    #     print("testquery", self.category.id)

    #     # Create a client
    #     headers = {'Authorization': f'JWT {self.token}'}

    #     # Create the query string
    #     query = '''query {
    #         me {
    #             username
    #             email
    #         }
    #     }'''

    #     # Make the request
    #     response = self.client.post('/graphql', data={'query': query},
    #                                 headers=headers)

    #     # Check the response
    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(json.loads(response.content), {
    #         'data': {
    #             'me': {
    #                 'username': 'testuser',
    #                 'email': 'test123@test.pl'
    #             }
    #         }
    #     })
    
    def test_create_category_mutation(self):

        headers = {'Authorization': f'JWT {self.token}'}
        mutation = '''
            mutation {
                createCategory(name: "TestCategory") {
                    category {
                        id
                        name
                    }
                }
            }
        '''
        result = self.client.post('/graphql', data={'query': mutation}, headers=headers)
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn('data', content)
        self.assertIn('category', content['data']['createCategory'])
        self.assertEqual(content['data']['createCategory']['category']['name'], 'TestCategory')

    def test_category_query(self):
        headers = {'Authorization': f'JWT {self.token}'}
        query = '''
            query{
                categories{
                    edges{
                        node{
                            id
                            name
                        }
                    }
                }
            }
        '''
        result = self.client.post('/graphql', data={'query': query}, headers=headers)
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn('data', content)
        self.assertIn('categories', content['data'])

    def test_update_category_mutation(self):
        headers = {'Authorization': f'JWT {self.token}'}
        mutation = '''
            mutation{
                updateCategory(categoryId: "Q2F0ZWdvcnlUeXBlOjU=", name: "test"){
                    category{
                        id
                        name
                    }
                }
            }
        '''
        result = self.client.post('/graphql', data={'query': mutation}, headers=headers)
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn('data', content)
        self.assertIn('updateCategory', content['data'])
        self.assertIn('category', content['data']['updateCategory'])
        self.assertEqual(content['data']['updateCategory']['category']['name'], 'test')

    def test_delete_category_mutation(self):
        headers = {'Authorization': f'JWT {self.token}'}
        mutation = '''
            mutation($categoryId: ID!){
                deleteCategory(categoryId: $categoryId){
                    success
                }
            }
        '''
        variables = { "categoryId": "Q2F0ZWdvcnlUeXBlOjQ=" }
        result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
        
        self.assertEqual(result.status_code, 200)
        
        content = json.loads(result.content)
        self.assertIn('data', content)
        
        self.assertIn('deleteCategory', content['data'])
        self.assertIn('success', content['data']['deleteCategory'])
        self.assertEqual(content['data']['deleteCategory']['success'], True)
