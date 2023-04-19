import graphene
from django.contrib.auth import authenticate
from graphql_auth import mutations
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_payload, get_token

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
    expiration_time = graphene.Int()
    token = graphene.String()
    refresh_token = graphene.String()

    @classmethod
    def mutate(cls, root, info, username, password, **kwargs):
        try:
            context = info.context
            user = authenticate(username=username, password=password)
            if user is not None:
                context.jwt_cookie = True
                context.jwt_refresh_token = create_refresh_token(user)
                context.jwt_token = get_token(user)
                context.user = user
                expiration_time = get_payload(context.jwt_token).get("exp")
                return cls(
                    user=user,
                    success=True,
                    errors=None,
                    expiration_time=expiration_time,
                )
            else:
                return cls(user=None, success=False, errors="Invalid credentials")
        except Exception as e:
            return cls(success=False, errors=str(e))


class RefreshMutation(graphene.Mutation, AuthMutation):
    success = graphene.Boolean()
    errors = graphene.String()
    exp = graphene.Int()

    def mutate(self, info, **kwargs):
        refresh_token = info.context.COOKIES.get("JWT-refresh-token")
        if refresh_token:
            try:
                schema = graphene.Schema(mutation=AuthMutation)
                result = schema.execute(
                    '''
                    mutation {
                        refreshToken(refreshToken: "'''
                    + refresh_token
                    + """")
                          {
                            token
                            payload
                            }
                        }
                    """
                )
                info.context.jwt_token = result.data.get("refreshToken").get("token")
                exp = result.data.get("refreshToken").get("payload").get("exp")
                return RefreshMutation(success=True, errors=None, exp=exp)
            except Exception as e:
                return RefreshMutation(success=False, errors=str(e))
        else:
            return RefreshMutation(success=False, errors="No refresh token")
