from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    email = models.EmailField(
        error_messages={"unique": "A user with that email already exists."},
        max_length=254,
        verbose_name="email address",
        unique=True,
    )

    def __str__(self):
        return self.username
