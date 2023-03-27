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


class DeleteCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)

    comment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, comment_id):
        comment = Comment.objects.get(id=comment_id)
        comment.delete()
        return DeleteCommentMutation(comment=comment)