import base64

import graphene
from django.contrib.auth import get_user_model
from firebase_admin import storage
from graphql_jwt.decorators import login_required, staff_member_required

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
    def mutate(self, info, title, description, image_id, category_id):
        try:
            user = info.context.user
            if not user.is_anonymous:
                category_id = Category.objects.get(
                    id=base64.b64decode(category_id).decode("utf-8").split(":")[1]
                )
                if image_id:
                    image = Image.objects.get(id=image_id)
                    post = Post(
                        title=title,
                        description=description,
                        user=info.context.user,
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
            else:
                category_id = Category.objects.get(
                    id=base64.b64decode(category_id).decode("utf-8").split(":")[1]
                )
                if image_id:
                    image = Image.objects.get(id=image_id)
                    post = Post(
                        title=title,
                        description=description,
                        user=None,
                        image=image,
                        category=category_id,
                        is_private=True,
                    )
                else:
                    post = Post(
                        title=title,
                        description=description,
                        user=None,
                        category=category_id,
                        is_private=True,
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

    success = graphene.Boolean()
    errors = graphene.String()

    @staff_member_required
    @login_required
    def mutate(self, info, post_id):
        try:
            user = info.context.user
            id = base64.b64decode(post_id).decode("utf-8").split(":")[1]
            post = Post.objects.get(id=id)
            if not user.is_staff:
                return DeletePostMutation(success=False, errors="User not staff")
            if post.user != user:
                return DeletePostMutation(success=False, errors="User not owner")
            if post.image:
                image = post.image
            post.delete()
            if image:
                bucket = storage.bucket()
                url = image.url.split("/")[-1]
                blob = bucket.blob(url)
                blob.delete()
                image.delete()
            return DeletePostMutation(success=True)
        except Exception as e:
            return DeletePostMutation(success=False, errors=str(e))


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
