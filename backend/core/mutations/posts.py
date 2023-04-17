import base64

import graphene
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required

from ..models import Category, ExtendUser, Image, Post
from ..types import PostType


class CreatePostMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        user_id = graphene.ID(required=True)
        image_id = graphene.String(required=True)
        category_id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.String()
    post = graphene.Field(PostType)

    @login_required
    def mutate(self, info, title, description, user_id, image_id, category_id):
        try:
            user = ExtendUser.objects.get(id=user_id)
            category_id = Category.objects.get(
                id=base64.b64decode(category_id).decode("utf-8").split(":")[1]
            )
            if image_id:
                image = Image.objects.get(id=image_id)
                post = Post(
                    title=title,
                    description=description,
                    user=user,
                    image=image,
                    category=category_id,
                )
            else:
                post = Post(
                    title=title,
                    description=description,
                    user=user,
                    category=category_id,
                )
            post.save()
            print(post)
            return CreatePostMutation(success=True, post=post)
        except Exception as e:
            return CreatePostMutation(success=False, errors=str(e))


class UpdatePostMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        user_id = graphene.ID()
        image_id = graphene.ID()
        category_id = graphene.ID()

    post = graphene.Field(PostType)

    @login_required
    def mutate(self, info, post_id, title, description, user_id, image_id, category_id):
        post = Post.objects.get(id=post_id)
        if title:
            post.title = title
        if description:
            post.description = description
        if user_id:
            user = get_user_model().objects.get(id=user_id)
            post.user = user
        if image_id:
            image = Image.objects.get(id=image_id)
            post.image = image
        if category_id:
            category = Category.objects.get(id=category_id)
            post.category = category
        post.save()
        return UpdatePostMutation(post=post)


class DeletePostMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)

    post = graphene.Field(PostType)

    @login_required
    def mutate(self, info, post_id):
        post = Post.objects.get(id=post_id)
        post.delete()
        return DeletePostMutation(post=post)


class like(graphene.Mutation):
    class Arguments:
        post_id = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, post_id):
        user = info.context.user

        if not user.is_authenticated:
            return like(success=False, errors="User not logged in")

        post = Post.objects.get(
            id=base64.b64decode(post_id).decode("utf-8").split(":")[1]
        )

        if user in post.likes.all():
            post.likes.remove(user)
        else:
            post.likes.add(user)
        post.save()
        return like(success=True)


class dislike(graphene.Mutation):
    class Arguments:
        post_id = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, post_id):
        user = info.context.user

        if not user.is_authenticated:
            return dislike(success=False, errors="User not logged in")

        post = Post.objects.get(
            id=base64.b64decode(post_id).decode("utf-8").split(":")[1]
        )

        if user in post.dislikes.all():
            post.dislikes.remove(user)
        else:
            post.dislikes.add(user)
        post.save()
        return dislike(success=True)
