import json
from graphene_django.utils import GraphQLTestCase
from django.test import Client
from core.models import ExtendUser

class UsersGraphQLTestCase(GraphQLTestCase):
    def setUp(self):
        self.client = Client()
        self.user = ExtendUser.objects.create_user(
            username="testuser",
            password="testpassword",
            email="test123@test.pl",
            is_staff=True,    
        )
        self.user.status.verified = True
        self.user.status.save()
        self.user.save()

    def test_login_and_logout(self):
        mutation = """
            mutation {
                login(username: "testuser", password: "testpassword") {
                    success
                    errors
                    user {
                        username
                    }
                }
            }
        """
        result = self.client.post(
            "/graphql", data={"query": mutation}
        )
        content = json.loads(result.content)  
        self.assertEqual(result.status_code, 200)
        self.assertIn("data", content)
        self.assertIn("login", content["data"])
        self.assertEqual(content["data"]["login"]["success"], True)
        self.assertEqual(content["data"]["login"]["errors"], None)
        self.assertEqual(content["data"]["login"]["user"]["username"], "testuser")

        response = self.client.post("http://localhost:8000/logout/", follow=True)

        self.assertEqual(response.status_code, 200)

        self.assertNotIn("JWT-refresh-token=""", response.cookies)
        self.assertNotIn("JWT-token=""", response.cookies)




