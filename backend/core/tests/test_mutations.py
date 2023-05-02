import base64
import json

from django.test import Client
from graphene_django.utils import GraphQLTestCase

from core.models import Category, Comment, ExtendUser, Image, Post, Subcomment



class ImagesGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        self.user = ExtendUser.objects.create_user(
            username="testuser", password="testpassword", email="test123@test.pl"
        )
        self.user.save()

        self.client = Client()
        self.client.login(username="testuser", password="testpassword")

        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.image.save()

    def test_query(self):
        query = """query {
                        images {
                            name
                            url
                        }
                    }"""

        response = self.client.post("/graphql", data={"query": query})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            json.loads(response.content),
            {
                "data": {
                    "images": [
                        {
                            "name": "TestImage",
                            "url": "sum.jpg",
                        }
                    ]
                }
            },
        )

    def test_create_image_mutation(self):
        with open("core/tests/sum.jpg", "rb") as image:
            response = self.client.post('/graphql', {
                'operations': json.dumps({
                    'query': 'mutation ($file: Upload!) { createImage(image: $file) { success } }',
                    'variables': {
                        'file': None
                    },
                }),
                'map': json.dumps({
                    '0': ['variables.file'],
                }),
                '0': image,
            }, format='multipart')

            self.assertEqual(response.status_code, 200)
            content = json.loads(response.content)
            self.assertIn("data", content)
            self.assertIn("createImage", content["data"])
            self.assertEqual(content["data"]["createImage"]["success"], True)

    def test_update_image_mutation(self):
        image_id = self.image.id
        with open("core/tests/sum.jpg", "rb") as image:
            response = self.client.post('/graphql', {
                'operations': json.dumps({
                    'query': 'mutation ($file: Upload!, $imageId: ID!) { updateImaage(image: $file, imageId: $imageId) { success } }',
                    'variables': {
                        'file': None,
                        'imageId': image_id,
                    },
                }),
                'map': json.dumps({
                    '0': ['variables.file'],
                }),
                '0': image,
            }, format='multipart')
            self.assertEqual(response.status_code, 200)
            content = json.loads(response.content)
            self.assertIn("data", content)
            self.assertIn("updateImaage", content["data"])
            self.assertEqual(content["data"]["updateImaage"]["success"], True)

    def test_delete_image_mutation(self):
        with open("core/tests/sum.jpg", "rb") as image:
            response = self.client.post('/graphql', {
                'operations': json.dumps({
                    'query': 'mutation ($file: Upload!) { createImage(image: $file) { image{ id } success errors  } }',
                    'variables': {
                        'file': None
                    },
                }),
                'map': json.dumps({
                    '0': ['variables.file'],
                }),
                '0': image,
            }, format='multipart')

            self.assertEqual(response.status_code, 200)
            content = json.loads(response.content)
            image_id = content["data"]["createImage"]["image"]["id"]
            mutation = """mutation($imageId: ID!){
                        deleteImage(imageId: $imageId){
                            success
                            errors
                        }
                    }
                """

            variables = {"imageId": image_id}
            result = self.client.post(
                "/graphql",
                data={"query": mutation, "variables": json.dumps(variables)},
            )
            self.assertEqual(result.status_code, 200)
            content = json.loads(result.content)
            self.assertIn("data", content)
            self.assertIn("deleteImage", content["data"])
            self.assertEqual(content["data"]["deleteImage"]["success"], True)
            self.assertEqual(content["data"]["deleteImage"]["errors"], None)



    def test_error_delete_image_mutation(self):
        mutation = """mutation($imageId: ID!){
                        deleteImage(imageId: $imageId){
                            success
                            errors
                        }
                    }
                """

        variables = {"imageId": self.image.id}
        result = self.client.post(
            "/graphql",
            data={"query": mutation, "variables": json.dumps(variables)},
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("deleteImage", content["data"])
        self.assertEqual(content["data"]["deleteImage"]["success"], False)
        self.assertNotEqual(content["data"]["deleteImage"]["errors"], None)

class CategoriesGraphQLTestCase(GraphQLTestCase):
    def setUp(self):
        # Create a user
        self.user = ExtendUser.objects.create_user(
            username="testuser",
            password="testpassword",
            email="test123@test.pl",
            is_staff=True,
        )
        self.user.save()

        self.client = Client()
        self.client.login(username="testuser", password="testpassword")

        self.category = Category.objects.create(name="TestowanieCategory")
        self.category.save()

    def test_create_category_mutation(self):
        mutation = """
            mutation {
                createCategory(name: "TestCategory") {
                    category {
                        id
                        name
                    }
                }
            }
        """
        result = self.client.post("/graphql", data={"query": mutation})
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("category", content["data"]["createCategory"])
        self.assertEqual(
            content["data"]["createCategory"]["category"]["name"], "TestCategory"
        )

    def test_category_query(self):
        query = """
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
        """
        result = self.client.post("/graphql", data={"query": query})
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("categories", content["data"])

    def test_update_category_mutation(self):
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """
            mutation($categoryId: ID!){
                updateCategory(categoryId: $categoryId, name: "test"){
                    category{
                        id
                        name
                    }
                }
            }
        """
        variables = {"categoryId": category_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("updateCategory", content["data"])
        self.assertIn("category", content["data"]["updateCategory"])
        self.assertEqual(content["data"]["updateCategory"]["category"]["name"], "test")

    def test_delete_category_mutation(self):
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """
            mutation($categoryId: ID!){
                deleteCategory(categoryId: $categoryId){
                    success
                }
            }
        """
        variables = {"categoryId": category_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )

        self.assertEqual(result.status_code, 200)

        content = json.loads(result.content)
        self.assertIn("data", content)

        self.assertIn("deleteCategory", content["data"])
        self.assertIn("success", content["data"]["deleteCategory"])
        self.assertEqual(content["data"]["deleteCategory"]["success"], True)




class UsersGraphQLTestCase(GraphQLTestCase):
    def setUp(self):
        # Create a user
        self.user = ExtendUser.objects.create_user(
            username="testuser",
            password="testpassword",
            email="test123@test.pl",
            is_staff=True,
        )
        self.user.save()

        self.client = Client()
        self.client.login(username="testuser", password="testpassword")

    def test_query(self):
        # Create a client

        # Create the query string
        query = """query {
                        me {
                            username
                            email
                        }
                    }"""

        # Make the request
        response = self.client.post("/graphql", data={"query": query})

        # Check the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            json.loads(response.content),
            {"data": {"me": {"username": "testuser", "email": "test123@test.pl"}}},
        )

    def test_login_user_mutaion(self):
        mutation = """mutation{
                        login(username: "testuser", password: "testpassword"){
                            success
                            errors,
                            user{
                            username
                            }
                        }
                    }
                    """

        result = self.client.post("/graphql", data={"query": mutation})
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("login", content["data"])
        self.assertEqual(content["data"]["login"]["success"], True)
        self.assertEqual(content["data"]["login"]["errors"], None)
        self.assertEqual(content["data"]["login"]["user"]["username"], "testuser")

    def test_update_user_mutations(self):
        id = self.user.id
        mutation = """mutation($userId: ID!){
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
        """
        variables = {"userId": id}
        result = self.client.post(
            "/graphql",
            data={"query": mutation, "variables": json.dumps(variables)},
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("updateUser", content["data"])
        self.assertIn("user", content["data"]["updateUser"])
        self.assertEqual(content["data"]["updateUser"]["user"]["username"], "test")
        self.assertEqual(content["data"]["updateUser"]["user"]["email"], "test@test.pl")
        self.assertEqual(content["data"]["updateUser"]["user"]["isStaff"], False)

    def test_delete_user_mutation(self):
        mutation = """mutation($userId: ID!){
                        deleteUser(userId: $userId){
                            user{
                                username
                                email
                            }
                        }
                    }
                """

        variables = {"userId": self.user.id}
        result = self.client.post(
            "/graphql",
            data={"query": mutation, "variables": json.dumps(variables)},
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("deleteUser", content["data"])
        self.assertEqual(content["data"]["deleteUser"]["user"]["username"], "testuser")
        self.assertEqual(
            content["data"]["deleteUser"]["user"]["email"], "test123@test.pl"
        )


class PostsGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        self.user = ExtendUser.objects.create_user(
            username="testuser",
            password="testpassword",
            email="test123@test.pl",
            is_staff=True,
        )
        self.user.save()

        self.client = Client()
        self.client.login(username="testuser", password="testpassword")

        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.image.save()

        self.category = Category.objects.create(name="TestCategory")
        self.category.save()

        self.post = Post.objects.create(
            title="TestPost",
            description="TestDescription",
            image=self.image,
            category=self.category,
            user=self.user,
            is_private=False,
        )
        self.post.save()

    def test_query(self):
        query = """query{
                    posts{
                        edges{
                            node{
                                id,
                                description,
                                title,
                                image {
                                    name
                                }
                                category{
                                    name
                                }
                            }
                        }
                        }
                    }
                """

        result = self.client.post("/graphql", data={"query": query})
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("posts", content["data"])
        self.assertIn("edges", content["data"]["posts"])
        self.assertIn("node", content["data"]["posts"]["edges"][0])
        self.assertEqual(
            content["data"]["posts"]["edges"][0]["node"]["description"],
            "TestDescription",
        )
        self.assertEqual(
            content["data"]["posts"]["edges"][0]["node"]["title"], "TestPost"
        )
        self.assertEqual(
            content["data"]["posts"]["edges"][0]["node"]["image"]["name"], "TestImage"
        )
        self.assertEqual(
            content["data"]["posts"]["edges"][0]["node"]["category"]["name"],
            "TestCategory",
        )

    def test_create_post_with_image_mutation(self):
        image_id = str(self.image.id)
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """mutation($categoryId: ID!, $imageId: String!){
                        createPost(title: "test", description: "testowanie", imageId: $imageId, categoryId: $categoryId, isPrivate: false){
                            post{
                                title
                                description
                                image{
                                    name
                                }
                            }
                            errors
                            success
                        }
                        }
                    """

        variables = {
            "imageId": image_id,
            "categoryId": category_id,
        }
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("createPost", content["data"])
        self.assertIn("post", content["data"]["createPost"])
        self.assertEqual(content["data"]["createPost"]["post"]["title"], "test")
        self.assertEqual(
            content["data"]["createPost"]["post"]["description"], "testowanie"
        )
        self.assertEqual(
            content["data"]["createPost"]["post"]["image"]["name"], "TestImage"
        )
        self.assertEqual(content["data"]["createPost"]["success"], True)

    def test_error_create_post_mutation(self):
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """mutation($categoryId: ID!){
                        createPost(title: "test", description: "testowanie", imageId: "", categoryId: $categoryId, isPrivate: false){
                            post{
                                title
                                description
                            }
                            errors
                            success
                        }
                        }
                    """

        variables = {
            "categoryId": category_id,
        }
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("createPost", content["data"])
        self.assertIn("post", content["data"]["createPost"])
        self.assertNotEqual(content["data"]["createPost"]["errors"], None)
        self.assertEqual(content["data"]["createPost"]["success"], False)

    def test_like_post_mutation(self):
        post_id = str(
            base64.b64encode(
                "CategoryType:{}".format(self.post.id).encode("utf-8")
            ).decode("utf-8")
        )

        mutation = """ mutation($postId: String!){
                            like(postId: $postId){
                                success
                                errors
                            }
                        }
                        """

        variables = {"postId": post_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("like", content["data"])
        self.assertEqual(content["data"]["like"]["success"], True)

    def test_dislike_post_mutation(self):
        post_id = str(
            base64.b64encode(
                "CategoryType:{}".format(self.post.id).encode("utf-8")
            ).decode("utf-8")
        )

        mutation = """ mutation($postId: String!){
                    dislike(postId: $postId){
                        success
                        errors
                    }
                }
                """
        variables = {"postId": post_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("dislike", content["data"])
        self.assertEqual(content["data"]["dislike"]["success"], True)

    def test_update_post_mutation(self):
        post_id = str(
            base64.b64encode(
                "CategoryType:{}".format(self.post.id).encode("utf-8")
            ).decode("utf-8")
        )
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """ mutation($postId: ID!, $categoryId: ID!){
                    updatePost(postId: $postId, title: "test", description: "testowanie", categoryId: $categoryId){
                        post{
                            title
                            description
                        }
                        errors
                        success
                    }
                }
                """
        variables = {"postId": post_id, "categoryId": category_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("updatePost", content["data"])
        self.assertIn("post", content["data"]["updatePost"])
        self.assertEqual(content["data"]["updatePost"]["post"]["title"], "test")
        self.assertEqual(
            content["data"]["updatePost"]["post"]["description"], "testowanie"
        )
        self.assertEqual(content["data"]["updatePost"]["success"], True)

    def test_delete_mutation(self):
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        with open("core/tests/sum.jpg", "rb") as image:
            response = self.client.post('/graphql', {
                'operations': json.dumps({
                    'query': 'mutation ($file: Upload!) { createImage(image: $file) { image{ id } success errors  } }',
                    'variables': {
                        'file': None
                    },
                }),
                'map': json.dumps({
                    '0': ['variables.file'],
                }),
                '0': image,
            }, format='multipart')

            self.assertEqual(response.status_code, 200)
            content = json.loads(response.content)
            image_id = content["data"]["createImage"]["image"]["id"]

            mutation = """mutation($categoryId: ID!, $imageId: String!){
                            createPost(title: "test", description: "testowanie", imageId: $imageId, categoryId: $categoryId, isPrivate: false){
                                post{
                                    id
                                    title
                                    description
                                }
                                errors
                            success
                        }
                        }
                     """

            variables = {
                "categoryId": category_id,
                "imageId": image_id,
            }
            result = self.client.post(
                "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
            )
            self.assertEqual(result.status_code, 200)
            content = json.loads(result.content)
            post_id = content["data"]["createPost"]["post"]["id"]
            mutation = """ mutation($postId: ID!){
                    deletePost(postId: $postId){
                        success
                        errors
                    }
                }
                """
        
            variables = {"postId": post_id}
            result = self.client.post(
                "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
            )
            self.assertEqual(result.status_code, 200)
            content = json.loads(result.content)
            self.assertIn("data", content)
            self.assertIn("deletePost", content["data"])
            self.assertEqual(content["data"]["deletePost"]["success"], True)
            self.assertEqual(content["data"]["deletePost"]["errors"], None)


    def test_errors_delete_post_mutation(self):
        post_id = str(
            base64.b64encode(
                "CategoryType:{}".format(self.post.id).encode("utf-8")
            ).decode("utf-8")
        )
        mutation = """ mutation($postId: ID!){
                    deletePost(postId: $postId){
                        success
                        errors
                    }
                }
                """
        
        variables = {"postId": post_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("deletePost", content["data"])
        self.assertEqual(content["data"]["deletePost"]["success"], False)
        self.assertNotEqual(content["data"]["deletePost"]["errors"], None)


class AnonymousPostsGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        self.client = Client()

        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.image.save()

        self.category = Category.objects.create(name="TestCategory")
        self.category.save()

    def test_create_post_with_image_mutation(self):
        image_id = str(self.image.id)
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """mutation($imageId: String!, $categoryId: ID!){
                        createPost(title: "test", description: "testowanie", categoryId: $categoryId, imageId: $imageId, isPrivate: true){
                            post{
                                title
                                description
                                image{
                                    name
                                }
                            }
                            errors
                            success
                        }
                        }
                    """

        variables = {
            "imageId": image_id,
            "categoryId": category_id,
        }
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("createPost", content["data"])
        self.assertIn("post", content["data"]["createPost"])
        self.assertEqual(content["data"]["createPost"]["post"]["title"], "test")
        self.assertEqual(
            content["data"]["createPost"]["post"]["description"], "testowanie"
        )
        self.assertEqual(
            content["data"]["createPost"]["post"]["image"]["name"], "TestImage"
        )
        self.assertEqual(content["data"]["createPost"]["success"], True)

    def test_error_create_post_mutation(self):
        category_id = base64.b64encode(
            "CategoryType:{}".format(self.category.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """mutation($categoryId: ID!){
                        createPost(title: "test", description: "testowanie", imageId: "", categoryId: $categoryId, isPrivate: false){
                            post{
                                title
                                description
                            }
                            errors
                            success
                        }
                        }
                    """

        variables = {
            "categoryId": category_id,
        }
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("createPost", content["data"])
        self.assertIn("post", content["data"]["createPost"])
        self.assertNotEqual(content["data"]["createPost"]["errors"], None)
        self.assertEqual(content["data"]["createPost"]["success"], False)

    



class CommentsGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        self.user = ExtendUser.objects.create_user(
            username="testuser",
            password="testpassword",
            email="test123@test.pl",
            is_staff=True,
        )
        self.user.save()

        self.client = Client()
        self.client.login(username="testuser", password="testpassword")

        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.image.save()

        self.category = Category.objects.create(name="TestCategory")
        self.category.save()

        self.post = Post.objects.create(
            title="TestPost",
            description="TestDescription",
            user=self.user,
            category=self.category,
            image=self.image,
            is_private=False,
        )
        self.post.save()

        self.comment = Comment.objects.create(
            user=self.user, comment="TestComment", post=self.post
        )
        self.comment.save()

    def test_get_comments_query(self):
        post_id = str(
            base64.b64encode(
                "CategoryType:{}".format(self.post.id).encode("utf-8")
            ).decode("utf-8")
        )
        query = """query($postId: String!){
                    commentsByPost(postId: $postId){
                        edges{
                            node{
                                user {
                                    id
                                    username
                                }
                                id
                                comment
                                createTime
                                }
                            }
                        }
                    }
                """
        variables = {"postId": post_id}
        result = self.client.post(
            "/graphql", data={"query": query, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("commentsByPost", content["data"])
        self.assertIn("edges", content["data"]["commentsByPost"])
        self.assertIn("node", content["data"]["commentsByPost"]["edges"][0])
        self.assertIn("user", content["data"]["commentsByPost"]["edges"][0]["node"])
        self.assertEqual(
            content["data"]["commentsByPost"]["edges"][0]["node"]["user"]["username"],
            "testuser",
        )
        self.assertIn("id", content["data"]["commentsByPost"]["edges"][0]["node"])
        self.assertEqual(
            content["data"]["commentsByPost"]["edges"][0]["node"]["comment"],
            "TestComment",
        )
        self.assertIn(
            "createTime", content["data"]["commentsByPost"]["edges"][0]["node"]
        )

    def test_create_comment_mutation(self):
        post_id = base64.b64encode(
            "CategoryType:{}".format(self.post.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """mutation($userId: ID!, $postId: ID!){
                        createComment(postId: $postId, userId: $userId, comment: "test"){
                            success
                            errors
                        }
                    }
                """

        variables = {"userId": self.user.id, "postId": post_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("createComment", content["data"])
        self.assertEqual(content["data"]["createComment"]["success"], True)

    def test_delete_comment_mutation(self):
        comment_id = base64.b64encode(
            "CategoryType:{}".format(self.comment.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """mutation($commentId: ID!){
                            deleteComment(commentId: $commentId){
                                success
                                errors
                            }
                        }
                        """

        variables = {"commentId": comment_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("deleteComment", content["data"])
        self.assertEqual(content["data"]["deleteComment"]["success"], True)

    def test_update_comment_mutations(self):
        comment_id = base64.b64encode(
            "CategoryType:{}".format(self.comment.id).encode("utf-8")
        ).decode("utf-8")
        mutation = """mutation($commentId: ID!){
                            updateComment(commentId: $commentId, content: "TestUpdateComment"){
                                success
                                errors
                            }
                        }
                        """

        variables = {"commentId": comment_id}
        result = self.client.post(
            "/graphql", data={"query": mutation, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("updateComment", content["data"])
        self.assertEqual(content["data"]["updateComment"]["success"], True)


class SubCommentsGraphQLTestCase(GraphQLTestCase):
    def setUp(self):
        self.user = ExtendUser.objects.create_user(
            username="testuser", password="testpassword", email="test123@test.pl"
        )
        self.user.save()

        self.image = Image.objects.create(name="TestImage", url="sum.jpg")
        self.image.save()

        self.category = Category.objects.create(name="TestCategory")
        self.category.save()

        self.post = Post.objects.create(
            title="TestPost",
            description="TestDescription",
            user=self.user,
            image=self.image,
            category=self.category,
        )
        self.post.save()

        self.comment = Comment.objects.create(
            user=self.user, comment="TestComment", post=self.post
        )
        self.comment.save()

        self.subcomment = Subcomment.objects.create(
            user=self.user, comment=self.comment, content="TestSubComment"
        )
        self.subcomment.save()

    def test_get_subcomments_query(self):
        comment_id = base64.b64encode(
            "CategoryType:{}".format(self.comment.id).encode("utf-8")
        ).decode("utf-8")
        query = """query($commentId: String!){
                  subcommentsByComment(commentId: $commentId){
                      edges{
                          node{
                              user {
                                  id
                                  username
                              }
                              id
                              content
                              createTime
                              }
                          }
                      }
                  }
                """
            
        variables = {"commentId": comment_id}
        result = self.client.post(
            "/graphql", data={"query": query, "variables": json.dumps(variables)}
        )
        self.assertEqual(result.status_code, 200)
        content = json.loads(result.content)
        self.assertIn("data", content)
        self.assertIn("subcommentsByComment", content["data"])
        self.assertIn("edges", content["data"]["subcommentsByComment"])
        self.assertIn("node", content["data"]["subcommentsByComment"]["edges"][0])
        self.assertIn("user", content["data"]["subcommentsByComment"]["edges"][0]["node"])
        self.assertIn(content["data"]["subcommentsByComment"]["edges"][0]["node"]["content"],"TestSubComment")

          

