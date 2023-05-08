import random

import graphene
from firebase_admin import storage
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
    def mutate(root, info, image):
        try:
            bucket = storage.bucket()
            blob = bucket.blob(f"images/{random.random()}.{image.name}")
            blob.upload_from_string(image.read(), content_type=image.content_type)
            blob.make_public()

            image_obj = Image.objects.create(url=blob.public_url, name=image.name)
            return CreateImageMutation(success=True, image=image_obj)
        except Exception as e:
            return CreateImageMutation(success=False, errors=str(e))


class UpdateImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)
        image = Upload(required=True)

    success = graphene.Boolean()
    image = graphene.Field(ImageType)
    errors = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, image_id, image):
        try:
            image_obj = Image.objects.get(id=image_id)
            if image_obj:
                bucket = storage.bucket()
                blob = bucket.blob(f"images/{random.random()}{image.name}")
                blob.upload_from_string(image.read(), content_type=image.content_type)
                blob.make_public()

                image_obj.url = blob.public_url
                image_obj.name = image.name
                image_obj.save()
            return UpdateImageMutation(success=True, image=image_obj)
        except Exception as e:
            return UpdateImageMutation(success=False, errors=str(e))


class DeleteImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, image_id):
        try:
            image_obj = Image.objects.get(id=image_id)
            if image_obj:
                bucket = storage.bucket()
                url = image_obj.url.split("/")[-1]
                blob = bucket.blob(url)
                blob.delete()
                image_obj.delete()
            return DeleteImageMutation(success=True)
        except Exception as e:
            return DeleteImageMutation(success=False, errors=str(e))
