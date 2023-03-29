import graphene
from ..models import Image
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required


class ImageInput(graphene.InputObjectType):
    image = Upload(required=True)


class CreateImageMutation(graphene.Mutation):
    class Arguments:
        input = ImageInput(required=True)

    ok = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        image = input.image
        Image.objects.create(image=image)
        ok = True
        return CreateImageMutation(ok=ok)


class UpdateImageMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ImageInput(required=True)

    ok = graphene.Boolean()

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