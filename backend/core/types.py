from graphene_django import DjangoObjectType
from .models import ExtendUser, Post, Category, Comment, Image, Subcomment
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

    likes = graphene.Int()
    dislikes = graphene.Int()
    is_liked = graphene.Boolean()
    is_disliked = graphene.Boolean()

    def resolve_likes(self, info, **kwargs):
        return self.likes.count()

    def resolve_dislikes(self, info, **kwargs):
        return self.dislikes.count()

    def resolve_is_liked(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            return False
        return self.likes.filter(id=user.id).exists()

    def resolve_is_disliked(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            return False
        return self.dislikes.filter(id=user.id).exists()


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
