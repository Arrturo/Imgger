import graphene
from ..models import Image
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required

class CreateImageMutation(graphene.Mutation):
    class Arguments:
        input = Upload(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        try:
            image = Image.objects.create(image=input.image)
            image.save()
            success = True
            errors = None
        except Exception as e:
            success = False
            errors = str(e)
        return CreateImageMutation(succes=success, errors=errors)


class UpdateImageMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = Upload(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    @staticmethod
    def mutate(root, info, id, input):
        try:
            image = Image.objects.get(pk=id)
            image.image = input.image
            image.save()
            success = True
            errors = None
        except Exception as e:
            success = False
            errors = str(e)
        return UpdateImageMutation(success=success, errors=errors)


class DeleteImageMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    @staticmethod
    def mutate(root, info, id):
        try:
            image = Image.objects.get(pk=id)
            image.delete()
            success = True
            errors = None
        except Exception as e:
            success = False
            errors = str(e)
        return DeleteImageMutation(success=success, errors=errors)


class UpdateImageMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = Upload(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, id, input):
        image = input.image
        Image.objects.filter(id=id).update(image=image)
        ok = True
        return UpdateImageMutation(ok=ok)


class DeleteImageMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, id):
        Image.objects.filter(id=id).delete()
        ok = True
        return DeleteImageMutation(ok=ok)