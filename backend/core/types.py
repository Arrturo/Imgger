from graphene_django import DjangoObjectType
from .models import User, Post, Category, Comment, Image, Subcomment
import graphene

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = "__all__"

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = "__all__"
        filter_fields = {
            'id': ['exact'],
            'title': ['exact', 'icontains', 'istartswith'],
            'description': ['exact', 'icontains', 'istartswith'],
        }
        interfaces = (graphene.relay.Node, )
        

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"

        filter_fields = {
            'name': ['exact', 'icontains', 'istartswith'],
        }

        interfaces = (graphene.relay.Node, )
    


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