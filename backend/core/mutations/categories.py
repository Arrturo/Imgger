from ..types import CategoryType
import graphene
from ..models import Category

class CreateCategoryMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    category = graphene.Field(CategoryType)
    
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

    category = graphene.Field(CategoryType)

    def mutate(self, info, category_id):
        category = Category.objects.get(id=category_id)
        category.delete()
        return DeleteCategoryMutation(category=category)