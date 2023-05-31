from django.test import TestCase, Client
from django.core.cache import cache
from datetime import datetime, timedelta
from core.schema import can_increase_views, Query
from core.models import Category, Post, Image, ExtendUser
import base64
import json

class SchemaTestCase(TestCase):
    def test_can_increase_views(self):
        cache.set('last_increase_time', datetime.now() - timedelta(minutes=2))
        self.assertTrue(can_increase_views())

        cache.set('last_increase_time', datetime.now() - timedelta(seconds=30))
        self.assertFalse(can_increase_views())

        cache.set('last_increase_time', None)
        self.assertTrue(can_increase_views())
    
    def test_resolve_posts_by_popularity(self):
        self.user = ExtendUser.objects.create_user(username="testuser")
        self.category = Category.objects.create(name="Test Category")
        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.post1 = Post.objects.create(title="Test Post1", category_id=self.category.id, image_id=self.image.id, user_id=self.user.id, is_private=False, short_url="testpost1")
        self.post2 = Post.objects.create(title="Test Post2", category_id=self.category.id, image_id=self.image.id, user_id=self.user.id, is_private=False, short_url="testpost2")
        self.post3 = Post.objects.create(title="Test Post3", category_id=self.category.id, image_id=self.image.id, user_id=self.user.id, is_private=False, short_url="testpost3")
        self.post1.likes.set = 5
        self.post2.likes.set = 2

        class FakeInfo:
            def __init__(self):
                self.context = None

        resolved_posts = Query.resolve_posts_by_popularity(FakeInfo(), None)

        self.assertEqual(resolved_posts[0].title, "Test Post1")
        self.assertEqual(resolved_posts[1].title, "Test Post2")
        self.assertEqual(resolved_posts[2].title, "Test Post3")

    def test_resolve_posts_by_id(self):
        self.user = ExtendUser.objects.create_user(username="testuser")
        self.category = Category.objects.create(name="Test Category")
        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.post = Post.objects.create(title="Test Post1", category_id=self.category.id, image_id=self.image.id, user_id=self.user.id, is_private=False, short_url="testpost1", views=0)
        self.client = Client()

        
        query = """query {
                    postsById(id: "%s") {
                        id
                        title
                        views
                    }
                }
            """% (base64.b64encode(f"Post:{self.post.pk}".encode("utf-8")).decode("utf-8"))
        
        result = self.client.post("/graphql", data={"query": query})
        self.assertEqual(result.status_code, 200)
        data = result.json().get("data", {})
        post_data = data.get("postsById", {})
        self.assertEqual(post_data.get("views"), 1)
        