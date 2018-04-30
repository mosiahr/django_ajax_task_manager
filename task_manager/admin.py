from django.contrib import admin
from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext_lazy
from .models import Category, Task, Mark


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'mark', 'author', 'get_performer']
    list_filter = ('author', 'performer', 'category', 'mark')
    fields = ('name', 'category', 'mark', 'description', 'deadline', 'performer')
    actions = ['delete_selected']

    class Meta:
        model = Task

    def save_model(self, request, obj, form, change):
        obj.author = request.user
        obj.save()
        super(TaskAdmin, self).save_model(request, obj, form, change)

    def delete_selected(self, request, queryset):
        if not self.has_delete_permission(request):
            raise PermissionDenied
        for obj in queryset:
            obj.delete()

    delete_selected.short_description = ugettext_lazy("Delete selected %(verbose_name_plural)s")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'updated']
    fields = ('name', )

    class Meta:
        model = Category


@admin.register(Mark)
class MarkAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'updated']
    fields = ('name', )

    class Meta:
        model = Mark