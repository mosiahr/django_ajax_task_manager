from django.contrib import admin

from .models import Category, Task, Mark


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'mark']
    list_filter = ('category', 'mark')


@admin.register(Category)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'updated']
    fields = ('name', )


@admin.register(Mark)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'updated']
    fields = ('name', )
