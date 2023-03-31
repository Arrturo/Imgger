from graphene_django import DjangoObjectType
from .models import ExtendUser, Post, Category, Comment, Image, Subcomment
from graphene_django.filter import DjangoFilterConnectionField
import graphene


class UserType(DjangoObjectType):
    class Meta:
        model = ExtendUser
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

    posts = DjangoFilterConnectionField(PostType)

    def resolve_posts(self, info, **kwargs):
        return Post.objects.filter(category=self)

        filter_fields = {
            'name': ['exact', 'icontains', 'istartswith'],
        }

        interfaces = (graphene.relay.Node, )
    

class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = "__all__"
        filter_fields = {
            'comment': ['exact', 'icontains', 'istartswith'],
        }
        interfaces = (graphene.relay.Node, )


class ImageType(DjangoObjectType):
    class Meta:
        model = Image
        fields = "__all__"


class SubcommentType(DjangoObjectType):
    class Meta:
        model = Subcomment
        fields = "__all__"
        filter_fields = {
            'content': ['exact', 'icontains', 'istartswith'],
        }
        interfaces = (graphene.relay.Node, )
