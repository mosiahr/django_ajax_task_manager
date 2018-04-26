from django.contrib import admin

from .models import Category, Task, Mark


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'mark']
    # list_display = ['name', 'is_star', 'get_performer', 'is_complete']
    # fields = ('name', 'category', 'deadline', 'author', 'performer', 'is_star', 'is_complete')


@admin.register(Category)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'updated']
    fields = ('name', )


@admin.register(Mark)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'updated']
    fields = ('name', )
