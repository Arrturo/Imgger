import graphene
from graphene_django import DjangoObjectType
from .models import Post, Category, Image, Comment, Subcomment
from django.contrib.auth.models import User
from .mutations.users import CreateUserMutation, UpdateUserMutation, DeleteUserMutation
from .mutations.posts import CreatePostMutation, UpdatePostMutation, DeletePostMutation
from .mutations.categories import CreateCategoryMutation, UpdateCategoryMutation, DeleteCategoryMutation
from .mutations.comments import CreateCommentMutation, UpdateCommentMutation, DeleteCommentMutation
from .mutations.subcomments import CreateSubCommentMutation, UpdateSubCommentMutation, DeleteSubCommentMutation
from .types import UserType, PostType, CategoryType, CommentType, ImageType, SubcommentType
from .mutations.users import CreateUserMutation, UpdateUserMutation, DeleteUserMutation
from .mutations.posts import CreatePostMutation, UpdatePostMutation, DeletePostMutation
from .mutations.categories import CreateCategoryMutation, UpdateCategoryMutation, DeleteCategoryMutation
from .mutations.comments import CreateCommentMutation, UpdateCommentMutation, DeleteCommentMutation
from .mutations.subcomments import CreateSubCommentMutation, UpdateSubCommentMutation, DeleteSubCommentMutation
from .types import UserType, PostType, CategoryType, CommentType, ImageType, SubcommentType


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    posts = graphene.List(PostType)
    categories = graphene.List(CategoryType)
    images = graphene.List(ImageType)
    comments = graphene.List(CommentType)
    subcomments = graphene.List(SubcommentType)

    def resolve_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_posts(self, info, **kwargs):
        return Post.objects.all()

    def resolve_categories(self, info, **kwargs):
        return Category.objects.all()

    def resolve_comments(self, info, **kwargs):
        return Comment.objects.all()

    def resolve_subcomments(self, info, **kwargs):
        return Subcomment.objects.all()

    def resolve_images(self, info, **kwargs):
        return Image.objects.all()

class Mutation(graphene.ObjectType):
    create_user = CreateUserMutation.Field()
    update_user = UpdateUserMutation.Field()
    delete_user = DeleteUserMutation.Field()
    create_post = CreatePostMutation.Field()
    update_post = UpdatePostMutation.Field()
    delete_post = DeletePostMutation.Field()
    update_post = UpdatePostMutation.Field()
    delete_post = DeletePostMutation.Field()
    create_category = CreateCategoryMutation.Field()
    update_category = UpdateCategoryMutation.Field()
    delete_category = DeleteCategoryMutation.Field()
    
schema = graphene.Schema(query=Query, mutation=Mutation)