from django.db import models
from django.contrib.auth.models import User

from django.utils.translation import ugettext as _


class Category(models.Model):
    name = models.CharField(max_length=140, verbose_name=_('Name'))
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Task(models.Model):
    name = models.CharField(max_length=140, verbose_name=_('Name'))
    category = models.ForeignKey(Category,  on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    deadline = models.DateField()
    author = models.CharField(max_length=140, verbose_name=_('Author'))
    performer = models.ManyToManyField(User, verbose_name=_('User'))
    is_complete = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

