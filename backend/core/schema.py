import base64

import graphene
from graphene_django.filter import DjangoFilterConnectionField
from graphql_auth import mutations
from graphql_auth.schema import MeQuery, UserQuery

from .models import Category, Comment, ExtendUser, Image, Post, Subcomment
from .mutations.categories import (CreateCategoryMutation,
                                   DeleteCategoryMutation,
                                   UpdateCategoryMutation)
from .mutations.comments import CreateCommentMutation
from .mutations.images import (CreateImageMutation, DeleteImageMutation,
                               UpdateImageMutation)
from .mutations.posts import (CreatePostMutation, DeletePostMutation,
                              UpdatePostMutation, dislike, like)
from .mutations.subcomments import (CreateSubCommentMutation,
                                    DeleteSubCommentMutation,
                                    UpdateSubCommentMutation)
from .mutations.users import (DeleteUserMutation, LoginMutation,
                              UpdateUserMutation)
from .types import (CategoryType, CommentType, ImageType, PostType,
                    SubcommentType, UserType)


class Query(UserQuery, MeQuery, graphene.ObjectType):
    users = graphene.List(UserType)
    me = graphene.Field(UserType)
    users_by_id = graphene.Field(UserType, id=graphene.ID(required=True))
    posts = DjangoFilterConnectionField(PostType)
    posts_by_id = graphene.Field(PostType, id=graphene.String(required=True))
    categories = DjangoFilterConnectionField(CategoryType)
    images = graphene.List(ImageType)
    comments = DjangoFilterConnectionField(CommentType)
    comments_by_post = DjangoFilterConnectionField(
        CommentType, post_id=graphene.ID(required=True)
    )
    subcomments = DjangoFilterConnectionField(SubcommentType)

    def resolve_users(self, info, **kwargs):
        return ExtendUser.objects.all().order_by("id")

    def resolve_me(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Not logged in!")
        return user

    def resolve_users_by_id(self, info, id):
        return ExtendUser.objects.get(pk=id)

    def resolve_posts(self, info, **kwargs):
        return Post.objects.all().order_by("-create_time")

    def resolve_posts_by_category(self, info, **kwargs):
        return Post.objects.filter(category=kwargs["category"])

    def resolve_categories_by_id(self, info, id):
        return Category.objects.get(pk=id)

    def resolve_posts_by_id(self, info, id, **kwargs):
        post_id = base64.b64decode(id).decode("utf-8").split(":")[1]
        post_id = int(post_id)
        return Post.objects.get(pk=post_id)

    def resolve_comments(self, info, **kwargs):
        return Comment.objects.all()

    def resolve_comments_by_post(self, info, post_id, **kwargs):
        post_id = base64.b64decode(post_id).decode("utf-8").split(":")[1]
        post_id = int(post_id)
        return Comment.objects.filter(post=post_id).order_by("create_time")

    def resolve_subcomments(self, info, **kwargs):
        return Subcomment.objects.all()

    def resolve_images(self, info, **kwargs):
        return Image.objects.all()


class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    update_account = mutations.UpdateAccount.Field()
    # resend_activation_email = mutations.ResendActivationEmail.Field()
    verify_account = mutations.VerifyAccount.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()


class Mutation(AuthMutation, graphene.ObjectType):
    login = LoginMutation.Field()
    update_user = UpdateUserMutation.Field()
    delete_user = DeleteUserMutation.Field()

    create_post = CreatePostMutation.Field()
    update_post = UpdatePostMutation.Field()
    delete_post = DeletePostMutation.Field()

    like = like.Field()
    dislike = dislike.Field()

    create_category = CreateCategoryMutation.Field()
    update_category = UpdateCategoryMutation.Field()
    delete_category = DeleteCategoryMutation.Field()

    create_comment = CreateCommentMutation.Field()

    create_subcomment = CreateSubCommentMutation.Field()
    update_subcomment = UpdateSubCommentMutation.Field()
    delete_subcomment = DeleteSubCommentMutation.Field()

    create_image = CreateImageMutation.Field()
    update_imaage = UpdateImageMutation.Field()
    delete_image = DeleteImageMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
