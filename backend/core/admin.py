from django.contrib import admin

# Register your models here.

from .models import Post, Category, Image, Comment, Subcomment
from django.apps import apps


admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Image)
admin.site.register(Comment)
admin.site.register(Subcomment)

app = apps.get_app_config('graphql_auth')

for model_name, model in app.models.items():
    admin.site.register(model)