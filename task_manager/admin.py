from django.contrib import admin

from .models import Category, Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['name', 'category']
    # list_display = ['name', 'is_star', 'get_performer', 'is_complete']
    # fields = ('name', 'category', 'deadline', 'author', 'performer', 'is_star', 'is_complete')


@admin.register(Category)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    fields = ('name', )



