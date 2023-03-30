from django.contrib.auth import get_user_model
from ..types import CommentType
import graphene
from ..models import Comment
from graphql_jwt.decorators import login_required



class CreateSubCommentMutation(graphene.Mutation):
    class Arguments:
        description = graphene.String(required=True)
        user_id = graphene.ID(required=True)
        comment_id = graphene.ID(required=True)

    subcomment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, description, user_id, comment_id):
        user = get_user_model().objects.get(id=user_id)
        comment = Comment.objects.get(id=comment_id)
        subcomment = Comment(description=description,
                             user=user, comment=comment)
        subcomment.save()
        return CreateSubCommentMutation(subcomment=subcomment)


class UpdateSubCommentMutation(graphene.Mutation):
    class Arguments:
        subcomment_id = graphene.ID(required=True)
        description = graphene.String()
        user_id = graphene.ID()
        comment_id = graphene.ID()

    subcomment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, subcomment_id, description, user_id, comment_id):
        subcomment = Comment.objects.get(id=subcomment_id)
        if description:
            subcomment.description = description
        if user_id:
            user = get_user_model().objects.get(id=user_id)
            subcomment.user = user
        if comment_id:
            comment = Comment.objects.get(id=comment_id)
            subcomment.comment = comment
        subcomment.save()
        return UpdateSubCommentMutation(subcomment=subcomment)


class DeleteSubCommentMutation(graphene.Mutation):
    class Arguments:
        subcomment_id = graphene.ID(required=True)

    subcomment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, subcomment_id):
        subcomment = Comment.objects.get(id=subcomment_id)
        subcomment.delete()
        return DeleteSubCommentMutation(subcomment=subcomment)
