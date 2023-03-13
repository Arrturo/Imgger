from django.contrib.auth import get_user_model
import graphene
from ..models import Image
from graphene_file_upload.scalars import Upload

class CreateImageMutation(graphene.Mutation):
    class Arguments:
        image = Upload(required=True)

    image = graphene.Field(Image)

    def mutate(self, info, image):
        image = Image(image=image)
        image.save()
        return CreateImageMutation(image=image)
    
class UpdateImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)
        image = Upload()

    image = graphene.Field(Image)

    def mutate(self, info, image_id, image):
        image = Image.objects.get(id=image_id)
        if image:
            image.image = image
        image.save()
        return UpdateImageMutation(image=image)
    
class DeleteImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)

    image = graphene.Field(Image)

    def mutate(self, info, image_id):
        image = Image.objects.get(id=image_id)
        image.delete()
        return DeleteImageMutation(image=image)
    
