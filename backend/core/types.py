import graphene
from graphene_django import DjangoObjectType

from .models import Category, Comment, ExtendUser, Image, Post, Subcomment


class UserType(DjangoObjectType):
    class Meta:
        model = ExtendUser
        fields = "__all__"


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = "__all__"
        filter_fields = {
            "comment": ["exact", "icontains", "istartswith"],
        }
        interfaces = (graphene.relay.Node,)


class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = "__all__"
        filter_fields = {
            "id": ["exact"],
            "title": ["exact", "icontains", "istartswith"],
            "description": ["exact", "icontains", "istartswith"],
        }
        interfaces = (graphene.relay.Node,)

    likes = graphene.Int()
    dislikes = graphene.Int()
    is_liked = graphene.Boolean()
    is_disliked = graphene.Boolean()
    comments_count = graphene.Int()
    previous_post = graphene.Field(lambda: PostType)
    next_post = graphene.Field(lambda: PostType)

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

    def resolve_comments_count(self, info, **kwargs):
        return Comment.objects.filter(post=self.id).count()

    def resolve_previous_post(self, info, **kwargs):
        previous_post = (
            Post.objects.filter(id__gt=self.id).order_by("create_time").first()
        )
        if previous_post:
            return previous_post
        else:
            previous_post = Post.objects.order_by("create_time").first()
            return previous_post

    def resolve_next_post(self, info, **kwargs):
        next_post = (
            Post.objects.filter(id__lt=self.id).order_by("-create_time").first()
        )
        if next_post:
            return next_post
        else:
            next_post = Post.objects.order_by("-create_time").first()
            return next_post


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"
        filter_fields = {
            "name": ["exact", "icontains", "istartswith"],
        }
        interfaces = (graphene.relay.Node,)


class ImageType(DjangoObjectType):
    class Meta:
        model = Image
        fields = "__all__"


class SubcommentType(DjangoObjectType):
    class Meta:
        model = Subcomment
        fields = "__all__"
        filter_fields = {
            "content": ["exact", "icontains", "istartswith"],
        }
        interfaces = (graphene.relay.Node,)
