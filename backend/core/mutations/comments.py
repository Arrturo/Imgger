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
