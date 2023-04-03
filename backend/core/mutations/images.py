import graphene
from ..models import Image
from ..types import ImageType
from graphene_file_upload.scalars import Upload


class CreateImageMutation(graphene.Mutation):
    class Arguments:
        image = Upload(required=True)

    success = graphene.Boolean()
    image = graphene.Field(ImageType)
    errors = graphene.String()

    @staticmethod
    def mutate(root, info, image):
        try:
            file = image
            image = Image.objects.create(file=file)
            return CreateImageMutation(success=True, image=image)
        except Exception as e:
            return CreateImageMutation(success=False, errors=str(e))