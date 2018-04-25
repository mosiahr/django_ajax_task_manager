from django.db import models
from django.contrib.auth.models import User

from django.utils.translation import ugettext as _


class Category(models.Model):
    name = models.CharField(max_length=140, verbose_name=_('Name'))
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = _('category')
        verbose_name_plural = _('categories')


class Task(models.Model):
    name = models.CharField(max_length=140, verbose_name=_('Name'))
    category = models.ForeignKey(Category,  on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    # deadline = models.DateField()
    # author = models.ForeignKey(User,  on_delete=models.CASCADE)
    # performer = models.ManyToManyField(User, related_name='performer', verbose_name=_('Performer'))
    # is_complete = models.BooleanField(default=False)
    # is_star = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


    # def get_performer(self):
    #     return ", \n".join([l.username for l in self.performer.all()])
    
    class Meta:
        ordering = ["-updated"]