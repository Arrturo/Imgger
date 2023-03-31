from django.contrib.auth.models import User
from ..types import UserType
import graphene
from django.contrib.auth import authenticate
from graphql_jwt.shortcuts import get_token


class CreateUserMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)

    def mutate(self, info, username, email, password):
        user = User.objects.create_user(username, email, password)
        user.save()
        return CreateUserMutation(user=user)


class UpdateUserMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        username = graphene.String()
        email = graphene.String()
        password = graphene.String()
        isStaff = graphene.Boolean()

    user = graphene.Field(UserType)

    def mutate(self, info, user_id, username, email, password, isStaff=None):
        user = User.objects.get(id=user_id)
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

    def mutate(self, info, user_id):
        user = User.objects.get(id=user_id)
        user.delete()
        return DeleteUserMutation(user=user)


class LoginMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if user is None:
            raise Exception('Invalid credentials')
        token = get_token(user)
        return LoginMutation(token=token)
