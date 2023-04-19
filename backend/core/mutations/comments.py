from django.contrib.auth import get_user_model
from ..types import CommentType
import graphene
from ..models import Post, Comment
from graphql_jwt.decorators import login_required


class CreateCommentMutation(graphene.Mutation):
    class Arguments:
        description = graphene.String(required=True)
        user_id = graphene.ID(required=True)
        post_id = graphene.ID(required=True)

    comment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, description, user_id, post_id):
        user = get_user_model().objects.get(id=user_id)
        post = Post.objects.get(id=post_id)
        comment = Comment(description=description, user=user, post=post)
        comment.save()
        return CreateCommentMutation(comment=comment)


class UpdateCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)
        description = graphene.String()
        user_id = graphene.ID()
        post_id = graphene.ID()

    comment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, comment_id, description, user_id, post_id):
        comment = Comment.objects.get(id=comment_id)
        if description:
            comment.description = description
        if user_id:
            user = get_user_model().objects.get(id=user_id)
            comment.user = user
        if post_id:
            post = Post.objects.get(id=post_id)
            comment.post = post
        comment.save()
        return UpdateCommentMutation(comment=comment)


class UpdateCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID()
        content = graphene.String()

    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, comment_id, content):
        user = info.context.user
        try:
            if user.is_authenticated:
                comment = Comment.objects.get(
                    id=base64.b64decode(comment_id).decode("utf-8").split(":")[1]
                )
                if (
                    comment.user.id != user.id
                    and not user.is_superuser
                    and not user.is_staff
                ):
                    raise Exception("You can only edit your own comments!")
                comment.comment = content
                comment.save()
                return UpdateCommentMutation(success=True, errors=None)
            else:
                raise Exception("Not logged in!")
        except Exception as e:
            return UpdateCommentMutation(success=False, errors=str(e))


class DeleteCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)

    comment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, comment_id):
        user = info.context.user
        try:
            if user.is_authenticated:
                comment = Comment.objects.get(
                    id=base64.b64decode(comment_id).decode("utf-8").split(":")[1]
                )
                if (
                    comment.user.id != user.id
                    and not user.is_superuser
                    and not user.is_staff
                ):
                    raise Exception("You can only delete your own comments!")
                comment.delete()
                return DeleteCommentMutation(success=True, errors=None)
            else:
                raise Exception("Not logged in!")
        except Exception as e:
            return DeleteCommentMutation(success=False, errors=str(e))


class UpdateCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID()
        content = graphene.String()

    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, comment_id, content):
        user = info.context.user
        try:
            if user.is_authenticated:
                comment = Comment.objects.get(
                    id=base64.b64decode(comment_id).decode("utf-8").split(":")[1]
                )
                if (
                    comment.user.id != user.id
                    and not user.is_superuser
                    and not user.is_staff
                ):
                    raise Exception("You can only edit your own comments!")
                comment.comment = content
                comment.save()
                return UpdateCommentMutation(success=True, errors=None)
            else:
                raise Exception("Not logged in!")
        except Exception as e:
            return UpdateCommentMutation(success=False, errors=str(e))
