import base64
from ..types import CategoryType
import graphene
from ..models import Category
import base64

from graphql_jwt.decorators import login_required, staff_member_required


class CreateCategoryMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
    category = graphene.Field(CategoryType)
    
    @login_required
    def mutate(self, info, name):
        category = Category(name=name)
        category.save()
        return CreateCategoryMutation(category=category)



class UpdateCategoryMutation(graphene.Mutation):
    class Arguments:
        category_id = graphene.ID(required=True)
        name = graphene.String()

    category = graphene.Field(CategoryType)

    @staff_member_required
    def mutate(self, info, category_id, name):
        category = Category.objects.get(id=base64.b64decode(category_id)
                                        .decode("utf-8").split(':')[1])
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
    def mutate(self, info, category_id):
        category = Category.objects.get(id=base64.b64decode(category_id)
                                        .decode("utf-8").split(':')[1])
                                        
        if not category:
            return DeleteCategoryMutation(
                success=False,
                errors=["Category not found"])
        try:
            category.delete()
            success = True
            errors = None
        except Exception as e:
            success = False
            errors = str(e)
        return DeleteCategoryMutation(success=success, errors=errors)
