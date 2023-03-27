import graphene
from ..models import Image
from graphene_file_upload.scalars import Upload


class ImageInput(graphene.InputObjectType):
    image = Upload(required=True,  upload_to='images/')


class CreateImageMutation(graphene.Mutation):
    class Arguments:
        input = ImageInput()

    success = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        try:
            image = Image.objects.create(image=input.image)
            image.save()
            success = True
        except Exception as e:
            print(e)
            success = False
        return CreateImageMutation(succes=success, image=image, )
