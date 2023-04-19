# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractUser


class ExtendUser(AbstractUser):
    email = models.EmailField(blank=False, max_length=255,
                              verbose_name="email")

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    def __str__(self):
        return f"{self.username}"


class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"


class Image(models.Model):
    name = models.CharField(max_length=255)
    url = models.CharField(max_length=255, null=False)

    def __str__(self):
        return f"{self.file}"


class Post(models.Model):
    title = models.CharField(max_length=25, null=False)
    likes = models.ManyToManyField(ExtendUser, related_name="likes",
                                   blank=True)
    dislikes = models.ManyToManyField(ExtendUser, related_name="dislikes",
                                      blank=True)
    description = models.TextField(max_length=255, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(ExtendUser, null=False, on_delete=models.CASCADE)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, null=False,
                                 on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    user = models.ForeignKey(ExtendUser, on_delete=models.CASCADE)
    comment = models.CharField(max_length=2555)
    create_time = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.comment[:20]}"


class Subcomment(models.Model):
    user = models.ForeignKey(ExtendUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    content = models.CharField(max_length=2555)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.content[:20]}"
