import graphene
from django.contrib.auth import authenticate
from django.utils.deprecation import MiddlewareMixin
from graphql_auth import mutations
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_token

from ..models import ExtendUser
from ..types import UserType


class AuthMutation(graphene.ObjectType):
    refresh_token = mutations.RefreshToken.Field()


class UpdateUserMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        username = graphene.String()
        email = graphene.String()
        password = graphene.String()
        isStaff = graphene.Boolean()

    user = graphene.Field(UserType)

    @login_required
    def mutate(self, info, user_id, username, email, password, isStaff=None):
        user = ExtendUser.objects.get(id=user_id)
        if username:
            user.username = username
        if email:
            user.email = email
        if password:
            user.set_password(password)
        if isStaff is not None:
            user.is_staff = isStaff
        user.save()
        return UpdateUserMutation(user=user)


class DeleteUserMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)

    user = graphene.Field(UserType)

    @login_required
    def mutate(self, info, user_id):
        user = ExtendUser.objects.get(id=user_id)
        user.delete()
        return DeleteUserMutation(user=user)


class LoginMutation(graphene.Mutation):
    # Define mutation fields
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    success = graphene.Boolean()
    errors = graphene.String()

    @classmethod
    def mutate(cls, root, info, username, password, **kwargs):
        try:
            context = info.context
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.status.verified:
                    context.jwt_cookie = True
                    context.jwt_refresh_token = create_refresh_token(user)
                    context.jwt_token = get_token(user)
                    context.user = user
                    return cls(
                        user=user,
                        success=True,
                        errors=None,
                    )
                else:
                    return cls(
                        user=None,
                        success=False,
                        errors="Please verify your email address",
                    )
            else:
                return cls(user=None, success=False, errors="Invalid credentials")
        except Exception as e:
            return cls(success=False, errors=str(e))


class RefreshTokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if (
            request.COOKIES.get("JWT-refresh-token")
            and request.COOKIES.get("JWT-token") is None
        ):
            schema = graphene.Schema(mutation=AuthMutation)
            result = schema.execute(
                '''
                mutation {
                    refreshToken(refreshToken: "'''
                + request.COOKIES.get("JWT-refresh-token")
                + """")
                            {
                                token
                                }
                            }
                        """
            )
            request.jwt_token = result.data.get("refreshToken").get("token")
