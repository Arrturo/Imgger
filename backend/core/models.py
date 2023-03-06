# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=25, null=False)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    description = models.TextField(max_length=255, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    user_id = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    image_id = models.ForeignKey('Image', on_delete=models.CASCADE)
    category_id = models.ForeignKey(
        'Category', null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title}"


class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"


class Image(models.Model):
    file = models.ImageField()


class Comment(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.CharField(max_length=2555)
    create_time = models.DateTimeField(auto_now_add=True)
    post_id = models.ForeignKey('Post', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.comment[:20]}"


class Subcomment(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_id = models.ForeignKey('Comment', on_delete=models.CASCADE)
    content = models.CharField(max_length=2555)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.content[:20]}"
