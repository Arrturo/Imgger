import json
from graphene_django.utils import GraphQLTestCase
from graphql_jwt.shortcuts import get_token
from core.models import ExtendUser, Category, Image, Post, Comment, Subcomment
from django.test import Client
import base64


class CategoriesGraphQLTestCase(GraphQLTestCase):
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
        category_id = base64.b64encode("CategoryType:{}".format(self.category.id).encode("utf-8")).decode("utf-8")
        mutation = '''
            mutation($categoryId: ID!){
                updateCategory(categoryId: $categoryId, name: "test"){
                    category{
                        id
                        name
                    }
                }
            }
        '''
        variables = { "categoryId": category_id }
        result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn('data', content)
        self.assertIn('updateCategory', content['data'])
        self.assertIn('category', content['data']['updateCategory'])
        self.assertEqual(content['data']['updateCategory']['category']['name'], 'test')

    def test_delete_category_mutation(self):
        headers = {'Authorization': f'JWT {self.token}'}
        category_id = base64.b64encode("CategoryType:{}".format(self.category.id).encode("utf-8")).decode("utf-8")
        mutation = '''
            mutation($categoryId: ID!){
                deleteCategory(categoryId: $categoryId){
                    success
                }
            }
        '''
        variables = { "categoryId": category_id }
        result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
        
        self.assertEqual(result.status_code, 200)
        
        content = json.loads(result.content)
        self.assertIn('data', content)
        
        self.assertIn('deleteCategory', content['data'])
        self.assertIn('success', content['data']['deleteCategory'])
        self.assertEqual(content['data']['deleteCategory']['success'], True)


class UsersGraphQLTestCase(GraphQLTestCase):
    def setUp(self):
        # Create a user
        self.user = ExtendUser.objects.create_user(username='testuser',
                                                   password='testpassword',
                                                   email='test123@test.pl',
                                                   is_staff=True
                                                   )
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

    def test_login_user_mutaion(self):
        headers = {'Authorization': f'JWT {self.token}'}

        mutation = '''mutation{
                        tokenAuth(username: "testuser", password: "testpassword"){
                            success
                            errors,
                            user{
                            username
                            }
                        }
                    }
                    '''
        
        result = self.client.post('/graphql', data={'query': mutation}, headers=headers)
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn('data', content)
        self.assertIn('tokenAuth', content['data'])
        self.assertEqual(content['data']['tokenAuth']['success'], True)
        self.assertEqual(content['data']['tokenAuth']['errors'], None)
        self.assertEqual(content['data']['tokenAuth']['user']['username'], 'testuser')


    def test_update_user_mutations(self):
        headers = {'Authorization': f'JWT {self.token}'}
        id = self.user.id
        mutation = '''mutation($userId: ID!){
                        updateUser(userId:, $userId, username: "test", email: "test@test.pl", password: "testpassword", isStaff: false){
                            user {
                                    id
                                    username
                                    password
                                    email
                                    isStaff
                            }
                            
                        }
                    }
        '''
        variables = { "userId": id }
        result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn('data', content)
        self.assertIn('updateUser', content['data'])
        self.assertIn('user', content['data']['updateUser'])
        self.assertEqual(content['data']['updateUser']['user']['username'], 'test')
        self.assertEqual(content['data']['updateUser']['user']['email'], 'test@test.pl')
        self.assertEqual(content['data']['updateUser']['user']['isStaff'], False)

    def test_delete_user_mutation(self):
        headers = {'Authorization': f'JWT {self.token}'}

        mutation = '''mutation($userId: ID!){
                        deleteUser(userId: $userId){
                            user{
                                username
                                email
                            }
                        }
                    }
                '''
        
        variables = { "userId": self.user.id }
        result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn('data', content)
        self.assertIn('deleteUser', content['data'])
        self.assertEqual(content['data']['deleteUser']['user']['username'], 'testuser')
        self.assertEqual(content['data']['deleteUser']['user']['email'], 'test123@test.pl')

        
# class ImagesGraphQLTestCase(GraphQLTestCase):
#     def setUp(self) -> None:
#         self.user = ExtendUser.objects.create_user(username='testuser',
#                                             password='testpassword',
#                                             email='test123@test.pl',
#                                             is_staff=True
#                                             )
#         self.user.save()

#         # Generate a JWT token for the user
#         self.token = get_token(self.user)

#         self.client = Client()
#         self.client.login(username='testuser', password='testpassword')

#         # self.image = Image.objects.create(name='TestImage',
#         #                                   file='sum.jpg')
#         # self.image.save()

#         self.category = Category.objects.create(name='TestCategory')
#         self.category.save()

#         self.post = Post.objects.create(title='TestPost',
#                                         description='TestDescription',
#                                         user=self.user,
#                                         image=self.image,
#                                         category=self.category)
#         self.post.save()

#     def test_query(self):
#         headers = {'Authorization': f'JWT {self.token}'}

#         query = '''query{
#                     posts{
#                         edges{
#                             node{
#                                 id,
#                                 description,
#                                 title,
#                                 image {
#                                     url
#                                 }
#                                 category{
#                                     name
#                                 }
#                             }
#                         }
#                         }
#                     }
#                 '''
        
#         result = self.client.post('/graphql', data={'query': query}, headers=headers)
#         self.assertEqual(result.status_code, 200)
#         content = json.loads(result.content)
#         self.assertIn('data', content)
#         self.assertIn('posts', content['data'])
#         self.assertIn('edges', content['data']['posts'])
#         self.assertIn('node', content['data']['posts']['edges'][0])
#         self.assertEqual(content['data']['posts']['edges'][0]['node']['description'], 'TestDescription')
#         self.assertEqual(content['data']['posts']['edges'][0]['node']['title'], 'TestPost')
#         self.assertEqual(content['data']['posts']['edges'][0]['node']['image']['file'], 'sum.jpg')
#         self.assertEqual(content['data']['posts']['edges'][0]['node']['category']['name'], 'TestCategory')

    # def test_create_post_mutation(self):
    #     headers = {'Authorization': f'JWT {self.token}'}  
    #     image_id = str(self.image.id)   
    #     category_id = base64.b64encode("CategoryType:{}".format(self.category.id).encode("utf-8")).decode("utf-8")
    #     mutation = '''mutation($categoryId: ID!, $userId: ID!, $imageId: String!){
    #                     createPost(title: "test", description: "testowanie", imageId: $imageId, userId: $userId, categoryId: $categoryId){
    #                         post{
    #                             title
    #                             description
    #                             image{
    #                                 url
    #                             }
    #                         }
    #                         errors
    #                         success
    #                     }
    #                     }
    #                 '''
        
    #     variables = {'imageId': image_id, 'userId': self.user.id, 'categoryId': category_id }
    #     result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
    #     self.assertEqual(result.status_code, 200)
    #     content = json.loads(result.content)
    #     self.assertIn('data', content)
    #     self.assertIn('createPost', content['data'])
    #     self.assertIn('post', content['data']['createPost'])
    #     self.assertEqual(content['data']['createPost']['post']['title'], 'test')
    #     self.assertEqual(content['data']['createPost']['post']['description'], 'testowanie')
    #     self.assertEqual(content['data']['createPost']['post']['image']['url'], 'sum.jpg')
    #     self.assertEqual(content['data']['createPost']['success'], True)

    # def test_like_post_mutation(self):
    #     headers = {'Authorization': f'JWT {self.token}'}  
    #     post_id = str(base64.b64encode("CategoryType:{}".format(self.post.id).encode("utf-8")).decode("utf-8"))

    #     mutation = ''' mutation($postId: String!){
    #                         like(postId: $postId){
    #                             success
    #                             errors
    #                         }
    #                     }
    #                     '''
        
    #     variables = {'postId': post_id}
    #     result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
    #     self.assertEqual(result.status_code, 200)
    #     content = json.loads(result.content)
    #     self.assertIn('data', content)
    #     self.assertIn('like', content['data'])
    #     self.assertEqual(content['data']['like']['success'], True)

    # def test_dislike_post_mutation(self):
    #     headers = {'Authorization': f'JWT {self.token}'}  
    #     post_id = str(base64.b64encode("CategoryType:{}".format(self.post.id).encode("utf-8")).decode("utf-8"))
        
    #     mutation = ''' mutation($postId: String!){
    #                 dislike(postId: $postId){
    #                     success
    #                     errors
    #                 }
    #             }
    #             '''
    #     variables = {'postId': post_id}
    #     result = self.client.post('/graphql', data={'query': mutation, 'variables': json.dumps(variables)}, headers=headers)
    #     self.assertEqual(result.status_code, 200)
    #     content = json.loads(result.content)
    #     self.assertIn('data', content)
    #     self.assertIn('dislike', content['data'])
    #     self.assertEqual(content['data']['dislike']['success'], True)




    









    
        

