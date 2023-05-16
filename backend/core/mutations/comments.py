import base64

import graphene
from graphql_jwt.decorators import login_required

from ..models import Comment, ExtendUser, Post


class CreateCommentMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID()
        comment = graphene.String()
        user_id = graphene.ID()

    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, post_id, comment, user_id):
        try:
            user = ExtendUser.objects.get(id=user_id)
            post = Post.objects.get(
                id=base64.b64decode(post_id).decode("utf-8").split(":")[1]
            )
            comment = Comment(comment=comment, user=user, post=post)
            comment.save()
            return CreateCommentMutation(success=True, errors=None)
        except Exception as e:
            return CreateCommentMutation(success=False, errors=str(e))


class DeleteCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID()

    success = graphene.Boolean()
    errors = graphene.String()

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


class LikeCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.String()

    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, comment_id):
        try:
            user = info.context.user
            comment = Comment.objects.get(
                id=base64.b64decode(comment_id).decode("utf-8").split(":")[1]
            )
            if user in comment.likes.all():
                comment.likes.remove(user)
                comment.save()
                return LikeCommentMutation(success=True, errors=None)
            comment.likes.add(user)
            comment.save()
            return LikeCommentMutation(success=True, errors=None)
        except Exception as e:
            return LikeCommentMutation(success=False, errors=str(e))


class DislikeCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.String()

    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, comment_id):
        try:
            user = info.context.user
            comment = Comment.objects.get(
                id=base64.b64decode(comment_id).decode("utf-8").split(":")[1]
            )
            if user in comment.dislikes.all():
                comment.dislikes.remove(user)
                comment.save()
                return DislikeCommentMutation(success=True, errors=None)
            comment.dislikes.add(user)
            comment.save()
            return DislikeCommentMutation(success=True, errors=None)
        except Exception as e:
            return DislikeCommentMutation(success=False, errors=str(e))
