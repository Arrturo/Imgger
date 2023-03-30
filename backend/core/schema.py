import graphene
from django.contrib.auth.models import User
from graphene_django.filter import DjangoFilterConnectionField
from graphql_auth import mutations
from graphql_auth.schema import MeQuery, UserQuery
import base64

from .models import Category, Comment, Image, Post, Subcomment
from .mutations.categories import (CreateCategoryMutation,
                                   DeleteCategoryMutation,
                                   UpdateCategoryMutation)
from .mutations.comments import (CreateCommentMutation, DeleteCommentMutation,
                                 UpdateCommentMutation)
from .mutations.images import CreateImageMutation, DeleteImageMutation
from .mutations.posts import (CreatePostMutation, DeletePostMutation,
                              UpdatePostMutation, dislike, like)
from .mutations.subcomments import (CreateSubCommentMutation,
                                    DeleteSubCommentMutation,
                                    UpdateSubCommentMutation)
from .mutations.users import (CreateUserMutation, DeleteUserMutation,
                              UpdateUserMutation)
from .types import (CategoryType, CommentType, ImageType, PostType,
                    SubcommentType, UserType)


class Query(UserQuery, MeQuery, graphene.ObjectType):
    users = graphene.List(UserType)
    users_by_id = graphene.Field(UserType, id=graphene.ID(required=True))
    posts = DjangoFilterConnectionField(PostType)
    post_by_id = graphene.Field(PostType, id=graphene.String())
    categories = DjangoFilterConnectionField(CategoryType)
    images = graphene.List(ImageType)
    comments = DjangoFilterConnectionField(CommentType)
    subcomments = DjangoFilterConnectionField(SubcommentType)

    def resolve_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_users_by_id(self, info, id):
        return User.objects.get(pk=id)

    def resolve_posts(self, info, **kwargs):
        return Post.objects.all()

    def resolve_post_by_id(self, info, id):
        post_id = base64.b64decode(id).decode("utf-8").split(':')[1]
        post_id = int(post_id)
        return Post.objects.get(pk=post_id)

    def resolve_posts_by_category(self, info, **kwargs):
        return Post.objects.filter(category=kwargs['category'])

    def resolve_categories_by_id(self, info, id):
        return Category.objects.get(pk=id)

    def resolve_categories(self, info, **kwargs):
        return Category.objects.all().order_by('name')

    def resolve_comments(self, info, **kwargs):
        return Comment.objects.all()

    def resolve_subcomments(self, info, **kwargs):
        return Subcomment.objects.all()

    def resolve_images(self, info, **kwargs):
        return Image.objects.all()


class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    update_account = mutations.UpdateAccount.Field()
    # resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()


class Mutation(AuthMutation, graphene.ObjectType):
    create_user = CreateUserMutation.Field()
    update_user = UpdateUserMutation.Field()
    delete_user = DeleteUserMutation.Field()
    create_post = CreatePostMutation.Field()
    update_post = UpdatePostMutation.Field()
    delete_post = DeletePostMutation.Field()
    update_post = UpdatePostMutation.Field()
    delete_post = DeletePostMutation.Field()
    like = like.Field()
    dislike = dislike.Field()
    create_category = CreateCategoryMutation.Field()
    update_category = UpdateCategoryMutation.Field()
    delete_category = DeleteCategoryMutation.Field()
    create_comment = CreateCommentMutation.Field()
    update_comment = UpdateCommentMutation.Field()
    delete_comment = DeleteCommentMutation.Field()
    create_subcomment = CreateSubCommentMutation.Field()
    update_subcomment = UpdateSubCommentMutation.Field()
    delete_subcomment = DeleteSubCommentMutation.Field()
    create_image = CreateImageMutation.Field()
    delete_image = DeleteImageMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
