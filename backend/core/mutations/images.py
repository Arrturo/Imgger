import graphene
from ..models import Image
from graphene_file_upload.scalars import Upload


class ImageInput(graphene.InputObjectType):
    image = Upload(required=True)


class CreateImageMutation(graphene.Mutation):
    class Arguments:
        input = ImageInput(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        image = input.image
        Image.objects.create(image=image)
        ok = True
        return CreateImageMutation(ok=ok)
