import base64

import graphene
from graphql_jwt.decorators import login_required, staff_member_required

from ..models import Category
from ..types import CategoryType


class CreateCategoryMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=False)

    category = graphene.Field(CategoryType)

    @staff_member_required
    @login_required
    def mutate(self, info, name):
        user = info.context.user
        if user.is_authenticated:
            category = Category(name=name)
            category.save()
            return CreateCategoryMutation(category=category)
        else:
            raise Exception("Not logged in!")


class UpdateCategoryMutation(graphene.Mutation):
    class Arguments:
        category_id = graphene.ID(required=True)
        name = graphene.String()

    category = graphene.Field(CategoryType)

    @login_required
    @staff_member_required
    def mutate(self, info, category_id, name):
        category = Category.objects.get(
            id=base64.b64decode(category_id).decode("utf-8").split(":")[1]
        )
        if name:
            category.name = name
        category.save()
        return UpdateCategoryMutation(category=category)


class DeleteCategoryMutation(graphene.Mutation):
    class Arguments:
        category_id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @staff_member_required
    @login_required
    def mutate(self, info, category_id):
        user = info.context.user
        print(user)
        if user.is_authenticated:
            category = Category.objects.get(id=base64.b64decode(category_id)
                                            .decode("utf-8").split(':')[1])
            try:
                category.delete()
                success = True
                errors = None
            except Exception as e:
                success = False
                errors = str(e)
            return DeleteCategoryMutation(success=success, errors=errors)
        else:
            raise Exception("Not logged in!")
