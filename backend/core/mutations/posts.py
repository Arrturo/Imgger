from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from ..types import PostType
import graphene
from ..models import Post, Category, Image

class CreatePostMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        user_id = graphene.ID(required=True)
        image_id = graphene.ID()
        category_id = graphene.ID(required=True)
        likes = graphene.Int()
        dislikes = graphene.Int()

    post = graphene.Field(PostType)

    def mutate(self, info, title, description, user_id, image_id, category_id, likes=None, dislikes=None):
        user = User.objects.get(id=user_id)
        if image_id:
            image = Image.objects.get(id=image_id)
        else:
            image = None
        category = Category.objects.get(id=category_id)
        post = Post(title=title, description=description, user=user, image=image, category=category, likes=likes, dislikes=dislikes)
        post.save()
        return CreatePostMutation(post=post)
    
class UpdatePostMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        user_id = graphene.ID()
        image_id = graphene.ID()
        category_id = graphene.ID()

    post = graphene.Field(PostType)

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

    def mutate(self, info, post_id):
        post = Post.objects.get(id=post_id)
        post.delete()
        return DeletePostMutation(post=post)
    
class like(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
    post = graphene.Field(PostType)
    def mutate(self, info, post_id):
        post = Post.objects.get(id=post_id)
        post.likes += 1
        post.save()
        return like(post=post)
    
class dislike(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
    post = graphene.Field(PostType)
    def mutate(self, info, post_id):
        post = Post.objects.get(id=post_id)
        post.dislikes += 1
        post.save()
        return dislike(post=post)