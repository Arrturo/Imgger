from django.apps import apps
from django.contrib import admin

from .models import Category, Comment, ExtendUser, Image, Post, Subcomment

# Register your models here.


admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Image)
admin.site.register(Comment)
admin.site.register(Subcomment)
admin.site.register(ExtendUser)

app = apps.get_app_config("graphql_auth")

for model_name, model in app.models.items():
    admin.site.register(model)
