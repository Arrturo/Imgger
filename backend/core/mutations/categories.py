from ..types import CategoryType
import graphene
from ..models import Category

class CreateCategoryMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    category = graphene.Field(CategoryType)
    category = Category.objects.get()
    
    def mutate(self, info, name):
        category = Category(name=name)
        category.save()
        return CreateCategoryMutation(category=category)

class UpdateCategoryMutation(graphene.Mutation):
    class Arguments:
        category_id = graphene.ID(required=True)
        name = graphene.String()

    category = graphene.Field(CategoryType)

    def mutate(self, info, category_id, name):
        category = Category.objects.get(id=category_id)
        if name:
            category.name = name
        category.save()
        return UpdateCategoryMutation(category=category)

class DeleteCategoryMutation(graphene.Mutation):
    class Arguments:
        category_id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, category_id):
        category = Category.objects.get(id=category_id)
        if not category:
            return DeleteCategoryMutation(success=False, errors=["Category not found"])
        try:
            category.delete()
            success = True
            errors = None
        except:
            success = False
            errors = ["Something went wrong"]
        return DeleteCategoryMutation(success=success, errors=errors)