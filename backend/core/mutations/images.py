import graphene
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required

from ..models import Image
from ..types import ImageType


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
            bucket = storage.bucket()
            blob = bucket.blob(image.name)
            blob.upload_from_string(image.read(), content_type=image.content_type)

            image_obj = Image.objects.create(url=blob.public_url, name=image.name)
            return CreateImageMutation(success=True, image=image_obj)
        except Exception as e:
            return CreateImageMutation(success=False, errors=str(e))


class UpdateImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)
        image = Upload()

    success = graphene.Boolean()
    image = graphene.Field(ImageType)
    errors = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, image_id, image):
        try:
            image = Image.objects.get(id=image_id)
            if image:
                image.file = image
                image.save()
            return UpdateImageMutation(success=True, image=image)
        except Exception as e:
            return UpdateImageMutation(success=False, errors=str(e))


class DeleteImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)

    success = graphene.Boolean()
    image = graphene.Field(ImageType)
    errors = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, image_id):
        try:
            image = Image.objects.get(id=image_id)
            image.delete()
            return DeleteImageMutation(success=True, image=image)
        except Exception as e:
            return DeleteImageMutation(success=False, errors=str(e))
