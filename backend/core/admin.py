from django.contrib import admin

# Register your models here.

from .models import Post, Category, Image, Comment, Subcomment

admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Image)
admin.site.register(Comment)
admin.site.register(Subcomment)
