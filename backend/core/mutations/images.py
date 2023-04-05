import graphene
from ..models import Image
from ..types import ImageType
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required


class CreateImageMutation(graphene.Mutation):
    class Arguments:
        image = Upload(required=True)

    success = graphene.Boolean()
    image = graphene.Field(ImageType)
    errors = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, image):
        try:
            file = image
            image = Image.objects.create(file=file)
            return CreateImageMutation(success=True, image=image)
        except Exception as e:
            return CreateImageMutation(success=False, errors=str(e))