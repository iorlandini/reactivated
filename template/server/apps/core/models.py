from django.db import models

from custom_user.models import AbstractEmailUser

from typing import Any


class EmailUser(AbstractEmailUser):
    objects: Any
