from django.test import TestCase, Client
from core.models import Category, Post, Image, Comment, ExtendUser
import json



class PostTypeTestCase(TestCase):
    def setUp(self):
        self.user = ExtendUser.objects.create_user(username="testuser")
        self.category = Category.objects.create(name="Test Category")
        self.image = Image.objects.create(name="TestImage", url="sum.jpg")

        self.post1 = Post.objects.create(title="Test Post1", category_id=self.category.id, image_id=self.image.id, user_id=self.user.id, is_private=False, short_url="testpost1")
        self.post2 = Post.objects.create(title="Test Post2", category_id=self.category.id, image_id=self.image.id, user_id=self.user.id, is_private=False, short_url="testpost2")
        self.post3 = Post.objects.create(title="Test Post3", category_id=self.category.id, image_id=self.image.id, user_id=self.user.id, is_private=False, short_url="testpost3")

        self.comment = Comment.objects.create(comment="Test Comment", post_id=self.post1.id, user_id=self.user.id)
        self.comment = Comment.objects.create(comment="Test Comment", post_id=self.post2.id, user_id=self.user.id)
        self.comment = Comment.objects.create(comment="Test Comment", post_id=self.post2.id, user_id=self.user.id)

        self.client = Client()

    def test_resolve_posts(self):
        query = '''
            query {
                posts {
                    edges {
                        node {
                            id
                            title
                            likes
                            dislikes
                            isLiked
                            isDisliked
                            commentsCount
                            previousPost {
                                id
                                title
                            }
                            nextPost {
                                id
                                title
                            }
                        }
                    }
                }
            }
        '''

        response = self.client.post('/graphql', {'query': query})

        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)
        self.assertEqual(content["data"]["posts"]["edges"][1]["node"]["likes"], 0)
        self.assertEqual(content["data"]["posts"]["edges"][1]["node"]["dislikes"], 0)
        self.assertEqual(content["data"]["posts"]["edges"][1]["node"]["isLiked"], False)
        self.assertEqual(content["data"]["posts"]["edges"][1]["node"]["isDisliked"], False)
        self.assertEqual(content["data"]["posts"]["edges"][1]["node"]["commentsCount"], 2)
        self.assertEqual(content["data"]["posts"]["edges"][1]["node"]["previousPost"]["title"], "Test Post3")
        self.assertEqual(content["data"]["posts"]["edges"][1]["node"]["nextPost"]["title"], "Test Post1")



class CategoryTypeTestCase(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Test Category")

        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        Post.objects.create(title="Post 1", image_id=self.image.id, category=self.category, is_private=False, short_url="test1")
        Post.objects.create(title="Post 2", image_id=self.image.id, category=self.category, is_private=True, short_url="test2")
        Post.objects.create(title="Post 3", image_id=self.image.id, category=self.category, is_private=False, short_url="test3")

        self.client = Client()

    def test_resolve_posts_count(self):
        query = '''
            query{
                categories{
                    edges{
                        node{
                            id
                            name
                            postsCount
                        }
                    }
                }
            }
        '''

        response = self.client.post('/graphql', {'query': query})

        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)
        self.assertNotIn('errors', content)
        self.assertEqual(content["data"]["categories"]["edges"][0]["node"]["postsCount"], 2)


class CommentTypeTestCase(TestCase):
    def setUp(self):
        self.user = ExtendUser.objects.create_user(username="testuser", password="testpassword", email="test123@test.pl")

        self.category = Category.objects.create(name="Test Category")

        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.post = Post.objects.create(title="Post 1", image_id=self.image.id, category=self.category, is_private=False)
        self.comment = Comment.objects.create(comment="Test Comment", post_id=self.post.id, user_id=self.user.id)

        self.client = Client()

    def test_resolve_comment(self):
        query = '''
            query {
                comments {
                    edges {
                        node {
                            id
                            comment
                            likes
                            dislikes
                            isLiked
                            isDisliked
                            subcomments
                        }
                    }
                }
            }
        '''

        response = self.client.post('/graphql', {'query': query})

        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)


        self.assertEqual(content["data"]["comments"]["edges"][0]["node"]["likes"], 0)
        self.assertEqual(content["data"]["comments"]["edges"][0]["node"]["dislikes"], 0)
        self.assertEqual(content["data"]["comments"]["edges"][0]["node"]["isLiked"], False)
        self.assertEqual(content["data"]["comments"]["edges"][0]["node"]["isDisliked"], False)
        self.assertEqual(content["data"]["comments"]["edges"][0]["node"]["subcomments"], 0)


