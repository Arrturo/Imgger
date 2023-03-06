import graphene
from graphene_django import DjangoObjectType
from .models import Post, Category, Image, Comment, Subcomment
from django.contrib.auth.models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = "__all__"


class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = "__all__"


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = "__all__"


class ImageType(DjangoObjectType):
    class Meta:
        model = Image
        fields = "__all__"


class SubcommentType(DjangoObjectType):
    class Meta:
        model = Subcomment
        fields = "__all__"


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
    
schema = graphene.Schema(query=Query)