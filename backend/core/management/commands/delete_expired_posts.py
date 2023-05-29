from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Post
from firebase_admin import storage


class Command(BaseCommand):
    help = "Delete expired posts"

    def handle(self, *args, **options):
        try:
            posts = Post.objects.filter(expiration_date__lte=timezone.now())
            for post in posts:
                if post.image:
                    bucket = storage.bucket()
                    image = post.image
                    post.delete()
                    if image:
                        bucket = storage.bucket()
                        url = image.url.split("/")[-1]
                        blob = bucket.blob("images/" + url)
                        blob.delete()
                        image.delete()
            self.stdout.write(self.style.SUCCESS("Successfully deleted expired posts"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))