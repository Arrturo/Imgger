import base64

import graphene
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required

from ..models import Comment, Subcomment
from ..types import CommentType, SubcommentType


class CreateSubCommentMutation(graphene.Mutation):
    class Arguments:
        description = graphene.String(required=True)
        comment_id = graphene.String(required=True)

    subcomment = graphene.Field(SubcommentType)
    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, description, comment_id):
        try:
            user = info.context.user
            id = base64.b64decode(comment_id).decode("utf-8").split(":")[1]
            comment = Comment.objects.get(id=id)
            subcomment = Subcomment(content=description, user=user, comment=comment)
            subcomment.save()
            return CreateSubCommentMutation(
                subcomment=subcomment, success=True, errors=None
            )
        except Exception as e:
            return CreateSubCommentMutation(success=False, errors=str(e))


class DeleteSubCommentMutation(graphene.Mutation):
    class Arguments:
        subcomment_id = graphene.ID()

    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, subcomment_id):
        user = info.context.user
        try:
            subcomment = Subcomment.objects.get(
                id=base64.b64decode(subcomment_id).decode("utf-8").split(":")[1]
            )
            if not (user.is_staff or subcomment.user.id == user.id):
                return DeleteSubCommentMutation(
                    success=False,
                    errors="Only admins and the author can delete this post",
                )
            subcomment.delete()
            return DeleteSubCommentMutation(success=True, errors=None)
        except Exception as e:
            return DeleteSubCommentMutation(success=False, errors=str(e))


class UpdateSubCommentMutation(graphene.Mutation):
    class Arguments:
        subcomment_id = graphene.ID()
        description = graphene.String(required=True)

    subcomment = graphene.Field(SubcommentType)
    success = graphene.Boolean()
    errors = graphene.String()

    @login_required
    def mutate(self, info, subcomment_id, description):
        user = info.context.user
        try:
            subcomment = Subcomment.objects.get(
                id=base64.b64decode(subcomment_id).decode("utf-8").split(":")[1]
            )
            if not (user.is_staff or subcomment.user.id == user.id):
                return UpdateSubCommentMutation(
                    success=False,
                    errors="Only admins and the author can update this post",
                )
            subcomment.content = description
            subcomment.save()
            return UpdateSubCommentMutation(
                subcomment=subcomment, success=True, errors=None
            )
        except Exception as e:
            return UpdateSubCommentMutation(success=False, errors=str(e))
